import HomePage from "../../page/publicPage/HomePage";
import NotFound from "../../page/publicPage/NotFound";
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
  {
    path: "*",
    element: <NotFound />,
  },
  

];