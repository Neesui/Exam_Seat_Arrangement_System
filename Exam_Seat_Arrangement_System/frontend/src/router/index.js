import { createBrowserRouter } from 'react-router-dom';
import LoginPage from '../page/publicPage/LoginPage';
import AdminDashboard from '../page/adminPage/AdminDashboard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    path: '/admin',
    element: <AdminDashboard />,
  },
]);

export default router;
