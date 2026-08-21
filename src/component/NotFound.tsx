import { Link } from "react-router-dom";
import Button from "./shared/Button";
import Card from "./shared/Card";

const NotFound = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-indigo-100 via-blue-100 to-violet-100 flex items-center justify-center px-4">
      {/* Background decoration */}
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-indigo-300/60 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-blue-300/60 blur-3xl" />
      <Card noPadding>
        <section className="relative w-full max-w-xl">
          <div className="flex flex-col bg-linear-to-br rounded-lg from-indigo-200 via-blue-100 to-violet-200 items-center text-center px-6 py-12">
            {/* 404 */}
            <span className="select-none text-[120px] leading-none font-black tracking-tighter text-indigo-600/90">
              404
            </span>

            <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
              Page not found
            </h1>

            <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
              The page you're looking for doesn't exist, has been moved, or you
              may have followed an outdated link.
            </p>

            <div className="mt-8">
              <Link to="/">
                <Button type="secondary" icon="home-4-line">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </Card>
    </div>
  );
};

export default NotFound;
