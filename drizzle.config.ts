import { type Config, defineConfig } from "drizzle-kit";

export default defineConfig({
	dialect: "mysql",
	// out: "./src/services/database/migrations",
	// schema: "./src/services/database/schema.ts",

	dbCredentials: {
		host: process.env.DB_HOST,
		user: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE,
	},

	verbose: true,
	strict: true,
} as Config);
