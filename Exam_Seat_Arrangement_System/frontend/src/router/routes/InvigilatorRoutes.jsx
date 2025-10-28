import InvigilatorDashboard from "../../pages/invigilatorPage/InvigilatorDashboard";
import ViewRoomAssignDetailsPage from "../../pages/adminPages/ViewRoomAssignDetailsPage";
import InvigilatorProfilePage from "../../pages/invigilatorPage/InvigilatorProfilePage";
import EditInvigilatorProfilePage from "../../pages/invigilatorPage/EditInvigilatorProfilePage";
import ViewAssignedExamsTablePage from "../../pages/invigilatorPage/ViewAssignedExamsTablePage";
import ViewExamDetailsPage from "../../pages/adminPages/ViewExamDetailsPage";
import ViewRoomAssignmentPage from "../../pages/invigilatorPage/ViewRoomAssignmentPage";
import ViewActiveSeatingPlan from "../../pages/adminPages/ViewActiveSeatingPlan";
import ChangePasswordPage from "../../pages/publicPage/ChangePasswordPage";

 const invigilatorRoutes = [
    {
      path: '/invigilator',
      element: <InvigilatorDashboard />
    },
    {
      path: '/invigilator/profile',
      element: <InvigilatorProfilePage />
    },
    {
    path: "/invigilator/changePassword",
    element: <ChangePasswordPage />,
  },
    {
      path: '/invigilator/update-profile',
      element: <EditInvigilatorProfilePage />
    },
    {
      path: '/invigilator/viewAssignedExams',
      element: <ViewAssignedExamsTablePage />
    },
    {
      path: "/invigilator/viewExamDetails/:examId",
      element: <ViewExamDetailsPage />,
    },
    {
      path: '/invigilator/viewRoomAssignment',
      element: <ViewRoomAssignmentPage />
    },
    {
      path: "/invigilator/viewRoomAssignDetails/:examId",
      element: <ViewRoomAssignDetailsPage />,
    },
    {
      path: '/invigilator/viewActiveSeatPlan',
      element: <ViewActiveSeatingPlan />
    },
    
  ];

  export default invigilatorRoutes;