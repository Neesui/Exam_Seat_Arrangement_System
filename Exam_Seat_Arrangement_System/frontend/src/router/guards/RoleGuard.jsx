import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const RoleGuard = ({ children, allowedRoles }) => {
//   const { user } = useSelector((state) => state.auth);

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleGuard;