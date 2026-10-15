import { Navigate } from "react-router-dom";

function ProtectedRoute({ accountType, children }) {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!token || !user) {
    return <Navigate to={`/${accountType}/login`} replace />;
  }

  if (user.accountType !== accountType) {
    return <Navigate to={`/${user.accountType}/dashboard`} replace />;
  }

  return children;
}

export default ProtectedRoute;
