# PostgreSQL RDS + Strapi Integration Guide

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [PostgreSQL RDS Setup](#postgresql-rds-setup)
3. [Strapi Configuration](#strapi-configuration)
4. [Deployment](#deployment)
5. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

```
┌─────────────────────────────────────────┐
│     Strapi Application                   │
│     (Node.js)                            │
│     localhost:1337                       │
└──────────────┬──────────────────────────┘
               │
               │ JDBC/PostgreSQL Protocol
               │ Port 5432
               │ SSL/TLS Encrypted
               │
┌──────────────▼──────────────────────────┐
│     AWS RDS PostgreSQL Instance           │
│     eu-north-1 Region                     │
│     Multi-AZ Deployment                   │
└─────────────────────────────────────────┘
               │
               │ Automated Backups
               │ 7-day Retention
               │
┌──────────────▼──────────────────────────┐
│     AWS S3 / Backup Storage               │
│     Point-in-Time Recovery                │
└─────────────────────────────────────────┘
```

---

## PostgreSQL RDS Setup

### Step 1: Create RDS Instance

#### A. Access AWS Console
1. Go to [AWS Management Console](https://console.aws.amazon.com/)
2. Search for **RDS** → Click **RDS Dashboard**
3. Click **Create database**

#### B. Engine & Version
- **Choose a database engine:** PostgreSQL
- **Engine version:** 16.x or latest stable
- **Templates:** Select "Production" for production environments

#### C. DB Instance Settings
```
Database instance identifier:  postgres
Master username:               postgresStrpi
Master password:               vw1ELRLLOVEO3C5ggf4H (use strong password)
Confirm password:              [repeat password]
```

#### D. Instance Class & Storage
```
DB instance class:             db.t3.small (production) or db.t3.micro (dev)
Storage type:                  gp3 (General Purpose)
Allocated storage:             20 GB
Enable storage autoscaling:    Yes
Maximum storage threshold:     100 GB
```

#### E. Connectivity
```
VPC:                          Default VPC (or your preferred VPC)
Publicly accessible:          Yes (if accessing from outside AWS)
VPC security group:           Create new: rds-postgres-sg
Database port:                5432
Database name:                iiamcms (or your app database name)
```

#### F. Authentication & Backup
```
Database authentication:       Password authentication
Enable automatic backups:      Yes
Backup retention period:       7 days (production: 30)
Backup window:                 03:00 - 04:00 UTC
Preferred maintenance window:  sun:04:00 - sun:05:00 UTC
```

#### G. Encryption & Monitoring
```
Encryption at rest:           Enable
Manage master encryption key: Owned by AWS (or CMK)
Enhanced monitoring:          Enable
Monitoring role:              Create new
Monitoring granularity:       60 seconds
Log exports:                  PostgreSQL log, Upgrade log
Enable deletion protection:   Yes (production)
```

#### H. Additional Options
```
Parameter group:              default.postgres16
Option group:                 default:postgres
Copy tags to snapshots:       Yes
Enable IAM DB authentication: No (unless needed)
Enable Performance Insights:  Yes (prod)
```

#### I. Review & Create
- Review all settings
- Click **Create database**
- Wait 5-15 minutes for instance to initialize

---

### Step 2: Configure Security Groups

#### Get Your Connection Details

Once RDS instance is created:

1. Go to **RDS** → **Databases** → Select your instance
2. Under **Connectivity & security**, note:
   - **Endpoint:** `database-1.ctccaa08oa5f.eu-north-1.rds.amazonaws.com`
   - **Port:** `5432`
   - **VPC security groups:** `rds-postgres-sg`

#### Add Inbound Rule

1. Click on security group name: `rds-postgres-sg`
2. Click **Inbound rules** → **Edit inbound rules**
3. Click **Add rule:**

```
Type:                    PostgreSQL
Protocol:                TCP
Port Range:              5432
Source:                  
  - For local dev:       YOUR_PUBLIC_IP/32 (e.g., 49.37.234.217/32)
  - For EC2 instance:    Select EC2 security group
  - For Docker container: Your application security group
```

4. Click **Save rules**

#### (Optional) Allow EC2 Access

If Strapi runs on EC2:

```
Type:                    PostgreSQL
Protocol:                TCP
Port Range:              5432
Source:                  sg-0c89f567abd8fddfe (your EC2 security group)
```

---

### Step 3: Create Database & Users

#### Install PostgreSQL Client (Local Machine)

```bash
# macOS
brew install postgresql

# Ubuntu/Debian
sudo apt-get install postgresql-client

# Windows
# Download: https://www.postgresql.org/download/windows/
```

#### Connect as Master Admin

```bash
PGPASSWORD="vw1ELRLLOVEO3C5ggf4H" psql \
  -h database-1.ctccaa08oa5f.eu-north-1.rds.amazonaws.com \
  -U postgresStrpi \
  -d postgres
```

#### Create Strapi Database & User

```sql
-- Create application database
CREATE DATABASE iiamcms;

-- Create application user with strong password
CREATE USER strapi_user WITH PASSWORD 'StrapiPassword123!@#';

-- Grant permissions on database
GRANT CONNECT ON DATABASE iiamcms TO strapi_user;

-- Connect to the new database
\c iiamcms

-- Grant schema permissions
GRANT USAGE ON SCHEMA public TO strapi_user;
GRANT CREATE ON SCHEMA public TO strapi_user;

-- Grant table permissions for existing tables
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO strapi_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO strapi_user;

-- Set default permissions for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO strapi_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO strapi_user;

-- Create read-only user for backups
CREATE USER strapi_backup WITH PASSWORD 'BackupPassword123!@#';
GRANT CONNECT ON DATABASE iiamcms TO strapi_backup;
GRANT USAGE ON SCHEMA public TO strapi_backup;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO strapi_backup;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO strapi_backup;

-- Verify users
\du

-- Exit
\q
```

---

## Strapi Configuration

### Step 1: Install Strapi

#### A. Create New Strapi Project

```bash
# Using npx (Node.js 16+)
npx create-strapi-app@latest iiamcms --quickstart

# Or with custom database setup
npx create-strapi-app@latest iiamcms --no-run
cd iiamcms
```

#### B. Install PostgreSQL Dependencies

```bash
npm install pg
```

### Step 2: Configure Database Connection

#### Option A: Using Environment Variables (.env)

Create or update `.env` file in your Strapi project root:

```env
# Server Configuration
HOST=0.0.0.0
PORT=1337

# Database Configuration - PostgreSQL RDS
DATABASE_CLIENT=postgres
DATABASE_HOST=database-1.ctccaa08oa5f.eu-north-1.rds.amazonaws.com
DATABASE_PORT=5432
DATABASE_NAME=iiamcms
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=StrapiPassword123!@#
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=false

# Strapi Security
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=your_api_token_salt_here
ADMIN_JWT_SECRET=your_admin_jwt_secret_here
TRANSFER_TOKEN_SALT=your_transfer_token_salt_here
JWT_SECRET=your_jwt_secret_here

# Optional: Encryption
ENCRYPTION_KEY=your_encryption_key_here
```

#### Option B: Using config/database.js (Legacy)

If using Strapi v3 or custom config:

```javascript
// config/database.js
module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'bookshelf',
      settings: {
        client: 'postgres',
        host: env('DATABASE_HOST', 'localhost'),
        port: env.int('DATABASE_PORT', 5432),
        database: env('DATABASE_NAME', 'strapi'),
        username: env('DATABASE_USERNAME', 'postgres'),
        password: env('DATABASE_PASSWORD', ''),
        ssl: env.bool('DATABASE_SSL', true),
        rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', false),
      },
      useNullAsDefault: true,
    },
  },
});
```

#### Option C: Using config/database.ts (Strapi v4+)

```typescript
// config/database.ts
import path from 'path';

export default ({ env }) => {
  const client = env('DATABASE_CLIENT', 'postgres');

  const connections = {
    postgres: {
      connection: {
        host: env('DATABASE_HOST'),
        port: env.int('DATABASE_PORT'),
        database: env('DATABASE_NAME'),
        user: env('DATABASE_USERNAME'),
        password: env('DATABASE_PASSWORD'),
        ssl: env.bool('DATABASE_SSL', true),
        rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', false),
      },
      pool: {
        min: env.int('DATABASE_POOL_MIN', 2),
        max: env.int('DATABASE_POOL_MAX', 10),
      },
    },
  };

  return {
    defaultConnection: 'default',
    connections: {
      default: connections[client],
    },
  };
};
```

### Step 3: Test Connection

#### Start Strapi

```bash
npm run develop
```

#### Check Console Output

Look for:
```
✓ Database & server started
✓ Admin panel: http://localhost:1337/admin
✓ API: http://localhost:1337/api
```

#### Verify Database Connection

```bash
# Check PostgreSQL connection (from local machine)
PGPASSWORD="StrapiPassword123!@#" psql \
  -h database-1.ctccaa08oa5f.eu-north-1.rds.amazonaws.com \
  -U strapi_user \
  -d iiamcms \
  -c "SELECT version();"
```

### Step 4: Create Admin User

1. Open browser: `http://localhost:1337/admin`
2. Fill in registration form:
   - **Email:** admin@yourdomain.com
   - **Password:** Strong password (12+ chars)
   - **First name:** Admin
   - **Last name:** User
3. Click **Let's start**

### Step 5: Configure Strapi Settings

#### Database Pool Configuration

Update `.env` for production:

```env
# Connection Pool Settings
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10
```

#### Admin Panel Settings

1. Go to **Admin** → **Settings** → **Global settings**
2. Configure:
   - **Site name:** IIAM CMS
   - **Welcome message:** Welcome to IIAM
   - **Default language:** English

#### API Tokens

1. Go to **Admin** → **Settings** → **API Tokens**
2. Create new token:
   - **Name:** Content API Token
   - **Description:** For external API access
   - **Type:** Full access or custom scopes
3. Copy token (needed for API calls)

---

## Deployment

### Step 1: Production Build

```bash
# Build Strapi for production
npm run build

# Test production build locally
npm run start
```

### Step 2: Deploy to AWS (EC2)

#### A. Launch EC2 Instance

1. Go to **EC2** → **Launch instances**
2. Select **Ubuntu 22.04 LTS** AMI
3. Instance type: `t3.small` or larger
4. Security group: Allow ports 22 (SSH), 80, 443, 1337
5. Launch instance

#### B. Connect & Setup

```bash
# SSH into instance
ssh -i your-key.pem ubuntu@YOUR_EC2_IP

# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Clone your Strapi repository
git clone YOUR_REPO_URL
cd iiamcms

# Install dependencies
npm install

# Create .env file
nano .env
# (Add database credentials and other secrets)

# Build application
npm run build

# Start with PM2
pm2 start npm --name strapi -- start
pm2 save
pm2 startup
```

#### C. Setup Reverse Proxy (Nginx)

```bash
# Install Nginx
sudo apt-get install -y nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/strapi
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect HTTP to HTTPS (production)
    # return 301 https://$server_name$request_uri;

    location / {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/strapi /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### D. Setup SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renew certificates
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### Step 3: Deploy to Docker

#### A. Create Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy app
COPY . .

# Build
RUN npm run build

# Expose port
EXPOSE 1337

# Start
CMD ["npm", "start"]
```

#### B. Create Docker Compose

```yaml
version: '3.8'

services:
  strapi:
    build: .
    ports:
      - "1337:1337"
    environment:
      DATABASE_CLIENT: postgres
      DATABASE_HOST: database-1.ctccaa08oa5f.eu-north-1.rds.amazonaws.com
      DATABASE_PORT: 5432
      DATABASE_NAME: iiamcms
      DATABASE_USERNAME: strapi_user
      DATABASE_PASSWORD: StrapiPassword123!@#
      DATABASE_SSL: 'true'
      NODE_ENV: production
      APP_KEYS: ${APP_KEYS}
      API_TOKEN_SALT: ${API_TOKEN_SALT}
      ADMIN_JWT_SECRET: ${ADMIN_JWT_SECRET}
      TRANSFER_TOKEN_SALT: ${TRANSFER_TOKEN_SALT}
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      - postgres
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: ${DATABASE_PASSWORD}
      POSTGRES_USER: ${DATABASE_USERNAME}
      POSTGRES_DB: ${DATABASE_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

#### C. Run with Docker Compose

```bash
# Create .env file with secrets
cat > .env << EOF
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=salt1
ADMIN_JWT_SECRET=secret1
TRANSFER_TOKEN_SALT=salt2
JWT_SECRET=secret2
DATABASE_PASSWORD=StrapiPassword123!@#
DATABASE_USERNAME=strapi_user
DATABASE_NAME=iiamcms
EOF

# Start services
docker-compose up -d

# View logs
docker-compose logs -f strapi
```

---

## Database Backups & Recovery

### Automated Backups (AWS)

Configured in RDS:
- **Retention:** 7 days (daily automatic backups)
- **Window:** 03:00 - 04:00 UTC
- **Multi-AZ:** Enabled for production

### Manual Backup

```bash
# Full database backup
PGPASSWORD="StrapiPassword123!@#" pg_dump \
  -h database-1.ctccaa08oa5f.eu-north-1.rds.amazonaws.com \
  -U strapi_user \
  -d iiamcms \
  > strapi_backup_$(date +%Y%m%d_%H%M%S).sql

# Compressed backup
PGPASSWORD="StrapiPassword123!@#" pg_dump \
  -h database-1.ctccaa08oa5f.eu-north-1.rds.amazonaws.com \
  -U strapi_user \
  -d iiamcms \
  -Fc > strapi_backup_$(date +%Y%m%d_%H%M%S).dump
```

### Restore Backup

```bash
# Restore plain SQL
PGPASSWORD="StrapiPassword123!@#" psql \
  -h database-1.ctccaa08oa5f.eu-north-1.rds.amazonaws.com \
  -U strapi_user \
  -d iiamcms \
  < strapi_backup_20260131_184213.sql

# Restore compressed
PGPASSWORD="StrapiPassword123!@#" pg_restore \
  -h database-1.ctccaa08oa5f.eu-north-1.rds.amazonaws.com \
  -U strapi_user \
  -d iiamcms \
  strapi_backup_20260131_184213.dump
```

---

## Troubleshooting

### Connection Issues

#### Symptom: "Cannot connect to database"

**Solution 1: Verify RDS is running**
```bash
# Check RDS status
aws rds describe-db-instances --db-instance-identifier postgres
```

**Solution 2: Check security group**
```bash
# Your public IP
curl -s https://checkip.amazonaws.com

# Verify security group allows inbound on port 5432
# Go to AWS Console → RDS → Security Groups → Check inbound rules
```

**Solution 3: Test connection**
```bash
PGPASSWORD="StrapiPassword123!@#" psql \
  -h database-1.ctccaa08oa5f.eu-north-1.rds.amazonaws.com \
  -U strapi_user \
  -d iiamcms \
  -c "SELECT 1"
```

#### Symptom: "FATAL: Ident authentication failed"

**Solution:** Use correct username and password in .env

```env
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=StrapiPassword123!@#
```

### Performance Issues

#### Symptom: Slow queries

**Solution 1: Check CloudWatch metrics**
- Go to **RDS** → **Databases** → **Monitoring**
- Check CPU, IOPS, connections

**Solution 2: Increase pool size**
```env
DATABASE_POOL_MAX=20
```

**Solution 3: Increase instance size**
- Go to **RDS** → **Modify**
- Change instance class to `db.t3.medium` or larger

### Disk Space Issues

#### Symptom: "Disk full" errors

**Solution 1: Enable auto-scaling**
- Go to **RDS** → **Modify**
- Set **Maximum storage threshold**

**Solution 2: Archive old data**
```sql
-- List table sizes
SELECT schemaname, tablename, 
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables 
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

**Solution 3: Clean up**
```sql
-- Vacuum database
VACUUM ANALYZE;

-- Reindex
REINDEX DATABASE iiamcms;
```

### Memory Issues

#### Symptom: Out of memory errors

**Solution 1: Increase instance class**
```
Current:  db.t3.small (2GB)
Upgrade:  db.t3.medium (4GB) or db.t3.large (8GB)
```

**Solution 2: Optimize connection pool**
```env
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=5
```

### Monitoring & Alerts

#### Setup CloudWatch Alarms

1. Go to **CloudWatch** → **Alarms** → **Create alarm**
2. Select metric:
   - CPU utilization > 80%
   - Database connections > 80
   - Free storage space < 10%
3. Set SNS notification (email/SMS)

#### Enable Performance Insights

1. Go to **RDS** → **Modify**
2. Enable **Performance Insights**
3. Monitor top SQL queries and wait events

---

## Security Best Practices

### Database Security

1. **Use strong passwords:** Min 12 chars, mixed case, numbers, symbols
2. **Enable encryption:** At rest (KMS) and in transit (SSL/TLS)
3. **Restrict access:** Use security groups with specific IPs
4. **Rotate credentials:** Change passwords quarterly
5. **Enable MFA:** On AWS console access
6. **Use IAM roles:** For EC2/container access

### Strapi Security

1. **Update regularly:** `npm update strapi`
2. **Use API tokens:** Instead of exposing secrets
3. **Enable CORS:** Restrict to your domain
4. **Use HTTPS:** SSL/TLS certificates
5. **Implement rate limiting:** Prevent DDoS
6. **Audit logs:** Monitor admin actions

### Application Security

```javascript
// config/middlewares.js
module.exports = [
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'https:'],
        },
      },
    },
  },
];
```

---

## Quick Reference

### Essential Commands

```bash
# Start development
npm run develop

# Build for production
npm run build

# Start production
npm start

# Database backup
pg_dump -h HOST -U USER -d DATABASE > backup.sql

# Database restore
psql -h HOST -U USER -d DATABASE < backup.sql

# Check PostgreSQL version
psql -h HOST -U USER -d DATABASE -c "SELECT version();"

# List databases
psql -h HOST -U USER -d postgres -c "\l"

# List tables
psql -h HOST -U USER -d DATABASE -c "\dt"
```

### Environment Variables Summary

```env
# Database
DATABASE_CLIENT=postgres
DATABASE_HOST=database-1.ctccaa08oa5f.eu-north-1.rds.amazonaws.com
DATABASE_PORT=5432
DATABASE_NAME=iiamcms
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=StrapiPassword123!@#
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=false

# Strapi
HOST=0.0.0.0
PORT=1337
NODE_ENV=production

# Security Keys (generate with: openssl rand -base64 32)
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=salt_here
ADMIN_JWT_SECRET=secret_here
TRANSFER_TOKEN_SALT=salt_here
JWT_SECRET=secret_here
ENCRYPTION_KEY=key_here
```

---

## Support & Resources

- [Strapi Documentation](https://docs.strapi.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [AWS RDS PostgreSQL Guide](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html)
- [Strapi Community Forum](https://forum.strapi.io/)

---

**Last Updated:** January 31, 2026
**Version:** 1.0 - Complete Integration Guide
**Status:** Production Ready
