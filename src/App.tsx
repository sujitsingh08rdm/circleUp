import { BrowserRouter, Routes, Route } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import "animate.css";
import Home from "./component/Home";
import Login from "./component/Login";
import Signup from "./component/Signup";
import Layout from "./component/app/Layout";
import Dashboard from "./component/app/Dashboard";
import Posts from "./component/app/Posts";
import Video from "./component/app/Video";
import Audio from "./component/app/Audio";
import Chat from "./component/app/Chat";
import NotFound from "./component/NotFound";
import Context from "./Context";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import AuthGuard from "./guard/AuthGuard";
import RedirectGuard from "./guard/RedirectGuard";
import FriendList from "./component/app/friend/FriendList";

const App = () => {
  const [session, setSession] = useState(null);
  const [liveActiveSession, setLiveActiveSession] = useState(null);
  const [sdp, setSdp] = useState(null);

  return (
    <Context.Provider
      value={{
        session,
        setSession,
        liveActiveSession,
        setLiveActiveSession,
        sdp,
        setSdp,
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<RedirectGuard />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>
          <Route element={<AuthGuard />}>
            <Route path="/app" element={<Layout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="my-posts" element={<Posts />} />
              <Route path="friends" element={<FriendList />} />
              <Route path="video-chat/:id" element={<Video />} />
              <Route path="audio-chat/:id" element={<Audio />} />
              <Route path="chat/:id" element={<Chat />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </Context.Provider>
  );
};

export default App;
