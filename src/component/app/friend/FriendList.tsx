import React, { type FC } from "react";
import Card from "../../shared/Card";
import { Link } from "react-router-dom";
import IconButton from "../../shared/IconButton";
import Fetcher from "../../../lib/Fetcher";
import useSWR, { mutate } from "swr";
import { Empty, Skeleton } from "antd";
import CatchError from "../../../lib/CatchError";
import HttpInterceptor from "../../../lib/HttpsInterceptor";

interface FriendListInterface {
  columns?: number;
  gap?: number;
}

const FriendList: FC<FriendListInterface> = ({ columns = 4, gap = 4 }) => {
  const { data, isLoading, error } = useSWR("/friend", Fetcher);
  console.log("FL", data);

  const unfriend = async (id: string) => {
    try {
      await HttpInterceptor.delete(`/friend/${id}`);
      mutate("/friend");
    } catch (error) {
      CatchError(error);
    }
  };

  if (isLoading) {
    return <Skeleton active />;
  }

  if (error) {
    return <Empty />;
  }

  if (data.length === 0) {
    return <Empty />;
  }

  return (
    <div className={`grid grid-cols-${columns} gap-${gap}`}>
      {data.map((item: any, index: number) => (
        <Card key={index}>
          <div className="flex flex-col items-center gap-2">
            <img
              src={item.friend.image || "/images/default.png"}
              className="w-16 h-16 rounded-full border border-rose-50 object-cover"
              alt="avtar"
            />
            <h2 className="font-bold text-base capitalize">
              {item.friend.fullname}
            </h2>
            <div className="relative">
              {item.status === "requested" ? (
                <button className="px-2 py-1 bg-gray-400 text-white text-xs flex items-center hover:bg-gray-600 hover:text-gray-200 rounded-md">
                  Requested
                </button>
              ) : (
                <button
                  onClick={() => unfriend(item._id)}
                  className="px-2 py-1 bg-rose-400 text-white text-xs flex items-center hover:bg-rose-600 hover:text-gray-200 rounded-md"
                >
                  <i className="ri-user-minus-fill mr-1"></i>
                  Unfriend
                </button>
              )}

              <div className="w-4 h-4 rounded-full absolute -top-2 -right-2 bg-green-400 border border-gray-100 animate__animated animate__pulse animate__infinite" />
            </div>
            {/* <div className="flex gap-4 mt-2">
              <Link to="/app/chat">
                <IconButton type="primary" icon="chat-1-line"></IconButton>
              </Link>
              <Link to="/app/audio-chat">
                <IconButton type="warning" icon="phone-line"></IconButton>
              </Link>
              <Link to="/app/video-chat">
                <IconButton type="success" icon="video-chat-line"></IconButton>
              </Link>
            </div> */}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default FriendList;
