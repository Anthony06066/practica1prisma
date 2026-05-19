import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema2.prisma",
  migrations: {
    path: "prisma/migrations_db2",
  },
  datasource: {
    url: process.env.DATABASE_URL_2,
  },
});
