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
