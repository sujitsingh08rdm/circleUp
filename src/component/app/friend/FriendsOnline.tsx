import { useContext, useEffect, useState } from "react";
import Card from "../../shared/Card";
import socket from "../../../lib/socket";
import { useNavigate } from "react-router-dom";
import Context from "../../../Context";
import Avatar from "../../shared/Avatar";

const FriendsOnline = () => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { session, setLiveActiveSession } = useContext(Context);
  const navigate = useNavigate();

  const onlineHandler = (users: any) => {
    // console.log(users);
    setOnlineUsers(users);
  };

  const generateActiveSession = (url: string, user: any) => {
    setLiveActiveSession(user);
    navigate(url);
  };

  useEffect(() => {
    socket.on("online", onlineHandler);
    socket.emit("get-online");

    return () => {
      socket.off("online", onlineHandler);
    };
  }, []);

  return (
    <Card title="Online friends">
      <div className="space-y-6">
        {session &&
          onlineUsers
            .filter((item: any) => item.id !== session.id)
            .map((item: any, index) => (
              <div
                key={index}
                className="bg-gray-50 p-2 items-center rounded flex justify-between"
              >
                <Avatar
                  size="md"
                  image={item.image || "/images/default.png"}
                  title={item.fullname}
                  titleColor="black"
                  subtitle={
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <small className="text-xs font-normal text-gray-500">
                        Online
                      </small>
                    </div>
                  }
                />
                <div className="space-x-2 items-center">
                  <button
                    className="text-blue-400 hover:text-blue-600 hover:cursor-pointer"
                    title="Chat"
                    onClick={() =>
                      generateActiveSession(`/app/chat/${item.id}`, item)
                    }
                  >
                    <i className="ri-chat-1-line"></i>
                  </button>

                  <button
                    className="text-amber-400 hover:text-amber-600 hover:cursor-pointer"
                    title="Call"
                    onClick={() =>
                      generateActiveSession(`/app/audio-chat/${item.id}`, item)
                    }
                  >
                    <i className="ri-phone-line"></i>
                  </button>

                  <button
                    className="text-green-400 hover:text-green-600 hover:cursor-pointer"
                    title="Chat"
                    onClick={() =>
                      generateActiveSession(`/app/video-chat/${item.id}`, item)
                    }
                  >
                    <i className="ri-video-chat-line"></i>
                  </button>
                </div>
              </div>
              //   <div key={index} className="flex">
              //     <div className="flex gap-3">
              //       <img
              //         src="/images/default.png"
              //         className="w-8 h-8 rounded-full object-cover"
              //       />
              //       <div>
              //         <h2 className="font-medium mb-1 capitalize">
              //           {item.fullname}
              //         </h2>
              //         <div className="flex items-center gap-4">
              //           <label className="capitalize text-[10px] font-medium text-green-400">
              //             online
              //           </label>
              //           <Link to="/app/chat">
              //             <i className="ri-chat-1-line text-blue-400"></i>
              //           </Link>
              //           <Link to="/app/audio-chat">
              //             <i className="ri-phone-line text-amber-400"></i>
              //           </Link>
              //           <Link to="/app/video-chat">
              //             <i className="ri-video-chat-line text-green-400"></i>
              //           </Link>
              //         </div>
              //       </div>
              //     </div>
              //     {/* {item.status === "online" && (
              //   <div className="flex gap-3 mt-3">
              //     <Link to="/app/chat">
              //       <IconButton type="primary" icon="chat-1-line"></IconButton>
              //     </Link>
              //     <Link to="/app/audio-chat">
              //       <IconButton type="warning" icon="phone-line"></IconButton>
              //     </Link>
              //     <Link to="/app/video-chat">
              //       <IconButton
              //         type="success"
              //         icon="video-chat-line"
              //       ></IconButton>
              //     </Link>
              //   </div>
              // )} */}
              //   </div>
            ))}
      </div>
    </Card>
  );
};

export default FriendsOnline;
