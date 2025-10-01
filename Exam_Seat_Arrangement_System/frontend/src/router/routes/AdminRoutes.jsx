import AddBenchPage from "../../pages/adminPages/AddBenchPage";
import AddCourseFullPage from "../../pages/adminPages/AddCourseFullPage";
import AddExamPage from "../../pages/adminPages/AddExamPage";
import AddInvigilatorPage from "../../pages/adminPages/AddInvigilatorPage";
import AddRoomPage from "../../pages/adminPages/AddRoomPage";
import AddSemesterPage from "../../pages/adminPages/AddSemesterPage";
import AddStudentPage from "../../pages/adminPages/AddStudentPage";
import AddSubjectPage from "../../pages/adminPages/AddSubjectPage";
import AdminDashboard from "../../pages/adminPages/AdminDashboard";
import AssignedInvigilatorPage from "../../pages/adminPages/AssignedInvigilatorPage";
import AssignedRoomPage from "../../pages/adminPages/AssignedRoomPage";
import GenerateSeatingPlan from "../../pages/adminPages/GenerateSeatingPlan";
import UpdateBenchPage from "../../pages/adminPages/UpdateBenchPage";
import UpdateCoursePage from "../../pages/adminPages/UpdateCoursePage";
import UpdateInvigilatorAssignPage from "../../pages/adminPages/UpdateInvigilatorAssignPage";
import UpdateInvigilatorPage from "../../pages/adminPages/UpdateInvigilatorPage";
import UpdateRoomAssignPage from "../../pages/adminPages/UpdateRoomAssignPage";
import UpdateRoomPage from "../../pages/adminPages/UpdateRoomPage";
import UpdateStudentPage from "../../pages/adminPages/UpdateStudentPage";
import UpdateSubjectPage from "../../pages/adminPages/UpdateSubjectPage";
import ViewActiveSeatingPlan from "../../pages/adminPages/ViewActiveSeatingPlan";
import ViewAllInvigilatorAssignPage from "../../pages/adminPages/ViewAllInvigilatorAssignPage";
import ViewAllSeatingPlans from "../../pages/adminPages/ViewAllSeatingPlans";
import ViewBenchByRoomPage from "../../pages/adminPages/ViewBenchByRoomPage";
import ViewBenchPage from "../../pages/adminPages/ViewBenchPage";
import ViewCurrentInvigilatorAssignPage from "../../pages/adminPages/ViewCurrentInvigilatorAssignPage";
import ViewExamDetailsPage from "../../pages/adminPages/ViewExamDetailsPage";
import ViewExamPage from "../../pages/adminPages/ViewExamPage";
import ViewFullCoursePage from "../../pages/adminPages/ViewFullCoursePage";
import ViewInvigilatorAssignDetailsPage from "../../pages/adminPages/ViewInvigilatorAssignDetailsPage";
import ViewInvigilatorDetailsPage from "../../pages/adminPages/ViewInvigilatorDetailsPage";
import ViewInvigilatorPage from "../../pages/adminPages/ViewInvigilatorPage";
import ViewRoomAssignDetailsPage from "../../pages/adminPages/ViewRoomAssignDetailsPage";
import ViewRoomAssignPage from "../../pages/adminPages/ViewRoomAssignPage";
import ViewRoomPage from "../../pages/adminPages/ViewRoomPage";
import ViewStudentPage from "../../pages/adminPages/ViewStudentPage";

const adminRoutes = [
    {
      path: "/admin",
      element: <AdminDashboard />,
    },
    {
      path: "/admin/addInvigilator",
      element: <AddInvigilatorPage />,
    },
    {
      path: "/admin/addfullCourse",
      element: <AddCourseFullPage />,
    },
    {
      path: "/admin/addSemester/:courseId",
      element: <AddSemesterPage />,
    },
    {
      path: "/admin/addSubject/:semesterId",
      element: <AddSubjectPage />,
    },
    {
      path: "/admin/addStudents",
      element: <AddStudentPage />,
    },
    {
      path: "/admin/addRoom",
      element: <AddRoomPage />,
    },
    {
      path: "/admin/addBench",
      element: <AddBenchPage />,
    },
    {
      path: "/admin/createExam",
      element: <AddExamPage />,
    },
    {
      path: "/admin/assignRoom",
      element: <AssignedRoomPage />,
    },
    {
      path: "/admin/assignInvigilator",
      element: <AssignedInvigilatorPage />,
    },
    {
      path: "/admin/generateSeatingPlan",
      element: <GenerateSeatingPlan />,
    },
    //view routes
    {
      path: "/admin/viewInvigilator",
      element: <ViewInvigilatorPage />,
    },
    {
      path: "/admin/viewCourse",
      element: <ViewFullCoursePage />,
    },
    {
      path: "/admin/viewRoom",
      element: <ViewRoomPage />,
    },
    {
      path: "/admin/viewRoomAssign",
      element: <ViewRoomAssignPage />,
    },
    {
      path: "/admin/viewRoomAssignDetails/:examId",
      element: <ViewRoomAssignDetailsPage />,
    },
    {
      path: "/admin/viewBench",
      element: <ViewBenchPage />,
    },
    {
      path: "/admin/viewBenchByRoom/:roomId",
      element: <ViewBenchByRoomPage />,
    },
    {
      path: "/admin/viewExam",
      element: <ViewExamPage />,
    },
    {
      path: "/admin/viewExamDetails/:examId",
      element: <ViewExamDetailsPage />,
    },
    {
      path: "/admin/viewInvigilatorDetails/:id",
      element: <ViewInvigilatorDetailsPage />,
    },
    {
      path: "/admin/viewAllInvigilatorAssign",
      element: <ViewAllInvigilatorAssignPage />,
    },
    {
      path: "/admin/viewCurrentInvigilatorAssign",
      element: <ViewCurrentInvigilatorAssignPage />,
    },
    {
      path: "/admin/viewInvigilatorAssignDetails/:assignmentId",
      element: <ViewInvigilatorAssignDetailsPage />,
    },{
      path: "/admin/viewStudents",
      element: <ViewStudentPage />,
    },{
      path: "/admin/viewSeatingPlan",
      element: <ViewAllSeatingPlans />,
    },
    {
      path: "/admin/viewActiveSeatPlan",
      element: <ViewActiveSeatingPlan />,
    },
    // update routes
    {
      path: "/admin/UpdateCourse/:courseId",
      element: <UpdateCoursePage />,
    },
    {
      path: "/admin/updateSubject/:subjectId",
      element: <UpdateSubjectPage />,
    },
    {
      path: "/admin/updateBench/:benchId",
      element: <UpdateBenchPage />,
    },
    {
      path: "/admin/updateRoom/:roomId",
      element: <UpdateRoomPage />,
    },
    {
      path: "/admin/updateRoomAssign/:examId",
      element: <UpdateRoomAssignPage />,
    },
    {
      path: "/admin/updateInvigilator/:id",
      element: <UpdateInvigilatorPage />,
    },
    {
      path: "/admin/updateInvigilatorAssign/:id",
      element: <UpdateInvigilatorAssignPage />,
    },
    {
      path: "/admin/updateStudent/:studentId",
      element: <UpdateStudentPage />,
    },
    


  ];

  export default adminRoutes;