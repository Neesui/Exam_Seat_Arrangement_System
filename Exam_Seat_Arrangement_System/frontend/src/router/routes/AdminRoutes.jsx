import AddCourseFullPage from "../../page/adminPage/AddCourseFullPage";
import AddInvigilatorPage from "../../page/adminPage/AddInvigilatorPage";
import AddSemesterPage from "../../page/adminPage/AddSemesterPage";
import AddSubjectPage from "../../page/adminPage/AddSubjectPage";
import AdminDashboard from "../../page/adminPage/AdminDashboard";
import StudentPage from "../../page/adminPage/StudentPage";
import UpdateCoursePage from "../../page/adminPage/UpdateCoursePage";
import UpdateInvigilatorPage from "../../page/adminPage/UpdateInvigilatorPage";
import UpdateSubjectPage from "../../page/adminPage/UpdateSubjectPage";
import ViewCoursePage from "../../page/adminPage/ViewFullCoursePage";
import ViewInvigilatorPage from "../../page/adminPage/ViewInvigilatorPage";
import AddRoomPage from "../../page/adminPage/AddRoomPage";
import ViewRoomPage from "../../page/adminPage/ViewRoomPage";
import UpdateRoomPage from "../../page/adminPage/UpdateRoomPage";
import AddBenchPage from "../../page/adminPage/AddBenchPage";
import ViewBenchPage from "../../page/adminPage/ViewBenchPage";
import ViewBenchByRoomPage from "../../page/adminPage/ViewBenchByRoomPage";
import UpdateBenchPage from "../../page/adminPage/UpdateBenchPage";
import AddExamPage from "../../page/adminPage/AddExamPage";
import ViewExamPage from "../../page/adminPage/ViewExamPage";
import UpdateExamPage from "../../page/adminPage/UpdateExamPage";
import ViewExamDetailsPage from "../../page/adminPage/ViewExamDetailsPage";
import ViewRoomAssignPage from "../../page/adminPage/ViewRoomAssignPage ";
import ImportStudentData from "../../page/adminPage/ImportStudentData";
import ViewStudentPage from "../../page/adminPage/ViewStudentPage";
import AddStudentPage from "../../page/adminPage/AddStudentPage";
import UpdateStudentPage from "../../page/adminPage/UpdateStudentPage";
import ViewRoomAssignDetailsPage from "../../page/adminPage/ViewRoomAssignDetailsPage";
import ViewInvigilatorAssignPage from "../../page/publicPage/ViewInvigilatorAssignPage";
import GenerateSeatingPlan from "../../page/adminPage/GenerateSeatingPlan";
import ViewAllSeatingPlans from "../../page/adminPage/ViewAllSeatingPlans";
import AssignedRoomPage from "../../page/adminPage/AssignedRoomPage";
import AssignedInvigilatorPage from "../../page/adminPage/AssignedInvigilatorPage";
import UpdateRoomAssignPage from "../../page/adminPage/UpdateRoomAssignPage";
import ViewInvigilatorDetailsPage from "../../page/adminPage/ViewInvigilatorDetailsPage";
import ViewStudentsByCollege from "../../page/publicPage/ViewStudentsByCollege";
import UpdateInvigilatorAssign from "../../page/adminPage/UpdateInvigilatorAssign";

const adminRoutes = [
  {
    path: "/admin",
    element: <AdminDashboard />,
  },
  {
    path: "/addInvigilator",
    element: <AddInvigilatorPage />,
  },
  {
    path: "/viewInvigilator",
    element: <ViewInvigilatorPage />,
  },
  {
    path: "/viewInvigilatorDetails/:id",
    element: <ViewInvigilatorDetailsPage />,
  },
  {
    path: "/updateInvigilator/:id",
    element: <UpdateInvigilatorPage />,
  },

  {
    path: "/addfullCourse",
    element: <AddCourseFullPage />,
  },
  {
    path: "/viewCourse",
    element: <ViewCoursePage />,
  },
  {
    path: "/admin/UpdateCourse/:courseId",
    element: <UpdateCoursePage />,
  },
  {
    path: "/updateSubject/:subjectId",
    element: <UpdateSubjectPage />,
  },
  {
    path: "/addSemester/:courseId",
    element: <AddSemesterPage />,
  },
  {
    path: "/addSubject/:semesterId",
    element: <AddSubjectPage />,
  },
  {
    path: "/addRoom",
    element: <AddRoomPage />,
  },
  {
    path: "/viewRoom",
    element: <ViewRoomPage />,
  },
  {
    path: "/updateRoom/:roomId",
    element: <UpdateRoomPage />,
  },
  {
    path: "/addBench",
    element: <AddBenchPage />,
  },
  {
    path: "/viewBench",
    element: <ViewBenchPage />,
  },
  {
    path: "/viewBenchByRoom/:roomId",
    element: <ViewBenchByRoomPage />,
  },
  {
    path: "/updateBench/:benchId",
    element: <UpdateBenchPage />,
  },
  {
    path: "/createExam",
    element: <AddExamPage />,
  },
  {
    path: "/viewExam",
    element: <ViewExamPage />,
  },
  {
    path: "/updateExam/:examId",
    element: <UpdateExamPage />,
  },
  {
    path: "/viewExamDetails/:examId",
    element: <ViewExamDetailsPage />,
  },
  {
    path: "/assignRoom",
    element: <AssignedRoomPage />,
  },
  {
    path: "/viewRoomAssign",
    element: <ViewRoomAssignPage />,
  },
  {
    path: "/viewRoomAssignDetails/:examId",
    element: <ViewRoomAssignDetailsPage />,
  },
  {
    path: "/updateRoomAssign/:examId",
    element: <UpdateRoomAssignPage />,
  },
  {
    path: "/assignInvigilator",
    element: <AssignedInvigilatorPage />,
  },
  {
    path: "/viewInvigilatorAssign",
    element: <ViewInvigilatorAssignPage />,
  },
  {
    path: "/updateInvigilatorAssign/:invigilatorAssignId",
    element: <UpdateInvigilatorAssign />,
  },
  {
    path: "/addStudents",
    element: <AddStudentPage />,
  },
  {
    path: "/importStudent",
    element: <ImportStudentData />,
  },
  {
    path: "/viewStudents",
    element: <ViewStudentPage />,
  },
  {
    path: "/updateStudent/:studentId",
    element: <UpdateStudentPage />,
  },
  {
    path: "/student",
    element: <StudentPage />,
  },
  {
    path: "/studentDetailsbyCollege/:college",
    element: <ViewStudentsByCollege />,
  },

  {
    path: "/generateSeatingPlan",
    element: <GenerateSeatingPlan />,
  },
  {
    path: "/viewSeatingPlan",
    element: <ViewAllSeatingPlans />,
  },
];

export default adminRoutes;
