const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const categories = [
    {
      name: "Microscopes",
      slug: "microscopes",
      description: "High-quality microscopes for research and clinical use",
      icon: "microscope",
    },
    {
      name: "Spectrophotometers",
      slug: "spectrophotometers",
      description: "Precision spectrophotometry instruments",
      icon: "flask",
    },
    {
      name: "Laboratory Equipment",
      slug: "laboratory-equipment",
      description: "Essential laboratory equipment and accessories",
      icon: "beaker",
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  const products = [
    {
      title: "BIO-VIEW 1000",
      category: "Microscopes",
      description: "Research-grade optical clarity for accurate interpretation and efficient laboratory workflows.",
      price: 2999.99,
      sku: "BIO-VIEW-1000",
      stock: 15,
      featureImage: "/single-product-dummy-img.jpg",
      galleryImages: ["/microscope-1.jpg", "/microscope-2.jpg", "/microscope-3.jpg"],
      overviewSections: "The BIO-VIEW 1000 is engineered for laboratories that demand more than standard optical performance.",
      technicalSpecification: "Infinity-corrected optical system with high-resolution lenses, LED illumination for consistent lighting, wide magnification range.",
      application: "Clinical diagnostics, biological research, medical education, academic training, industrial quality control.",
    },
    {
      title: "BIO-VIEW 2000",
      category: "Microscopes",
      description: "Advanced research-grade microscope with enhanced optical performance.",
      price: 4499.99,
      sku: "BIO-VIEW-2000",
      stock: 8,
      featureImage: "/single-product-dummy-img.jpg",
      galleryImages: ["/microscope-1.jpg", "/microscope-2.jpg"],
      overviewSections: "Premium microscopy solution for advanced research applications.",
      technicalSpecification: "Enhanced optical system with superior resolution and stability.",
      application: "Advanced research, medical education, laboratory analysis.",
    },
    {
      title: "BIO 2000",
      category: "Microscopes",
      description: "Compact research microscope suitable for educational and clinical applications.",
      price: 1999.99,
      sku: "BIO-2000",
      stock: 20,
      featureImage: "/single-product-dummy-img.jpg",
      galleryImages: ["/microscope-1.jpg", "/microscope-3.jpg"],
      overviewSections: "Reliable and affordable research microscope.",
      technicalSpecification: "Standard optical system with good resolution for general use.",
      application: "Medical education, clinical diagnostics, laboratory training.",
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    }).catch(() => {});
  }

  const sections = [
    {
      sectionKey: "hero_banner",
      title: "Hero Banner",
      description: "Main hero banner section",
      content: "Welcome to SS Instruments",
      order: 1,
      isVisible: true,
      data: JSON.stringify({
        slides: [
          {
            title: "Premium Instruments",
            subtitle: "Quality and Excellence",
            buttonText: "Shop Now",
            buttonLink: "/products",
          },
        ],
      }),
    },
    {
      sectionKey: "features",
      title: "Features",
      description: "Key features section",
      content: "Our Key Features",
      order: 2,
      isVisible: true,
      data: JSON.stringify({
        items: [
          { title: "High Quality", description: "Premium quality instruments" },
          { title: "Fast Delivery", description: "Quick shipping worldwide" },
          {
            title: "Great Support",
            description: "24/7 customer support",
          },
        ],
      }),
    },
    {
      sectionKey: "new_releases",
      title: "New Releases",
      description: "Latest product releases",
      content: "Recently Added Products",
      order: 3,
      isVisible: true,
      data: JSON.stringify({}),
    },
    {
      sectionKey: "featured_products",
      title: "Featured Products",
      description: "Featured products section",
      content: "Our Best Sellers",
      order: 4,
      isVisible: true,
      data: JSON.stringify({}),
    },
    {
      sectionKey: "second_featured",
      title: "Second Featured Section",
      description: "Additional featured content",
      content: "Explore More",
      order: 5,
      isVisible: true,
      data: JSON.stringify({}),
    },
    {
      sectionKey: "application_areas",
      title: "Application Areas",
      description: "Where our instruments are used",
      content: "Industry Applications",
      order: 6,
      isVisible: true,
      data: JSON.stringify({
        areas: [
          { title: "Medical", icon: "heart" },
          { title: "Industrial", icon: "factory" },
          { title: "Research", icon: "microscope" },
        ],
      }),
    },
    {
      sectionKey: "blog",
      title: "Blog Section",
      description: "Latest blog posts",
      content: "Our Blog",
      order: 7,
      isVisible: true,
      data: JSON.stringify({}),
    },
  ];

  for (const section of sections) {
    await prisma.homeSection.upsert({
      where: { sectionKey: section.sectionKey },
      update: section,
      create: section,
    });
  }

  console.log("Database seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
