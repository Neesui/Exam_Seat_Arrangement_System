
import HomePage from "../../pages/publicPage/HomePage";
import ViewExamRoomPage from "../../pages/publicPage/ViewExamRoomPage";
import ViewSeatPlanPage from "../../pages/publicPage/ViewSeatPlanPage";

export const publicRoutes = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/exam_room",
    element: <ViewExamRoomPage />,
  },
  {
    path: "/viewSeatPlan",
    element: <ViewSeatPlanPage />,
  }

  

];