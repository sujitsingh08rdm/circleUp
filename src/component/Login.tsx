import { Link, useNavigate } from "react-router-dom";
import Button from "./shared/Button";
import Card from "./shared/Card";
import Input from "./shared/Input";
import Form, { type FormDataType } from "./shared/Form";
import HttpInterceptor from "../lib/HttpsInterceptor";
import CatchError from "../lib/CatchError";

const Login = () => {
  const navigate = useNavigate();

  const login = async (values: FormDataType) => {
    try {
      await HttpInterceptor.post("/auth/login", values);
      navigate("/app");
    } catch (error: unknown) {
      CatchError(error);
    }
  };

  return (
    <div className="bg-linear-to-br from-indigo-100 via-blue-100 to-violet-100 flex items-center justify-center h-screen">
      <div className="lg:w-6/12 animate__animated animate__fadeIn">
        <Card noPadding>
          <div className="grid lg:grid-cols-2">
            <div className="bg-linear-to-br from-violet-100 via-blue-100 to-indigo-100 p-8 space-y-6 lg:order-1 order-2">
              <div className="space-y-1">
                <h1 className="text-3xl font-bold text-slate-900">Login</h1>
                <p className="text-slate-700 text-xs font-normal">
                  Enter credentials..
                </p>
              </div>
              <Form className="space-y-4" onValue={login}>
                <Input name="email" type="email" placeholder="Email.." />
                <Input
                  name="password"
                  type="password"
                  placeholder="Password.."
                />
                <Button icon="login-box-fill" type="secondary">
                  Login
                </Button>
              </Form>
              <div className="flex gap-2">
                <p>Dont have an acount?</p>
                <Link
                  className="font-medium hover:font-lg text-indigo-500 hover:text-indigo-700"
                  to="/signup"
                >
                  Sign up
                </Link>
              </div>
            </div>
            <div className="h-75 bg-linear-to-br from-indigo-400 via-blue-200 to-violet-600  rounded-r-lg flex items-center overflow-hidden lg:order-2 order-1">
              <img
                src="/images/auth.svg"
                alt="auth"
                className="w-full animate__animated animate__slideInUp h-40 lg:h-auto"
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
