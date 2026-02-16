import type { JSX } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '../config/router.config';

export default function AppRouterProvider(): JSX.Element {
  return <RouterProvider router={router}></RouterProvider>
}
