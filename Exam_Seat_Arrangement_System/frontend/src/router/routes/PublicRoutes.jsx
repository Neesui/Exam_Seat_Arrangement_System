
import ForgotPasswordPage from "../../pages/publicPage/ForgotPasswordPage";
import HomePage from "../../pages/publicPage/HomePage";
import ResetPasswordPage from "../../pages/publicPage/ResetPasswordPage";
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
  },
  {
    path: "/forgotPassword/resetPassword",
    element: <ResetPasswordPage />,
  },
  {
    path: "/forgotPassword",
    element: <ForgotPasswordPage/>,
  },

  

];