const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env' });

const prisma = new PrismaClient();

async function updateUser() {
  try {
    const updated = await prisma.user.update({
      where: { email: 'rohon@ssinstruments.com' },
      data: { name: 'Rohan' },
    });
    console.log('✅ User updated:');
    console.log(`   Name: ${updated.name}`);
    console.log(`   Email: ${updated.email}`);
  } catch (error) {
    console.error('❌ Error updating user:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateUser();
