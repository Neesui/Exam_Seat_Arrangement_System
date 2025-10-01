import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import InvigilatorLayout from "../layout/InvigilatorLayout";
import PublicLayout from "../layout/PublicLayout";
import AuthGuard from "./guards/AuthGuard";
import RoleGuard from "./guards/RoleGuard";
import adminRoutes from "./routes/AdminRoutes";
import invigilatorRoutes from "./routes/InvigilatorRoutes";
import { publicRoutes } from "./routes/PublicRoutes";
import LoginPage from "../pages/publicPage/LoginPage";

const admin = ["ADMIN"];
const invigilator = ["INVIGILATOR"];

const protectedRoutes = [
  {
    element: (
      <AuthGuard>
        <RoleGuard allowedRoles={admin}>
          <AdminLayout />
        </RoleGuard>
      </AuthGuard>
    ),
    children: adminRoutes,
  },
  {
    path: "/invigilator", 
    element: (
      <AuthGuard>
        <RoleGuard allowedRoles={invigilator}>
          <InvigilatorLayout />
        </RoleGuard>
      </AuthGuard>
    ),
    children: invigilatorRoutes,
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
