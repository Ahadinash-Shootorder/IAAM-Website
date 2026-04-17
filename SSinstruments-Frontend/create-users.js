const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env' });

const prisma = new PrismaClient();

async function createUsers() {
  try {
    console.log('🔄 Creating users...\n');

    const hashedPasswordNarayana = await bcrypt.hash('narayana123', 10);
    const hashedPasswordRohon = await bcrypt.hash('rohon123', 10);

    const narayana = await prisma.user.create({
      data: {
        email: 'narayana@ssinstruments.com',
        password: hashedPasswordNarayana,
        name: 'Narayana',
        role: 'super_admin',
      },
    });
    console.log('✅ Super Admin created:');
    console.log(`   Email: ${narayana.email}`);
    console.log(`   Name: ${narayana.name}`);
    console.log(`   Role: ${narayana.role}\n`);

    const rohon = await prisma.user.create({
      data: {
        email: 'rohon@ssinstruments.com',
        password: hashedPasswordRohon,
        name: 'Rohon',
        role: 'admin',
      },
    });
    console.log('✅ Admin created:');
    console.log(`   Email: ${rohon.email}`);
    console.log(`   Name: ${rohon.name}`);
    console.log(`   Role: ${rohon.role}\n`);

    console.log('📝 Credentials:');
    console.log('   Narayana - narayana@ssinstruments.com / narayana123');
    console.log('   Rohon - rohon@ssinstruments.com / rohon123');

  } catch (error) {
    console.error('❌ Error creating users:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createUsers();
