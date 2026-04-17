const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debug() {
  // Get all categories
  const cats = await prisma.category.findMany({
    include: {
      subcategories: true
    }
  });
  
  console.log("All categories:");
  cats.forEach(cat => {
    console.log(`\n${cat.name} (ID: ${cat.id})`);
    cat.subcategories.forEach(sc => {
      console.log(`  - ${sc.name} (ID: ${sc.id})`);
    });
  });

  // Check if there are products with null subcategoryId
  const nullSubcatProducts = await prisma.product.findMany({
    where: {
      subcategoryId: null
    },
    select: {
      id: true,
      title: true,
      category: true
    },
    take: 5
  });
  
  console.log("\n\nProducts with null subcategoryId:", nullSubcatProducts);
}

debug().catch(console.error).finally(() => process.exit(0));
