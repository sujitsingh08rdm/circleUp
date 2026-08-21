import { BrowserRouter, Routes, Route } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import "animate.css";
import Home from "./component/Home";
import Login from "./component/Login";
import Signup from "./component/Signup";
import Layout from "./component/app/Layout";
import Dashboard from "./component/app/Dashboard";
import Posts from "./component/app/Posts";
import Friends from "./component/app/Friends";
import Video from "./component/app/Video";
import Audio from "./component/app/Audio";
import Chat from "./component/app/Chat";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/app" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="my-posts" element={<Posts />} />
          <Route path="friends" element={<Friends />} />
          <Route path="video-chat" element={<Video />} />
          <Route path="audio-chat" element={<Audio />} />
          <Route path="chat" element={<Chat />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
