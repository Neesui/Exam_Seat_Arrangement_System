import { Outlet } from "react-router-dom";
import InvNavbar from "../component/invigilator/InvNavbar";

const InvigilatorLayout = () => {
  return (
    <>
    <InvNavbar />
      <Outlet />
    </>
  );
};

export default InvigilatorLayout;
