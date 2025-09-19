import HomePage from "../../page/publicPage/HomePage";
import NotFound from "../../page/publicPage/NotFound";
// import ActiveSeatingPlan from "../../page/publicPage/ViewActiveSeatPlan";
import ViewExamRoom from "../../page/publicPage/ViewExamRoom";

export const publicRoutes = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/exam_room",
    element: <ViewExamRoom />,
  },
  // {
  //   path: "/viewActiveSeatPlan",
  //   element: <ActiveSeatingPlan />,
  // },
  {
    path: "*",
    element: <NotFound />,
  },
  

];