import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema1.prisma",
  migrations: {
    path: "prisma/migrations_db1",
  },
  datasource: {
    url: process.env.DATABASE_URL_1,
  },
});
