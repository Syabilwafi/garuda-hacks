export const env = {
  BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001",
  ENVIRONMENT: process.env.NODE_ENV || "development",
  IS_DEVELOPMENT: process.env.NODE_ENV === "development",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
} as const;

export const validateEnv = () => {
  if (!env.BACKEND_URL) {
    console.warn("NEXT_PUBLIC_BACKEND_URL not set, using default http://localhost:3001");
  }
};
