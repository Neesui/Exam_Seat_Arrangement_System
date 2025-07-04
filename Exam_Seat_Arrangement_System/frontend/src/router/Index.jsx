import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import InvigilatorLayout from "../layout/InvigilatorLayout";
import PublicLayout from "../layout/PublicLayout";
import LoginPage from "../page/publicPage/LoginPage";
import AuthGuard from "./guards/AuthGuard";
import RoleGuard from "./guards/RoleGuard";
import adminRoutes from "./routes/AdminRoutes";
import invigilatorRoutes from "./routes/InvigilatorRoutes";
import { publicRoutes } from "./routes/PublicRoutes";


const protectedRoutes = [
  {
    element: (
      <AuthGuard>
        <AdminLayout />
      </AuthGuard>
    ),
    children: adminRoutes.map((route) => ({
      ...route,
      element: <RoleGuard allowedRoles={["admin"]}>{route.element}</RoleGuard>,
    })),
  },

  {
    element: (
      <AuthGuard>
        <InvigilatorLayout />
      </AuthGuard>
    ),
    children: invigilatorRoutes.map((route) => ({
      ...route,
      element: (
        <RoleGuard allowedRoles={["teacher"]}>{route.element}</RoleGuard>
      ),
    })),
  },
];

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: publicRoutes,
  },
  ...protectedRoutes,
  {
    path: "/login",
    element: <LoginPage />,
  },
]);

export default router;