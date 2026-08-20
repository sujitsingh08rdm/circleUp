import { BrowserRouter, Route, Routes } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import Home from "./component/Home";
import Login from "./component/Login";
import Signup from "./component/Signup";
import Layout from "./component/app/Layout";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/app" element={<Layout />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
