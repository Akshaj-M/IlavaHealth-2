
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./shared/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // Disabled for API-only mode
    url: "postgresql://disabled",
  },
  verbose: true,
  strict: true,
});
