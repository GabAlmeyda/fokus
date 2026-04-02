import dotenv from 'dotenv';
dotenv.config();

export const env = {
  JWT_SECRET: process.env.JWT_SECRET as string,
  MONGO_URI: process.env.MONGO_URI as string,
  PORT: process.env.PORT,
  FRONTEND_URL: process.env.FRONTEND_URL as string,
  BACKEND_URL: process.env.BACKEND_URL as string,
} as const;

function verifyEnvVariables() {
  Object.entries(env).forEach(([key, value]) => {
    if (!value) {
      console.error(
        `[env.config.ts (server)] Variable '${key}' not defined in the '.env' file.`,
      );
      process.exit(1);
    }
  });
}
verifyEnvVariables();
