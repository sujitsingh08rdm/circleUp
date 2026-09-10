import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
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
import FriendSuggestion from "./friend/FriendSuggestion";
import FriendRequest from "./friend/FriendRequest";
import FriendList from "./friend/FriendList";
import { useMediaQuery } from "react-responsive";
import Logo from "../shared/Logo";
import IconButton from "../shared/IconButton";
import FriendsOnline from "./friend/FriendsOnline";
import socket from "../../lib/socket";
import type { onOfferInterface } from "./Video";

const eightMinInMs = 8 * 60 * 1000;

const Layout = () => {
  const { pathname } = useLocation();
  const {
    session,
    setSession,
    liveActiveSession,
    setLiveActiveSession,
    setSdp,
  } = useContext(Context);
  const navigate = useNavigate();
  const [leftAsideSize, setLeftAsideSize] = useState(0);
  const [collapseSize, setCollapseSize] = useState(0);

  const params = useParams();
  const paramsArray = Object.keys(params);
  const rightAsideSize = 400;
  const friendsUIBlacklist = [
    "/app/friends",
    "/app/chat",
    "/app/audio-chat",
    "/app/video-chat",
  ];
  const isMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  const isBlacklisted = friendsUIBlacklist.some((path) => pathname === path);

  // const { error } = useSWR("/auth/refresh-token", Fetcher, {
  //   refreshInterval: eightMinInMs,
  //   shouldRetryOnError: false,
  // });

  const sectionDimention = {
    width: isMobile ? "100%" : `calc(100% - ${leftAsideSize}px)`,
    marginLeft: isMobile ? 0 : leftAsideSize,
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

  const onOffer = (payload: onOfferInterface) => {
    setSdp(payload);
    setLiveActiveSession(payload.from);
    navigate(`/app/video-chat/${payload.from.socketId}`);
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

  const ActiveSessionUi = () => {
    if (!liveActiveSession) {
      navigate("/app");
      return;
    }
    return (
      <div className="flex gap-2">
        <img
          src={liveActiveSession.image}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex flex-col items-center">
          <h2 className="font-medium">{liveActiveSession.fullname}</h2>
          <label className="text-xs font-normal text-green-400">Online</label>
        </div>
      </div>
    );
  };
  // useEffect(() => {
  //   if (error) {
  //     logout();
  //   }
  // }, [error]);

  useEffect(() => {
    setLeftAsideSize(isMobile ? 0 : 350);
    setCollapseSize(isMobile ? 0 : 140);
  }, [isMobile]);

  useEffect(() => {
    socket.on("offer", onOffer);

    return () => {
      socket.off("offer", onOffer);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <nav className="flex lg:hidden justify-between items-center bg-linear-to-br from-[#3D4E81] via-[#5753C9] to-[#6E7FF3] sticky top-0 left-0 w-full p-4 z-[20000] py-4 px-6">
        <Logo />
        <div className="flex gap-4">
          <IconButton onClick={logout} icon="logout-box-line" />
          <Link to="/app/friends">
            <IconButton icon="group-line" />
          </Link>
          <IconButton
            onClick={() =>
              setLeftAsideSize((prev) => (prev === 350 ? collapseSize : 250))
            }
            icon="menu-line"
          />
        </div>
      </nav>
      <aside
        className="lg:p-8 h-full bg-white overflow-auto fixed left-0 top-0 z-[20000]"
        style={{ width: leftAsideSize, transition: "0.3s" }}
      >
        <div className="space-y-8 lg:rounded-2xl h-full p-8 bg-linear-to-br from-[#3D4E81] via-[#5753C9] to-[#6E7FF3]">
          {leftAsideSize === collapseSize ? (
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
                  className={`capitalize ${leftAsideSize === collapseSize ? "hidden" : null}`}
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
                className={`${leftAsideSize === collapseSize ? "hidden" : null}`}
              >
                Logout
              </label>
            </button>
          </div>
        </div>
      </aside>
      <section
        className="rounded-2xl flex gap-8 flex-col p-6 lg:py-8 lg:px-2 lg:flex-row"
        style={sectionDimention}
      >
        {/* {!isBlacklisted && <FriendRequest />} */}
        <div className="flex-1 lg:order-1 order-2">
          <Card
            divider
            title={
              <div className="flex items-center gap-4">
                <button
                  onClick={() =>
                    setLeftAsideSize((prev) =>
                      prev === 350 ? collapseSize : 350,
                    )
                  }
                  className="lg:block hidden w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100"
                >
                  <i className="ri-arrow-left-long-line"></i>
                </button>
                <h2>
                  {paramsArray.length === 0 ? (
                    getPathname(pathname)
                  ) : (
                    <ActiveSessionUi />
                  )}
                </h2>
              </div>
            }
          >
            {pathname === "/app" ? <Dashboard /> : <Outlet />}
          </Card>
        </div>

        <aside className="bg-white lg:w-90 lg:pr-6 lg:order-2 order-1 flex flex-col gap-8">
          <FriendRequest />
          <FriendSuggestion />
          <FriendsOnline />
        </aside>

        {/* {!isBlacklisted && <FriendSuggestion />} */}
      </section>
    </div>
  );
};

export default Layout;
