# AWS Operations & Maintenance Guide

## Table of Contents
1. [Daily Operations](#daily-operations)
2. [Monitoring & Alerts](#monitoring--alerts)
3. [Backup & Disaster Recovery](#backup--disaster-recovery)
4. [Performance Tuning](#performance-tuning)
5. [Security Hardening](#security-hardening)
6. [Scaling Operations](#scaling-operations)
7. [Database Management](#database-management)
8. [Content Delivery](#content-delivery)
9. [Common Operations](#common-operations)
10. [Troubleshooting Playbook](#troubleshooting-playbook)

---

## Daily Operations

### Monitoring Dashboard Setup

```bash
# Create CloudWatch dashboard
aws cloudwatch put-dashboard \
  --dashboard-name IAAM-Operations \
  --dashboard-body file://dashboard-config.json
```

### Dashboard Configuration (`dashboard-config.json`)
```json
{
  "widgets": [
    {
      "type": "metric",
      "properties": {
        "metrics": [
          ["AWS/ApplicationELB", "TargetResponseTime", {"stat": "Average"}],
          ["AWS/ApplicationELB", "RequestCount", {"stat": "Sum"}],
          ["AWS/ECS", "CPUUtilization", {"stat": "Average"}],
          ["AWS/ECS", "MemoryUtilization", {"stat": "Average"}],
          ["AWS/CloudFront", "Requests", {"stat": "Sum"}],
          ["AWS/CloudFront", "BytesDownloaded", {"stat": "Sum"}]
        ],
        "period": 300,
        "stat": "Average",
        "region": "us-east-1",
        "title": "Application Metrics"
      }
    }
  ]
}
```

### Health Checks

```bash
# Check ALB target health
aws elbv2 describe-target-health \
  --target-group-arn arn:aws:elasticloadbalancing:us-east-1:ACCOUNT:targetgroup/iaam/abc123

# Check ECS service status
aws ecs describe-services \
  --cluster iaam-cluster \
  --services iaam-service \
  --region us-east-1

# Check RDS instance (if using database)
aws rds describe-db-instances \
  --db-instance-identifier iaam-db \
  --region us-east-1
```

---

## Monitoring & Alerts

### CloudWatch Metrics

#### Application Metrics to Monitor
```bash
# Create metric for custom tracking
aws cloudwatch put-metric-data \
  --namespace IAAM/Application \
  --metric-name PageLoadTime \
  --value 245 \
  --unit Milliseconds

# Create metric for API response time
aws cloudwatch put-metric-data \
  --namespace IAAM/API \
  --metric-name StrapiResponseTime \
  --value 150 \
  --unit Milliseconds
```

### Alarm Configuration

#### High CPU Usage Alarm
```bash
aws cloudwatch put-metric-alarm \
  --alarm-name IAAM-HighCPU \
  --alarm-description "Alert when CPU exceeds 75%" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --evaluation-periods 2 \
  --threshold 75 \
  --comparison-operator GreaterThanThreshold \
  --alarm-actions arn:aws:sns:us-east-1:ACCOUNT:alerts
```

#### High Memory Usage Alarm
```bash
aws cloudwatch put-metric-alarm \
  --alarm-name IAAM-HighMemory \
  --alarm-description "Alert when memory exceeds 80%" \
  --metric-name MemoryUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --evaluation-periods 2 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --alarm-actions arn:aws:sns:us-east-1:ACCOUNT:alerts
```

#### API Error Rate Alarm
```bash
aws cloudwatch put-metric-alarm \
  --alarm-name IAAM-HighErrorRate \
  --alarm-description "Alert when error rate exceeds 5%" \
  --metric-name ErrorRate \
  --namespace IAAM/API \
  --statistic Average \
  --period 300 \
  --threshold 5 \
  --comparison-operator GreaterThanThreshold
```

#### Unhealthy Targets Alarm
```bash
aws cloudwatch put-metric-alarm \
  --alarm-name IAAM-UnhealthyTargets \
  --alarm-description "Alert when targets are unhealthy" \
  --metric-name UnHealthyHostCount \
  --namespace AWS/ApplicationELB \
  --statistic Average \
  --period 60 \
  --threshold 1 \
  --comparison-operator GreaterThanOrEqualToThreshold
```

### CloudWatch Logs

#### View Recent Logs
```bash
# Stream logs in real-time
aws logs tail /ecs/iaam-website --follow

# Get last 10 log events
aws logs tail /ecs/iaam-website --max-items 10

# Filter errors
aws logs tail /ecs/iaam-website --filter-pattern "ERROR"

# Search logs
aws logs filter-log-events \
  --log-group-name /ecs/iaam-website \
  --filter-pattern "startup"
```

#### Log Insights Queries
```sql
-- Find errors in last hour
fields @timestamp, @message
| filter @message like /ERROR/
| stats count() by bin(5m)

-- API response times
fields @timestamp, responseTime
| filter ispresent(responseTime)
| stats avg(responseTime), max(responseTime), pct(responseTime, 99) by bin(1m)

-- 4xx and 5xx errors
fields @timestamp, statusCode
| filter statusCode >= 400
| stats count() by statusCode

-- Strapi API latency
fields @timestamp, strapiLatency
| filter ispresent(strapiLatency)
| stats avg(strapiLatency) as avg_latency, max(strapiLatency) as max_latency
```

---

## Backup & Disaster Recovery

### Database Backup Strategy

#### Automated RDS Backups
```bash
# Enable automated backups
aws rds modify-db-instance \
  --db-instance-identifier iaam-db \
  --backup-retention-period 30 \
  --preferred-backup-window "03:00-04:00" \
  --apply-immediately

# Copy backup to another region
aws rds copy-db-snapshot \
  --source-db-snapshot-identifier arn:aws:rds:us-east-1:ACCOUNT:snapshot:iaam-snapshot \
  --target-db-snapshot-identifier iaam-snapshot-backup \
  --source-region us-east-1 \
  --region us-west-2
```

#### Manual Snapshot
```bash
# Create manual snapshot
aws rds create-db-snapshot \
  --db-instance-identifier iaam-db \
  --db-snapshot-identifier iaam-snapshot-$(date +%Y%m%d-%H%M%S)

# List snapshots
aws rds describe-db-snapshots --db-instance-identifier iaam-db
```

### Application Data Backup

#### S3 Backup
```bash
# Create S3 bucket for backups
aws s3 mb s3://iaam-backups-$(date +%s) --region us-east-1

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket iaam-backups-123456 \
  --versioning-configuration Status=Enabled

# Setup lifecycle policy
aws s3api put-bucket-lifecycle-configuration \
  --bucket iaam-backups-123456 \
  --lifecycle-configuration file://lifecycle-policy.json
```

Lifecycle Policy (`lifecycle-policy.json`):
```json
{
  "Rules": [
    {
      "Id": "Archive old backups",
      "Status": "Enabled",
      "Transitions": [
        {
          "Days": 90,
          "StorageClass": "GLACIER"
        }
      ],
      "Expiration": {
        "Days": 365
      }
    }
  ]
}
```

### Disaster Recovery Plan

#### RTO/RPO Targets
- **RTO (Recovery Time Objective)**: 30 minutes
- **RPO (Recovery Point Objective)**: 1 hour

#### DR Procedure

1. **Assess Incident**
   ```bash
   # Check service status
   aws ecs describe-services --cluster iaam-cluster --services iaam-service
   
   # Check recent errors
   aws logs tail /ecs/iaam-website --filter-pattern "CRITICAL" --max-items 50
   ```

2. **Failover Steps**
   ```bash
   # Create new ECS service from backup task definition
   aws ecs create-service \
     --cluster iaam-cluster \
     --service-name iaam-service-dr \
     --task-definition iaam-website:5 \
     --desired-count 2 \
     --launch-type FARGATE \
     --network-configuration "awsvpcConfiguration={subnets=[...],securityGroups=[...]}"
   
   # Update load balancer to point to DR service
   aws elbv2 modify-target-group \
     --target-group-arn arn:aws:elasticloadbalancing:... \
     --matcher HttpCode=200-299
   ```

3. **Database Failover** (if using RDS)
   ```bash
   # Failover to secondary instance
   aws rds promote-read-replica \
     --db-instance-identifier iaam-db-replica
   ```

4. **Verify Service**
   ```bash
   # Check service endpoints
   curl https://iaam.example.com/health
   
   # Verify API connectivity
   curl https://api.iaam.example.com/api/events
   ```

---

## Performance Tuning

### Database Optimization (RDS)

```bash
# Enable Performance Insights
aws rds modify-db-instance \
  --db-instance-identifier iaam-db \
  --enable-performance-insights-kms-key-id arn:aws:kms:us-east-1:ACCOUNT:key/12345 \
  --apply-immediately

# View Performance Insights data
aws pi describe-dimension-keys \
  --service-type RDS \
  --identifier db-ABCDEFGHIJKLMNOP \
  --start-time 2024-01-20T10:00:00Z \
  --end-time 2024-01-20T11:00:00Z \
  --period-in-seconds 60 \
  --group-by '{"Group":"db.user"}' \
  --metric db.load.avg
```

### ECS Task Optimization

```bash
# Adjust task CPU/memory allocation
aws ecs register-task-definition \
  --family iaam-website \
  --cpu 512 \
  --memory 1024 \
  --container-definitions '[
    {
      "name": "iaam-website",
      "cpu": 512,
      "memory": 1024,
      "essential": true
    }
  ]'

# Update service with new task definition
aws ecs update-service \
  --cluster iaam-cluster \
  --service iaam-service \
  --task-definition iaam-website:2 \
  --force-new-deployment
```

### CloudFront Optimization

#### Cache Settings
```bash
# Update cache behavior
aws cloudfront update-distribution \
  --id E123ABCDEF \
  --distribution-config '{
    "DefaultCacheBehavior": {
      "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6",
      "Compress": true,
      "ViewerProtocolPolicy": "redirect-to-https"
    }
  }'

# Invalidate cache
aws cloudfront create-invalidation \
  --distribution-id E123ABCDEF \
  --paths "/" "/api/*"
```

#### Cache Policy Options
- **Optimized for caching**: Long-term caching (1 year)
- **Optimized for dynamic content**: Short-term caching (1 second)
- **Custom**: Specific parameters

### Application Performance

#### Code Optimization
```typescript
// Use React memo for expensive components
import { memo } from 'react';

const ExpensiveComponent = memo(function ExpensiveComponent({ data }) {
  return <div>{data}</div>;
});

// Use dynamic imports for code splitting
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('@/components/Chart'), {
  loading: () => <p>Loading...</p>,
  ssr: false, // Skip SSR if needed
});

// Implement image optimization
import Image from 'next/image';

<Image
  src={imageUrl}
  alt="Event"
  width={400}
  height={300}
  priority={false}
  loading="lazy"
/>
```

#### API Response Optimization
```typescript
// Implement caching at API level
export const dynamic = 'force-static';

export const revalidate = 3600; // ISR: 1 hour

// Use selective field fetching
fetch(`${API_URL}/api/events?fields[0]=id&fields[1]=title&fields[2]=slug`)
```

---

## Security Hardening

### Network Security

#### Security Group Rules
```bash
# Allow HTTPS from anywhere
aws ec2 authorize-security-group-ingress \
  --group-id sg-iaam-app \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0

# Allow HTTP redirect (deprecated, but for redirects)
aws ec2 authorize-security-group-ingress \
  --group-id sg-iaam-app \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0

# Allow ECS to connect to database
aws ec2 authorize-security-group-ingress \
  --group-id sg-iaam-db \
  --protocol tcp \
  --port 5432 \
  --source-group sg-iaam-app

# Deny direct access to database
aws ec2 revoke-security-group-ingress \
  --group-id sg-iaam-db \
  --protocol tcp \
  --port 5432 \
  --cidr 0.0.0.0/0
```

### WAF (Web Application Firewall)

```bash
# Create IP set
aws wafv2 create-ip-set \
  --name iaam-ip-whitelist \
  --scope CLOUDFRONT \
  --ip-address-version IPV4 \
  --addresses '["203.0.113.0/24"]'

# Create WAF rule
aws wafv2 create-web-acl \
  --name iaam-waf \
  --scope CLOUDFRONT \
  --default-action Allow={} \
  --rules '[
    {
      "Name": "RateLimitRule",
      "Priority": 1,
      "Statement": {
        "RateBasedStatement": {
          "Limit": 2000,
          "AggregateKeyType": "IP"
        }
      },
      "Action": {"Block": {}},
      "VisibilityConfig": {
        "SampledRequestsEnabled": true,
        "CloudWatchMetricsEnabled": true,
        "MetricName": "RateLimitRule"
      }
    }
  ]'
```

### SSL/TLS Configuration

```bash
# Request new certificate
aws acm request-certificate \
  --domain-name iaam.example.com \
  --subject-alternative-names www.iaam.example.com \
  --validation-method DNS

# Update CloudFront with certificate
aws cloudfront update-distribution \
  --id E123ABCDEF \
  --distribution-config '{
    "ViewerCertificate": {
      "AcmCertificateArn": "arn:aws:acm:us-east-1:ACCOUNT:certificate/12345",
      "SslSupportMethod": "sni-only",
      "MinimumProtocolVersion": "TLSv1.2_2021"
    }
  }'
```

### Secrets Rotation

```bash
# Create rotation configuration
aws secretsmanager rotate-secret \
  --secret-id iaam/api-keys \
  --rotation-rules AutomaticallyAfterDays=30

# Retrieve secret in application
const secret = await aws.secretsManager.getSecretValue({
  SecretId: 'iaam/api-keys',
});
```

---

## Scaling Operations

### Auto Scaling Configuration

#### Target Tracking Scaling
```bash
# Register scalable target
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --resource-id service/iaam-cluster/iaam-service \
  --scalable-dimension ecs:service:DesiredCount \
  --min-capacity 2 \
  --max-capacity 10

# Create CPU-based scaling policy
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

# Create memory-based scaling policy
aws application-autoscaling put-scaling-policy \
  --policy-name iaam-memory-scaling \
  --service-namespace ecs \
  --resource-id service/iaam-cluster/iaam-service \
  --scalable-dimension ecs:service:DesiredCount \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration '{
    "TargetValue": 80.0,
    "PredefinedMetricSpecification": {
      "PredefinedMetricType": "ECSServiceAverageMemoryUtilization"
    }
  }'
```

#### Step Scaling (For more granular control)
```bash
aws application-autoscaling put-scaling-policy \
  --policy-name iaam-step-scaling \
  --service-namespace ecs \
  --resource-id service/iaam-cluster/iaam-service \
  --scalable-dimension ecs:service:DesiredCount \
  --policy-type StepScaling \
  --step-scaling-policy-configuration '{
    "AdjustmentType": "PercentChangeInCapacity",
    "StepAdjustments": [
      {
        "MetricIntervalLowerBound": 0,
        "MetricIntervalUpperBound": 10,
        "ScalingAdjustment": 10
      },
      {
        "MetricIntervalLowerBound": 10,
        "ScalingAdjustment": 30
      }
    ],
    "Cooldown": 300
  }'
```

### Load Balancer Configuration

```bash
# Update target group health check
aws elbv2 modify-target-group \
  --target-group-arn arn:aws:elasticloadbalancing:us-east-1:ACCOUNT:targetgroup/iaam/abc \
  --health-check-enabled \
  --health-check-protocol HTTP \
  --health-check-path /health \
  --health-check-interval-seconds 30 \
  --health-check-timeout-seconds 5 \
  --healthy-threshold-count 2 \
  --unhealthy-threshold-count 3 \
  --matcher HttpCode=200

# Register new targets
aws elbv2 register-targets \
  --target-group-arn arn:aws:elasticloadbalancing:us-east-1:ACCOUNT:targetgroup/iaam/abc \
  --targets Id=i-1234567890abcdef0 Port=3000
```

---

## Database Management

### RDS Operations

#### Create Read Replica
```bash
aws rds create-db-instance-read-replica \
  --db-instance-identifier iaam-db-replica \
  --source-db-instance-identifier iaam-db \
  --publicly-accessible false
```

#### Monitor Database
```bash
# Get database metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/RDS \
  --metric-name DatabaseConnections \
  --dimensions Name=DBInstanceIdentifier,Value=iaam-db \
  --start-time 2024-01-20T10:00:00Z \
  --end-time 2024-01-20T11:00:00Z \
  --period 300 \
  --statistics Average,Maximum
```

#### Parameter Group Management
```bash
# Create custom parameter group
aws rds create-db-parameter-group \
  --db-parameter-group-name iaam-params \
  --db-parameter-group-family postgres14 \
  --description "Custom parameters for IAAM"

# Modify parameters
aws rds modify-db-parameter-group \
  --db-parameter-group-name iaam-params \
  --parameters 'ParameterName=max_connections,ParameterValue=1000,ApplyMethod=pending-reboot'
```

---

## Content Delivery

### CloudFront Operations

#### Create Distribution
```bash
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json
```

#### Monitor CloudFront
```bash
# Get CloudFront metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/CloudFront \
  --metric-name BytesDownloaded \
  --dimensions Name=DistributionId,Value=E123ABCDEF \
  --start-time 2024-01-20T00:00:00Z \
  --end-time 2024-01-21T00:00:00Z \
  --period 3600 \
  --statistics Sum
```

#### Cache Invalidation
```bash
# Invalidate specific paths
aws cloudfront create-invalidation \
  --distribution-id E123ABCDEF \
  --paths "/" "/images/*" "/api/*"

# Check invalidation status
aws cloudfront get-invalidation \
  --distribution-id E123ABCDEF \
  --id I123ABC
```

---

## Common Operations

### Deploying Updates

```bash
# 1. Build new Docker image
docker build -t iaam-website:v2.0 .

# 2. Push to ECR
docker tag iaam-website:v2.0 ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/iaam-website:v2.0
docker push ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/iaam-website:v2.0

# 3. Register new task definition
aws ecs register-task-definition \
  --family iaam-website \
  --container-definitions '[
    {
      "image": "ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/iaam-website:v2.0",
      "name": "iaam-website",
      "portMappings": [{"containerPort": 3000}]
    }
  ]'

# 4. Update service
aws ecs update-service \
  --cluster iaam-cluster \
  --service iaam-service \
  --task-definition iaam-website:2 \
  --force-new-deployment

# 5. Monitor deployment
aws ecs describe-services \
  --cluster iaam-cluster \
  --services iaam-service
```

### Rolling Back

```bash
# If deployment fails, rollback to previous task definition
aws ecs update-service \
  --cluster iaam-cluster \
  --service iaam-service \
  --task-definition iaam-website:1 \
  --force-new-deployment

# Verify rollback
aws ecs describe-services --cluster iaam-cluster --services iaam-service
```

### Manual Scaling

```bash
# Scale up quickly
aws ecs update-service \
  --cluster iaam-cluster \
  --service iaam-service \
  --desired-count 5

# Scale down
aws ecs update-service \
  --cluster iaam-cluster \
  --service iaam-service \
  --desired-count 2
```

---

## Troubleshooting Playbook

### Service Won't Start

1. **Check task logs**
   ```bash
   aws logs tail /ecs/iaam-website --follow
   ```

2. **Check task definition**
   ```bash
   aws ecs describe-task-definition --task-definition iaam-website:latest
   ```

3. **Check container**
   ```bash
   # List tasks
   aws ecs list-tasks --cluster iaam-cluster --service-name iaam-service
   
   # Describe task
   aws ecs describe-tasks --cluster iaam-cluster --tasks <task-arn>
   ```

### High Latency

1. **Check database performance**
   ```bash
   aws cloudwatch get-metric-statistics \
     --namespace AWS/RDS \
     --metric-name DatabaseLatency \
     --start-time 2024-01-20T10:00:00Z \
     --end-time 2024-01-20T11:00:00Z \
     --period 60 \
     --statistics Average
   ```

2. **Check Strapi API**
   ```bash
   curl -w "@curl-format.txt" -o /dev/null -s http://13.53.89.25:1337/api/events
   ```

3. **Check CloudFront cache**
   ```bash
   curl -I https://iaam.example.com/
   # Look for X-Cache header
   ```

### Out of Memory

1. **Check memory usage**
   ```bash
   aws cloudwatch get-metric-statistics \
     --namespace AWS/ECS \
     --metric-name MemoryUtilization \
     --dimensions Name=ServiceName,Value=iaam-service \
     --start-time 2024-01-20T10:00:00Z \
     --end-time 2024-01-20T11:00:00Z \
     --statistics Average,Maximum
   ```

2. **Increase task memory**
   - Update task definition with higher memory
   - Deploy new version

3. **Optimize code**
   - Profile application
   - Look for memory leaks
   - Implement caching

### Certificate Expiration

1. **Check certificate**
   ```bash
   aws acm describe-certificate --certificate-arn arn:aws:acm:...
   ```

2. **Request new certificate**
   ```bash
   aws acm request-certificate \
     --domain-name iaam.example.com \
     --validation-method DNS
   ```

3. **Update CloudFront**
   ```bash
   aws cloudfront update-distribution \
     --id E123ABCDEF \
     --distribution-config '{...}'
   ```

---

**Last Updated**: January 2025
**AWS Region**: us-east-1 (primary)
**Backup Region**: us-west-2 (secondary)
