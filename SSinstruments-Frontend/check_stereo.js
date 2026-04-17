const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debug() {
  // Find STEREO-VIEW product
  const product = await prisma.product.findFirst({
    where: {
      title: {
        contains: "STEREO-VIEW",
        mode: "insensitive"
      }
    },
    include: {
      subcategory: true
    }
  });
  
  console.log("STEREO-VIEW product:", JSON.stringify(product, null, 2));
  
  // Get products for Educational Biological Microscopes subcategory
  const products = await prisma.product.findMany({
    where: {
      subcategoryId: "cmlgcxulu0001fn3l94y8ky8a"
    }
  });
  
  console.log("\nProducts for Educational Biological Microscopes subcategory:", products.length);
}

debug().catch(console.error).finally(() => process.exit(0));
