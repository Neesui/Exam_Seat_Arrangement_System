import InvigilatorDashboard from "../../pages/invigilatorPage/InvigilatorDashboard";
import ViewInvigilatorAssignmentPage from "../../pages/invigilatorPage/ViewInvigilatorAssignmentPage";
import ViewRoomAssignDetailsPage from "../../pages/adminPages/ViewRoomAssignDetailsPage";
import ViewRoomAssignPage from "../../pages/adminPages/ViewRoomAssignPage";
import InvigilatorProfilePage from "../../pages/invigilatorPage/InvigilatorProfilePage";
import EditInvigilatorProfilePage from "../../pages/invigilatorPage/EditInvigilatorProfilePage";

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
    // {
    //   path: '/invigilator/viewRoomAssign',
    //   element: <ViewInvigilatorAssignmentPage />
    // },
    {
      path: "/invigilator/viewRoomAssign",
      element: <ViewRoomAssignPage />,
    },
    {
      path: "/invigilator/viewRoomAssignDetails/:examId",
      element: <ViewRoomAssignDetailsPage />,
    },
  ];

  export default invigilatorRoutes;