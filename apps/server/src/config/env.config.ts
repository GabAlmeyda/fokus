import dotenv from 'dotenv';
dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET as string,
  MONGO_URI: process.env.MONGO_URI as string,
  PORT: process.env.PORT,
} as const;

function verifyEnvVariables() {
  Object.entries(env).forEach(([key, value]) => {
    if (!value) {
      console.error(
        `[index.ts (server)] Variable '${key}' not defined in the '.env' file.`,
      );
      process.exit(1);
    }
  });
}
verifyEnvVariables();
