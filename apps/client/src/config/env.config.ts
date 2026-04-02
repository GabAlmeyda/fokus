export const env = {
  FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL as string,
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL as string,
} as const;

function verifyEnvVariables() {
  Object.entries(env).forEach(([key, value]) => {
    if (!value) {
      console.error(
        `[env.config.ts (client)] Variable '${key}' not defined in the '.env' file.`,
      );
    }
  });
}
verifyEnvVariables();
