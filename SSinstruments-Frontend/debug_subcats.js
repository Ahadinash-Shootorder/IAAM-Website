const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debug() {
  // Find the "Educational Biological Microscopes" category
  const category = await prisma.category.findFirst({
    where: {
      name: {
        contains: "Educational",
        mode: "insensitive"
      }
    },
    include: {
      subcategories: true
    }
  });

  console.log("Category:", JSON.stringify(category, null, 2));

  if (category) {
    // Find products for each subcategory
    for (const subcat of category.subcategories) {
      const products = await prisma.product.findMany({
        where: {
          subcategoryId: subcat.id
        },
        select: {
          id: true,
          title: true,
          subcategoryId: true
        }
      });
      console.log(`\nProducts for subcategory "${subcat.name}" (ID: ${subcat.id}):`, products);
    }
  }
}

debug().catch(console.error).finally(() => process.exit(0));
