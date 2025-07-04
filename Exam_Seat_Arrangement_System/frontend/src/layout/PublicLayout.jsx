import { Outlet } from "react-router-dom";
import Navbar from "../component/public/Navbar";

const PublicLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default PublicLayout;
