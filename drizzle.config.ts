import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql", // "mysql" | "sqlite" | "postgresql"
  schema: "./src/db/schema/*",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DRIZZLE_DATABASE_URL!,
  }
});
