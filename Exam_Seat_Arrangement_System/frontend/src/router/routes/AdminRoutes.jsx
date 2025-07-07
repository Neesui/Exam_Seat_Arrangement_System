import AddCoursePage from "../../page/adminPage/AddCoursePage";
import AddInvigilatorPage from "../../page/adminPage/AddInvigilatorPage";
import AdminDashboard from "../../page/adminPage/AdminDashboard";
import InvigilatorPage from "../../page/adminPage/InvigilatorPage";
import StudentPage from "../../page/adminPage/StudentPage";
import ViewInvigilatorPage from "../../page/adminPage/ViewInvigilatorPage";


 const adminRoutes = [
  {
    path: '/admin',
    element: <AdminDashboard />
  },
  {
    path: '/invigilator',
    element: <InvigilatorPage/>
  },
  
  {
    path: '/addInvigilator',
    element: <AddInvigilatorPage />
  },
  {
    path: '/viewInvigilator',
    element: <ViewInvigilatorPage/>
  },
  {
    path: '/addCourse',
    element: <AddCoursePage />
  },
  {
    path: '/student',
    element: <StudentPage />
  },
];

export default adminRoutes;