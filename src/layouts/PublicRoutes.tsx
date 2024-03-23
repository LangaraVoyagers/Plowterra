import { useUser } from "context/UserProvider";
import { Navigate, Outlet } from "react-router-dom";
import paths from "shared/paths";

const PublicRoutes = () => {
  const { user } = useUser();

  if (user.farm._id) {
    return <Navigate to={paths.home} />;
  }

  return <Outlet />;
};

export default PublicRoutes;
