import { PrismaClient } from "@prisma/client";

const globalForPrisma = global;

// Database configuration for different environments
const getDatabaseConfig = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    log: isProduction ? ["error"] : ["query", "error", "warn"],
    datasourceUrl: process.env.DATABASE_URL,
  };
};

export const prisma =
  globalForPrisma.prisma || new PrismaClient(getDatabaseConfig());

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Test database connection
export async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log("✅ Database connection successful");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    return false;
  }
}
