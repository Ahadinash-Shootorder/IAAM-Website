# AWS Deployment Guide for IAAM Next.js Project

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Prerequisites](#prerequisites)
4. [Deployment Options](#deployment-options)
5. [Step-by-Step Deployment](#step-by-step-deployment)
6. [Environment Configuration](#environment-configuration)
7. [Monitoring & Logging](#monitoring--logging)
8. [Scaling & Performance](#scaling--performance)
9. [Security Best Practices](#security-best-practices)
10. [Troubleshooting](#troubleshooting)
11. [Cost Optimization](#cost-optimization)

---

## Overview

This document provides complete instructions for deploying the IAAM Next.js application on Amazon Web Services (AWS). The application is a React-based website that connects to a Strapi backend API.

### Project Details
- **Framework**: Next.js 16.1.1
- **React Version**: 19.2.3
- **Node.js**: 18+ recommended
- **Styling**: Tailwind CSS 4
- **Backend**: Strapi CMS (External)
- **Deployment Target**: AWS

---

## Architecture

### Recommended AWS Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CloudFront (CDN)                     │
│              Global Content Distribution                │
└────────────────┬────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────┐
│                  Application Load Balancer              │
│              (Health Checks & SSL/TLS)                  │
└────────────────┬────────────────────────────────────────┘
                 │
         ┌───────┴───────┐
         │               │
    ┌────▼────┐     ┌────▼────┐
    │  ECS/   │     │  ECS/   │
    │ Fargate │     │ Fargate │
    │ Instance│     │ Instance│
    │    1    │     │    2    │
    └────┬────┘     └────┬────┘
         │               │
    ┌────▼───────────────▼────┐
    │   RDS (Optional DB)     │
    └─────────────────────────┘

    External: Strapi API (AWS EC2)
```

### Components Used
- **AWS Amplify** or **ECS Fargate**: For containerized deployment
- **CloudFront**: CDN for static assets
- **S3**: Static file storage
- **RDS**: Database (if needed)
- **IAM**: Access management
- **CloudWatch**: Monitoring and logging
- **Route 53**: DNS management

---

## Prerequisites

### AWS Account Setup
1. Active AWS account with billing enabled
2. IAM user with appropriate permissions:
   - EC2 (for ECS)
   - ECS/Fargate
   - ECR (Elastic Container Registry)
   - IAM
   - CloudFront
   - S3
   - Route 53
   - CloudWatch
   - Secrets Manager

### Local Setup
```bash
# Install AWS CLI
brew install awscli  # macOS
# or
sudo apt-get install awscli  # Linux
# or download from https://aws.amazon.com/cli/

# Configure AWS credentials
aws configure
# Enter: Access Key ID, Secret Access Key, Region, Output format

# Verify installation
aws --version
aws sts get-caller-identity
```

### Docker Installation (for ECS deployment)
```bash
# Install Docker Desktop from https://www.docker.com/products/docker-desktop
# Verify installation
docker --version
```

---

## Deployment Options

### Option 1: AWS Amplify (Recommended for Beginners)
- **Pros**: Easy setup, automatic CI/CD, Git integration
- **Cons**: Limited customization, higher costs at scale
- **Best for**: Quick deployments, small projects

### Option 2: ECS Fargate with Docker
- **Pros**: Scalable, serverless containers, cost-effective
- **Cons**: Requires Docker knowledge
- **Best for**: Production applications

### Option 3: EC2 with PM2
- **Pros**: Full control, traditional approach
- **Cons**: Manual scaling, more maintenance
- **Best for**: Custom requirements

### Option 4: AWS App Runner
- **Pros**: Automatic scaling, simple deployment
- **Cons**: Less control
- **Best for**: Simple applications

---

## Step-by-Step Deployment

### Option A: AWS Amplify Deployment (Recommended)

#### 1. Connect GitHub Repository
```bash
1. Go to AWS Amplify Console
2. Click "New app" → "Host web app"
3. Select "GitHub" and authorize
4. Choose your repository and branch (main)
5. Click "Next"
```

#### 2. Build Settings
Amplify will auto-detect Next.js. Review build settings:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
        - npm run lint
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - 'node_modules/**/*'
env:
  variables:
    NEXT_PUBLIC_STRAPI_URL: 'http://13.53.89.25:1337'
```

#### 3. Deploy
- Click "Save and deploy"
- Wait for build to complete (5-10 minutes)
- View live application at provided URL

#### 4. Custom Domain
```bash
1. In Amplify Console → Domain management
2. Add your custom domain
3. Update Route 53 records as directed
4. Enable HTTPS (automatic)
```

---

### Option B: ECS Fargate Deployment (Advanced)

#### 1. Create Docker Image

Create `Dockerfile` in project root:
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build Next.js application
RUN npm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
```

Create `.dockerignore`:
```
node_modules
.next
.git
.gitignore
README.md
.env.local
```

#### 2. Build and Push to ECR

```bash
# Create ECR repository
aws ecr create-repository --repository-name iaam-website --region us-east-1

# Get login token
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin {ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com

# Build image
docker build -t iaam-website:latest .

# Tag image
docker tag iaam-website:latest {ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/iaam-website:latest

# Push to ECR
docker push {ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/iaam-website:latest
```

#### 3. Create ECS Cluster

```bash
# Create cluster
aws ecs create-cluster --cluster-name iaam-cluster --region us-east-1

# Create task definition
aws ecs register-task-definition --cli-input-json file://task-definition.json --region us-east-1
```

Create `task-definition.json`:
```json
{
  "family": "iaam-website",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "iaam-website",
      "image": "{ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/iaam-website:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "hostPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NEXT_PUBLIC_STRAPI_URL",
          "value": "http://13.53.89.25:1337"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/iaam-website",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ],
  "executionRoleArn": "arn:aws:iam::{ACCOUNT_ID}:role/ecsTaskExecutionRole"
}
```

#### 4. Create ECS Service

```bash
# Create service
aws ecs create-service \
  --cluster iaam-cluster \
  --service-name iaam-service \
  --task-definition iaam-website \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=ENABLED}" \
  --region us-east-1
```

#### 5. Setup Load Balancer

```bash
# Create target group
aws elbv2 create-target-group \
  --name iaam-targets \
  --protocol HTTP \
  --port 3000 \
  --vpc-id vpc-xxx

# Create load balancer
aws elbv2 create-load-balancer \
  --name iaam-alb \
  --subnets subnet-xxx subnet-yyy \
  --security-groups sg-xxx

# Create listener
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:... \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:...
```

---

### Option C: AWS App Runner Deployment

```bash
# Create App Runner service
aws apprunner create-service \
  --service-name iaam-website \
  --source-configuration '{
    "CodeRepository": {
      "RepositoryUrl": "https://github.com/your-org/iiam",
      "SourceCodeVersion": {
        "Type": "BRANCH",
        "Value": "main"
      },
      "CodeConfiguration": {
        "ConfigurationSource": "REPOSITORY"
      }
    }
  }' \
  --region us-east-1
```

Create `app-runner-config.yaml` in project root:
```yaml
version: 1.0
runtime: nodejs18
build:
  commands:
    build:
      - npm ci
      - npm run build
run:
  command: npm start
  network:
    port: 3000
```

---

## Environment Configuration

### Setting Environment Variables

#### 1. Using AWS Secrets Manager
```bash
# Create secret
aws secretsmanager create-secret \
  --name iaam/prod \
  --secret-string '{
    "NEXT_PUBLIC_STRAPI_URL": "http://13.53.89.25:1337"
  }'

# Retrieve secret
aws secretsmanager get-secret-value --secret-id iaam/prod
```

#### 2. Using Environment Variable Files

Create `.env.production`:
```
NEXT_PUBLIC_STRAPI_URL=http://13.53.89.25:1337
```

#### 3. In Amplify Console
1. Go to App Settings → Environment variables
2. Add variables:
   - `NEXT_PUBLIC_STRAPI_URL`: `http://13.53.89.25:1337`
3. Save and redeploy

#### 4. In ECS/Fargate
Update `task-definition.json` with environment variables in containerDefinitions.

---

## Monitoring & Logging

### CloudWatch Logs Setup

#### 1. Create Log Group
```bash
aws logs create-log-group --log-group-name /ecs/iaam-website
aws logs put-retention-policy --log-group-name /ecs/iaam-website --retention-in-days 30
```

#### 2. View Logs
```bash
# Real-time logs
aws logs tail /ecs/iaam-website --follow

# Filter logs
aws logs filter-log-events \
  --log-group-name /ecs/iaam-website \
  --filter-pattern "ERROR"
```

### CloudWatch Metrics & Alarms

```bash
# Create alarm for CPU usage
aws cloudwatch put-metric-alarm \
  --alarm-name iaam-high-cpu \
  --alarm-description "Alert when CPU exceeds 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 60 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold

# Create alarm for memory usage
aws cloudwatch put-metric-alarm \
  --alarm-name iaam-high-memory \
  --alarm-description "Alert when memory exceeds 80%" \
  --metric-name MemoryUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 60 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold
```

### Enable Application Performance Monitoring

```bash
# Install X-Ray daemon
npm install aws-xray-sdk-core

# Add to application
import AWSXRay from 'aws-xray-sdk-core';

// Instrument AWS SDK
const dynamodb = AWSXRay.client(new DynamoDB());
```

---

## Scaling & Performance

### Auto Scaling Configuration

#### ECS Auto Scaling
```bash
# Register scalable target
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --resource-id service/iaam-cluster/iaam-service \
  --scalable-dimension ecs:service:DesiredCount \
  --min-capacity 2 \
  --max-capacity 10

# Create scaling policy (CPU)
aws application-autoscaling put-scaling-policy \
  --policy-name iaam-cpu-scaling \
  --service-namespace ecs \
  --resource-id service/iaam-cluster/iaam-service \
  --scalable-dimension ecs:service:DesiredCount \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration '{
    "TargetValue": 70.0,
    "PredefinedMetricSpecification": {
      "PredefinedMetricType": "ECSServiceAverageCPUUtilization"
    },
    "ScaleOutCooldown": 60,
    "ScaleInCooldown": 300
  }'
```

### Caching Strategy

#### CloudFront Configuration
```bash
# Create CloudFront distribution
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json
```

Create `cloudfront-config.json`:
```json
{
  "CallerReference": "iaam-dist-2024",
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "myOrigin",
        "DomainName": "iaam-alb-xxx.elb.amazonaws.com",
        "CustomOriginConfig": {
          "HTTPPort": 80,
          "OriginProtocolPolicy": "http-only"
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "myOrigin",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": {
      "Quantity": 2,
      "Items": ["GET", "HEAD"]
    },
    "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6"
  },
  "Enabled": true
}
```

### Performance Optimization

#### Next.js Build Optimization
```bash
# Enable React Compiler (already in config)
# Optimize images with next/image
# Use dynamic imports for code splitting
```

#### Database Query Optimization
```javascript
// Example: Cache API responses
export async function getStaticProps() {
  const data = await fetch('http://13.53.89.25:1337/api/events');
  return {
    props: { data },
    revalidate: 3600, // ISR: revalidate every hour
  };
}
```

---

## Security Best Practices

### 1. Network Security

```bash
# Create Security Group
aws ec2 create-security-group \
  --group-name iaam-sg \
  --description "IAAM application security group"

# Allow HTTPS
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxx \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0

# Allow HTTP (redirect to HTTPS)
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxx \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0

# Allow only from ALB to ECS
aws ec2 authorize-security-group-ingress \
  --group-id sg-ecs \
  --protocol tcp \
  --port 3000 \
  --source-group sg-alb
```

### 2. SSL/TLS Certificate Management

```bash
# Request ACM certificate
aws acm request-certificate \
  --domain-name yourdomain.com \
  --validation-method DNS \
  --region us-east-1

# Verify certificate and attach to ALB
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:... \
  --protocol HTTPS \
  --port 443 \
  --certificates CertificateArn=arn:aws:acm:... \
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:...
```

### 3. IAM Roles & Policies

```bash
# Create execution role for ECS
aws iam create-role \
  --role-name ecsTaskExecutionRole \
  --assume-role-policy-document file://trust-policy.json

# Attach policy
aws iam attach-role-policy \
  --role-name ecsTaskExecutionRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy

# Create custom policy for app (minimal permissions)
aws iam create-policy \
  --policy-name iaam-app-policy \
  --policy-document '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": ["logs:*"],
        "Resource": "arn:aws:logs:us-east-1:*:log-group:/ecs/iaam-website:*"
      }
    ]
  }'
```

### 4. API Security

```javascript
// Add security headers in next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ];
  },
};
```

### 5. Secrets Management

```bash
# Store sensitive data in Secrets Manager
aws secretsmanager create-secret \
  --name iaam/strapi-url \
  --secret-string 'http://13.53.89.25:1337' \
  --kms-key-id alias/aws/secretsmanager

# Rotate secrets
aws secretsmanager rotate-secret \
  --secret-id iaam/strapi-url \
  --rotation-rules AutomaticallyAfterDays=30
```

### 6. CORS Configuration

```javascript
// API route with CORS
// src/app/api/strapi/route.ts
export async function GET(request: Request) {
  const response = await fetch(process.env.NEXT_PUBLIC_STRAPI_URL!);
  
  return new Response(response.body, {
    headers: {
      'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
```

---

## Troubleshooting

### Common Issues & Solutions

#### 1. Application Won't Start

```bash
# Check ECS service logs
aws logs tail /ecs/iaam-website --follow

# Check task status
aws ecs describe-tasks \
  --cluster iaam-cluster \
  --tasks <task-arn>

# View task definition
aws ecs describe-task-definition \
  --task-definition iaam-website:1
```

**Solution**: Ensure environment variables are set correctly and Docker image is valid.

#### 2. High Memory Usage

```bash
# Monitor memory
aws cloudwatch get-metric-statistics \
  --namespace AWS/ECS \
  --metric-name MemoryUtilization \
  --dimensions Name=ServiceName,Value=iaam-service \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-02T00:00:00Z \
  --period 3600 \
  --statistics Average
```

**Solutions**:
- Increase task memory in task definition
- Enable auto-scaling
- Optimize code and dependencies

#### 3. Database Connection Errors

```javascript
// Add connection retry logic
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

async function fetchWithRetry(url: string, retries = 0): Promise<Response> {
  try {
    return await fetch(url);
  } catch (error) {
    if (retries < MAX_RETRIES) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retries + 1)));
      return fetchWithRetry(url, retries + 1);
    }
    throw error;
  }
}
```

#### 4. CloudFront Cache Issues

```bash
# Invalidate cache
aws cloudfront create-invalidation \
  --distribution-id ABCDEFG1234567 \
  --paths "/*"
```

#### 5. Build Failures in Amplify

Check build logs in Amplify console:
1. Verify `npm run build` works locally
2. Check Node.js version compatibility
3. Ensure all environment variables are set
4. Review buildspec output

---

## Cost Optimization

### 1. Right-Sizing Resources

```bash
# Analyze usage
aws ec2 describe-instance-types \
  --filters Name=memory,Values=512 \
  --query 'InstanceTypes[*].[InstanceType,MemoryInfo.SizeInMiB]'

# Recommend instances
aws ce get-reservation-purchase-recommendation \
  --service "Amazon Elastic Container Service"
```

### 2. AWS Cost Optimization Tips

| Service | Optimization |
|---------|---------------|
| **ECS/Fargate** | Use Fargate Spot for non-critical workloads (70% savings) |
| **CloudFront** | Enable compression and caching headers |
| **S3** | Use lifecycle policies for old objects |
| **NAT Gateway** | Use NAT instances instead (if cost-conscious) |
| **Data Transfer** | Keep within same region where possible |
| **RDS** | Use Reserved Instances for predictable workloads |

### 3. Cost Monitoring

```bash
# Setup billing alert
aws cloudwatch put-metric-alarm \
  --alarm-name iaam-monthly-bill \
  --alarm-description "Alert when bill exceeds $100" \
  --metric-name EstimatedCharges \
  --namespace AWS/Billing \
  --statistic Maximum \
  --period 86400 \
  --threshold 100 \
  --comparison-operator GreaterThanThreshold

# Get cost breakdown
aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-01-31 \
  --granularity MONTHLY \
  --metrics "BlendedCost" \
  --group-by Type=DIMENSION,Key=SERVICE
```

### 4. Reserved Instances & Savings Plans

```bash
# Purchase reserved instance
aws ec2 purchase-reserved-instances-offering \
  --reserved-instances-offering-id xxx \
  --instance-count 1
```

---

## Additional Resources

### AWS Documentation
- [AWS Amplify Docs](https://docs.aws.amazon.com/amplify/)
- [ECS/Fargate Guide](https://docs.aws.amazon.com/ecs/)
- [CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)
- [App Runner](https://docs.aws.amazon.com/apprunner/)

### Next.js Deployment
- [Next.js Deployment](https://nextjs.org/docs/deployment/static-exports)
- [Next.js on AWS](https://aws.amazon.com/blogs/compute/deploy-next-js-application-on-aws-amplify/)

### Monitoring & Logging
- [CloudWatch User Guide](https://docs.aws.amazon.com/cloudwatch/)
- [X-Ray Service Map](https://docs.aws.amazon.com/xray/latest/devguide/)

---

## Quick Reference Commands

### Deployment
```bash
# Amplify
amplify init
amplify add hosting
amplify publish

# ECS/Fargate
docker build -t iaam-website .
docker tag iaam-website:latest {ACCOUNT}.dkr.ecr.us-east-1.amazonaws.com/iaam-website:latest
docker push {ACCOUNT}.dkr.ecr.us-east-1.amazonaws.com/iaam-website:latest
aws ecs update-service --cluster iaam-cluster --service iaam-service --force-new-deployment
```

### Monitoring
```bash
# View logs
aws logs tail /ecs/iaam-website --follow

# Check service status
aws ecs describe-services --cluster iaam-cluster --services iaam-service

# Get metrics
aws cloudwatch get-metric-statistics --namespace AWS/ECS --metric-name CPUUtilization
```

### Maintenance
```bash
# Scale service
aws ecs update-service --cluster iaam-cluster --service iaam-service --desired-count 4

# Update task definition
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

---

## Support & Questions

For issues or questions:
1. Check AWS documentation
2. Review CloudWatch logs
3. Check AWS Support (if on Business/Enterprise plan)
4. Post on AWS forums
5. Check project's GitHub issues

---

**Last Updated**: January 2025
**Next.js Version**: 16.1.1
**AWS SDK Version**: Latest
