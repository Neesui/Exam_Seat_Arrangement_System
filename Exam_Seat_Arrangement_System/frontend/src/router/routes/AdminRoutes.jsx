import AdminDashboard from "../../page/adminPage/AdminDashboard";
import InvigilatorPage from "../../page/adminPage/InvigilatorPage";
import StudentPage from "../../page/adminPage/StudentPage";


 const adminRoutes = [
  {
    path: '/admin',
    element: <AdminDashboard />
  },
  {
    path: '/student',
    element: <StudentPage />
  },
];

export default adminRoutes;