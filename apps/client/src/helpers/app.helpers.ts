import { env } from '../config/env.config';

export const APP_URLS = {
  landingPage: '/landing-page',
  register: '/register',
  login: '/login',
  home: '/app',
  habits: '/app/habits',
  goals: '/app/goals',
  categories: '/app/categories',
  base: env.FRONTEND_URL,
};
