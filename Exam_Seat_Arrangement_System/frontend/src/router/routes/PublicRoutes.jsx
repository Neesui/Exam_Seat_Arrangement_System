import HomePage from "../../page/publicPage/HomePage";
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
  

];