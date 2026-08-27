import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import Avatar from "../shared/Avatar";
import Card from "../shared/Card";
import { useContext, useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import Context from "../../Context";
import HttpInterceptor from "../../lib/HttpsInterceptor";
import { v4 as uuid } from "uuid";
import useSWR, { mutate } from "swr";
import Fetcher from "../../lib/Fetcher";
import CatchError from "../../lib/CatchError";
import FriendSuggestion from "./FriendSuggestion";
import FriendRequest from "./FriendRequest";

const eightMinInMs = 8 * 60 * 1000;

const Layout = () => {
  const { pathname } = useLocation();
  const { session, setSession } = useContext(Context);
  const navigate = useNavigate();
  const [leftAsideSize, setLeftAsideSize] = useState(350);
  const collpaseSize = 140;
  const rightAsideSize = 400;
  const { error } = useSWR("/auth/refresh-token", Fetcher, {
    refreshInterval: eightMinInMs,
    shouldRetryOnError: false,
  });

  const sectionDimention = {
    width: `calc(100% - ${leftAsideSize + rightAsideSize}px)`,
    marginLeft: leftAsideSize,
    transition: "0.3s",
  };

  const menus = [
    {
      id: "01",
      href: "dashboard",
      label: "dashboard",
      icon: "ri-dashboard-horizontal-fill",
    },
    {
      id: "02",
      href: "my-posts",
      label: "my posts",
      icon: "ri-sticky-note-fill",
    },
    { id: "03", href: "friends", label: "friends", icon: "ri-group-3-fill" },
  ];

  const logout = async () => {
    try {
      await HttpInterceptor.post("/auth/logout");
      navigate("/login");
    } catch (error) {
      CatchError(error);
    }
  };

  const getPathname = (path: string) => {
    const firstPath = path.split("/").pop();
    const finalPath = firstPath!.split("-").join(" ");
    return finalPath;
  };

  const uploadImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();
    input.onchange = async () => {
      if (!input.files) {
        return;
      }

      const file = input.files[0];
      const path = `profile-picture/${uuid()}.png`;
      const payload = {
        path,
        type: file.type,
        status: "public-read",
      };

      try {
        const options = {
          headers: {
            "Content-Type": file.type,
          },
        };
        const { data } = await HttpInterceptor.post("/storage/upload", payload);
        await HttpInterceptor.put(data.url, file, options);
        const { data: user } = await HttpInterceptor.put(
          "/auth/profile-picture",
          {
            path,
          },
        );
        setSession({ ...session, image: user.image });
        mutate("/auth/refresh-token");
      } catch (error) {
        console.log(error);
      }
    };
  };

  useEffect(() => {
    if (error) {
      logout();
    }
  }, [error]);

  return (
    <div className="min-h-screen">
      <aside
        className="p-8 h-full bg-white overflow-auto fixed left-0 top-0"
        style={{ width: leftAsideSize, transition: "0.3s" }}
      >
        <div className="space-y-8 rounded-2xl h-full p-8 bg-linear-to-br from-[#3D4E81] via-[#5753C9] to-[#6E7FF3]">
          {leftAsideSize === collpaseSize ? (
            <i className="ri-user-fill text-xl animate__animated animate__fadeIn text-gray-300 hover:text-gray-100 hover:font-medium"></i>
          ) : (
            <div className="animate__animated animate__fadeIn">
              {session && (
                <Avatar
                  title={session.fullname}
                  subtitle={session.email}
                  image={session.image || "/images/avtar.jpg"}
                  onClick={uploadImage}
                />
              )}
            </div>
          )}

          <div>
            {menus.map((item) => (
              <Link
                key={item.id}
                to={item.href}
                title={item.label}
                className="flex text-gray-300 gap-3 items-center py-3 hover:text-gray-100 hover:font-medium"
              >
                <i className={`${item.icon} text-xl`}></i>
                <label
                  className={`capitalize ${leftAsideSize === collpaseSize ? "hidden" : null}`}
                >
                  {item.label}
                </label>
              </Link>
            ))}

            <button
              title="logout"
              className="flex text-gray-300 gap-3 items-center py-3 hover:text-gray-100 hover:font-medium"
              onClick={logout}
            >
              <i className="ri-logout-box-r-line text-xl"></i>
              <label
                className={`${leftAsideSize === collpaseSize ? "hidden" : null}`}
              >
                Logout
              </label>
            </button>
          </div>
        </div>
      </aside>
      <section className="rounded-2xl py-8 px-2" style={sectionDimention}>
        <Card
          divider
          title={
            <div className="flex items-center gap-4">
              <button
                onClick={() =>
                  setLeftAsideSize((prev) =>
                    prev === 350 ? collpaseSize : 350,
                  )
                }
                className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100"
              >
                <i className="ri-arrow-left-long-line"></i>
              </button>
              <h2>{getPathname(pathname)}</h2>
            </div>
          }
        >
          {pathname === "/app" ? <Dashboard /> : <Outlet />}
        </Card>
      </section>
      <aside
        className="space-y-4 p-8 h-full bg-white overflow-auto fixed right-0 top-0"
        style={{ width: rightAsideSize, transition: "0.3s" }}
      >
        <FriendSuggestion />
        <FriendRequest />

        <Card title="My Friends" divider>
          <div className="space-y-4">
            {Array(20)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-2 items-center rounded flex justify-between"
                >
                  <Avatar
                    size="md"
                    image="/images/default.png"
                    title="Monu Kumar"
                    titleColor="black"
                    subtitle={
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${index % 2 === 0 ? "bg-green-500" : "bg-gray-500"}`}
                        />
                        <small className="text-xs font-normal text-gray-500">
                          {index % 2 === 0 ? "Online" : "Offline"}
                        </small>
                      </div>
                    }
                  />
                  <div className="space-x-2 items-center">
                    <Link to="/app/chat">
                      <button
                        className="text-blue-400 hover:text-blue-600"
                        title="Chat"
                      >
                        <i className="ri-chat-1-line"></i>
                      </button>
                    </Link>
                    <Link to="/app/audio-chat">
                      <button
                        className="text-amber-400 hover:text-amber-600"
                        title="Call"
                      >
                        <i className="ri-phone-line"></i>
                      </button>
                    </Link>
                    <Link to="/app/video-chat">
                      <button
                        className="text-green-400 hover:text-green-600"
                        title="Chat"
                      >
                        <i className="ri-video-chat-line"></i>
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </aside>
    </div>
  );
};

export default Layout;
