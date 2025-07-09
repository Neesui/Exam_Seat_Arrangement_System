import AddCourseFullPage from "../../page/adminPage/AddCourseFullPage";
import AddInvigilatorPage from "../../page/adminPage/AddInvigilatorPage";
import AddSemesterPage from "../../page/adminPage/AddSemesterPage";
import AddSubjectPage from "../../page/adminPage/AddSubjectPage";
import AdminDashboard from "../../page/adminPage/AdminDashboard";
import InvigilatorPage from "../../page/adminPage/InvigilatorPage";
import StudentPage from "../../page/adminPage/StudentPage";
import UpdateCoursePage from "../../page/adminPage/UpdateCoursePage";
import UpdateInvigilatorPage from "../../page/adminPage/UpdateInvigilatorPage";
import UpdateSubjectPage from "../../page/adminPage/UpdateSubjectPage";
import ViewCoursePage from "../../page/adminPage/ViewFullCoursePage";
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
    path: "/updateInvigilator/:id", 
    element: <UpdateInvigilatorPage />
  },

  {
    path: '/addfullCourse',
    element: <AddCourseFullPage />
  },
  {
    path: '/viewCourse',
    element: <ViewCoursePage/>
  },
  {
    path: "/admin/UpdateCourse/:courseId",
    element: <UpdateCoursePage />
  },
  {
    path: "/updateSubject/:subjectId",
    element: <UpdateSubjectPage />
  },
  {
    path: '/addSemester/:courseId',
    element: <AddSemesterPage />
  },
  {
    path: '/addSubject/:semesterId',
    element: <AddSubjectPage />
  },
  {
    path: '/student',
    element: <StudentPage />
  },
];

export default adminRoutes;