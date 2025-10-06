import InvigilatorDashboard from "../../pages/invigilatorPage/InvigilatorDashboard";
import ViewRoomAssignDetailsPage from "../../pages/adminPages/ViewRoomAssignDetailsPage";
import InvigilatorProfilePage from "../../pages/invigilatorPage/InvigilatorProfilePage";
import EditInvigilatorProfilePage from "../../pages/invigilatorPage/EditInvigilatorProfilePage";
import ViewAssignedExamsTablePage from "../../pages/invigilatorPage/ViewAssignedExamsTablePage";
import ViewExamDetailsPage from "../../pages/adminPages/ViewExamDetailsPage";
import ViewRoomAssignmentPage from "../../pages/invigilatorPage/ViewRoomAssignmentPage";

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
  ];

  export default invigilatorRoutes;