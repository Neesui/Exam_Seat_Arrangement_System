import { Route } from 'react-router-dom';
import LoginPages from '../page/adminPage/LoginPage';

export const authRoutes = [
  {
    path: '/login',
    element: <LoginPages />,
  }
];