import { Outlet } from "react-router-dom";
import Navbar from "../component/public/Navbar";
import { Footer } from "../component/public/Footer";

const PublicLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default PublicLayout;
