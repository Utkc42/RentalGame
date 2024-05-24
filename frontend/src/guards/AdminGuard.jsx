import { useUser } from "../context/UserContext";
import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

const AdminGuard = ({ children }) => {
  const { user } = useUser();

  // If user is authenticated and has admin role, allow navigation, otherwise redirect to home
  if (user && user.token) {
    const decodedToken = jwtDecode(user.token);

    return decodedToken.role.toLowerCase() === "admin" ? (
      children
    ) : (
      <Navigate to="/" replace />
    );
  }

  // If user or token is not available, redirect to home
  return <Navigate to="/" replace />;
};

export default AdminGuard;

AdminGuard.propTypes = {
  children: PropTypes.node.isRequired,
};
