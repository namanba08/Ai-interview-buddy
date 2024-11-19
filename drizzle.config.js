/** @type { import("drizzle-kit").Config } */
export default {
	schema: "./utils/schema.js",
	dialect: "postgresql",
	dbCredentials: {
		url: "postgresql://neondb_owner:lYsEWUM1c7Ar@ep-spring-feather-a5snk0i5.us-east-2.aws.neon.tech/try2?sslmode=require",
	},
};