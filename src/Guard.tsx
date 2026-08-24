import { useContext, useEffect } from "react";
import HttpInterceptor from "./lib/HttpsInterceptor";
import Context from "./Context";
import { Navigate, Outlet } from "react-router-dom";

const Guard = () => {
  const { session, setSession } = useContext(Context);

  const getSession = async () => {
    try {
      const { data } = await HttpInterceptor("/auth/session");
      setSession(data);
    } catch (error) {
      setSession(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getSession();
  }, []);

  if (session === null) {
    return null;
  }

  if (session === false) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default Guard;
