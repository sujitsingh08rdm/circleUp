import { Link } from "react-router-dom";
import Button from "./shared/Button";
import Card from "./shared/Card";
import Input from "./shared/Input";

const Signup = () => {
  return (
    <div className="bg-linear-to-br from-indigo-100 via-blue-100 to-violet-100 flex items-center justify-center h-screen">
      <div className="w-6/12 animate__animated animate__fadeIn">
        <Card noPadding>
          <div className="grid grid-cols-2">
            <div className="bg-indigo-100 p-8 space-y-6">
              <div className="space-y-1">
                <h1 className="text-2xl font-medium text-slate-900">
                  Add An Account
                </h1>
                <p className="text-slate-700 text-xs font-normal">
                  Join and connect with wonderful people across the world!
                </p>
              </div>
              <form className="space-y-4">
                <Input name="fullname" placeholder="Fullname..." />
                <Input name="email" type="email" placeholder="Email.." />
                <Input name="mobile" placeholder="Mobile.." />
                <Input
                  name="password"
                  type="password"
                  placeholder="Password.."
                />
                <Button icon="login-box-fill" type="secondary">
                  Sign Up
                </Button>
              </form>
              <div className="flex gap-2">
                <p>Already have an acount?</p>
                <Link
                  className="font-medium hover:font-lg text-indigo-500 hover:text-indigo-700"
                  to="/login"
                >
                  Login
                </Link>
              </div>
            </div>
            <div className="h-[500px] bg-linear-to-br from-indigo-400 via-blue-200 to-violet-600  rounded-r-lg flex items-center overflow-hidden">
              <img
                src="/images/auth.svg"
                alt="auth"
                className="w-full animate__animated animate__slideInUp"
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
