import { useUser } from "context/UserProvider";
import Login from "pages/Login";
import { Navigate } from "react-router-dom";
import paths from "shared/paths";

const PublicRoutes = () => {
  const { user } = useUser();

  if (user.farm._id !== "") {
    return <Navigate to={paths.home} />;
  }

  return <Login />;
};

export default PublicRoutes;
