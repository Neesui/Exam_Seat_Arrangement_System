import { createBrowserRouter } from 'react-router-dom';
import { authRoutes } from './authRoutes';

export const router = createBrowserRouter([
  ...authRoutes,
  // other routes
]);