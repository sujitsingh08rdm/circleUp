import { useContext, useEffect } from "react";
import HttpInterceptor from "../lib/HttpsInterceptor";
import Context from "../Context";
import { Navigate, Outlet } from "react-router-dom";
import { Skeleton } from "antd";
import CatchError from "../lib/CatchError";

const AuthGuard = () => {
  const { session, setSession } = useContext(Context);

  const getSession = async () => {
    try {
      const { data } = await HttpInterceptor("/auth/session");
      setSession(data);
    } catch (error) {
      setSession(false);
      CatchError(error);
    }
  };

  useEffect(() => {
    getSession();
  }, []);

  if (session === null) {
    return (
      <div className="w-full h-screen bg-linear-to-br from-indigo-100 via-blue-100 to-violet-100 p-5">
        <Skeleton active />
      </div>
    );
  }

  if (session === false) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default AuthGuard;
