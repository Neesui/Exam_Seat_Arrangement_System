import HomePage from "../../page/publicPage/HomePage";
import NotFound from "../../page/publicPage/NotFound";
import ViewExamRoom from "../../page/publicPage/ViewExamRoom";
import ViewSeatplan from "../../page/publicPage/viewSeatPlan";

export const publicRoutes = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/exam_room",
    element: <ViewExamRoom />,
  },
  {
    path: "/viewSeatPlan",
    element: <ViewSeatplan />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
  

];