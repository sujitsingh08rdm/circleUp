import React, { type FC } from "react";
import Card from "../../shared/Card";
import { Link } from "react-router-dom";
import IconButton from "../../shared/IconButton";

interface FriendListInterface {
  columns?: number;
  gap?: number;
}

const FriendList: FC<FriendListInterface> = ({ columns = 4, gap = 4 }) => {
  return (
    <div className={`grid grid-cols-${columns} gap-${gap}`}>
      {Array(12)
        .fill(0)
        .map((item, index) => (
          <Card key={index}>
            <div className="flex flex-col items-center gap-2">
              <img
                src={"/images/default.png"}
                className="w-16 h-16 rounded-full border border-rose-50 object-cover"
                alt="avtar"
              />
              <h2 className="font-bold text-base capitalize">
                {"Rahul Prasad"}
              </h2>
              <div className="relative">
                {index === 1 ? (
                  <button
                    // onClick={() => unfriend(item._id)}
                    className="px-2 py-1 bg-rose-400 text-white text-xs flex items-center hover:bg-rose-600 hover:text-gray-200 rounded-md"
                  >
                    <i className="ri-user-minus-fill mr-1"></i>
                    Unfriend
                  </button>
                ) : (
                  <button className="px-2 py-1 bg-green-400 text-white text-xs flex items-center hover:bg-green-600 hover:text-gray-200 rounded-md">
                    <i className="ri-user-fill mr-1"></i>
                    Requested
                  </button>
                )}
                <div className="w-4 h-4 rounded-full absolute -top-2 -right-2 bg-green-400 border border-gray-100 animate__animated animate__pulse animate__infinite" />
              </div>
              <div className="flex gap-4 mt-2">
                <Link to="/app/chat">
                  <IconButton type="primary" icon="chat-1-line"></IconButton>
                </Link>
                <Link to="/app/audio-chat">
                  <IconButton type="warning" icon="phone-line"></IconButton>
                </Link>
                <Link to="/app/video-chat">
                  <IconButton
                    type="success"
                    icon="video-chat-line"
                  ></IconButton>
                </Link>
              </div>
            </div>
          </Card>
        ))}
    </div>
  );
};

export default FriendList;
