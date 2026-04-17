const { PrismaClient } = require('@prisma/client');

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const prisma = new PrismaClient({
  log: ['query', 'error', 'info', 'warn'],
});

async function testConnection() {
  try {
    console.log('🔄 Testing database connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL);
    
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Try a simple query
    const result = await prisma.$queryRaw`SELECT version()`;
    console.log('📊 PostgreSQL version:', result[0].version);
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === 'P1001') {
      console.log('\n🚨 This is a connection error. Possible issues:');
      console.log('1. Database server is not running');
      console.log('2. Network connectivity issues');
      console.log('3. IP address not whitelisted in AWS RDS Security Groups');
      console.log('4. Incorrect hostname or port');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();