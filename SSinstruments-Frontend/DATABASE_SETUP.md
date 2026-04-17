# PostgreSQL RDS Database Setup

## Current Configuration

**RDS Endpoint:** `ssinstruments.ctccaa08oa5f.eu-north-1.rds.amazonaws.com`
**Port:** `5432`
**Database:** `postgres`
**Username:** `postgres`
**Password:** `KopZpTVz2OMQShmtF9yG`

## Issues to Resolve

### 1. Network Connectivity (Connection Failed)

The error indicates the database server is unreachable. This is typically due to:

#### **Security Group Configuration**
- AWS RDS instance needs to allow inbound connections on port 5432
- Add your current IP address to the security group
- For development: Add `0.0.0.0/0` (temporary, not for production)

#### **Subnet Group and VPC**
- Ensure RDS is in a public subnet for external access
- Or set up VPN/bastion host for private subnet access

### 2. SSL Configuration

The connection string includes `sslmode=require` but you may need:
- Proper SSL certificate validation
- Updated certificate bundle

## Steps to Fix

### 1. Check AWS RDS Security Groups

```bash
# Login to AWS Console
# Navigate to RDS → Databases → ssinstruments
# Check Security Groups → Edit inbound rules
# Add rule: PostgreSQL, Port 5432, Source: Your IP or 0.0.0.0/0
```

### 2. Test Basic Connection

```bash
# Install PostgreSQL client
brew install postgresql

# Test direct connection
psql "host=ssinstruments.ctccaa08oa5f.eu-north-1.rds.amazonaws.com port=5432 dbname=postgres user=postgres"
```

### 3. Alternative Connection Methods

#### Method A: Without SSL (for testing)
```env
DATABASE_URL="postgresql://postgres:KopZpTVz2OMQShmtF9yG@ssinstruments.ctccaa08oa5f.eu-north-1.rds.amazonaws.com:5432/postgres"
```

#### Method B: With SSL Certificate
```env
DATABASE_URL="postgresql://postgres:KopZpTVz2OMQShmtF9yG@ssinstruments.ctccaa08oa5f.eu-north-1.rds.amazonaws.com:5432/postgres?sslmode=require&sslcert=certs/global-bundle.pem"
```

## Current Files Updated

1. **Environment Variables** (`.env.local`)
2. **Database Configuration** (`src/lib/db.js`)
3. **SSL Certificate** (`certs/global-bundle.pem`)
4. **Connection Test** (`test-db-connection.js`)

## Next Steps

1. **Fix AWS Security Groups** - Most critical
2. **Test connection with psql client**
3. **Run Prisma migration once connected**
4. **Update production environment variables**

## Production Considerations

- Use environment-specific database names
- Implement connection pooling
- Set up database backups
- Configure monitoring and alerts
- Restrict security group access to specific IPs