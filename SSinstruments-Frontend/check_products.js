const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkProducts() {
  const products = await prisma.product.findMany({
    where: {
      subcategoryId: {
        not: null
      }
    },
    include: {
      subcategory: {
        select: {
          id: true,
          name: true,
          categoryId: true
        }
      }
    },
    take: 10
  });

  console.log('Products with subcategories:');
  console.log(JSON.stringify(products, null, 2));
  
  const subcats = await prisma.subCategory.findMany({
    take: 5
  });
  console.log('\nFirst 5 subcategories:');
  console.log(JSON.stringify(subcats, null, 2));
}

checkProducts().catch(console.error).finally(() => process.exit(0));
