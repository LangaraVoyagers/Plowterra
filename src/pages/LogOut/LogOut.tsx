import { useUser } from "context/UserProvider";
import { useEffect } from "react";
import { Cookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import paths from "shared/paths";
const cookies = new Cookies();

const LogOut = () => {
  const { clearUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    clearUser();
    cookies.remove("_t");
    //TODO: endpoint to logout
    navigate(paths.login);
  }, []);

  return <div>Loading...</div>;
};

export default LogOut;
