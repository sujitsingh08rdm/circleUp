// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import Card from "../../shared/Card";
import Button from "../../shared/Button";
import Fetcher from "../../../lib/Fetcher";
import useSWR, { mutate } from "swr";
import { Empty, message, Skeleton } from "antd";
import CatchError from "../../../lib/CatchError";
import HttpInterceptor from "../../../lib/HttpsInterceptor";
import { toast } from "react-toastify";

const FriendSuggestion = () => {
  const { data, error, isLoading } = useSWR("/friend/suggestion", Fetcher);

  const sendFriendRequest = async (id: string) => {
    try {
      await HttpInterceptor.post("/friend", { friend: id });
      toast.success("Friend request sent");
      mutate("/friend/suggestion");
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

  return (
    <Card title="Suggestions" divider>
      <div>
        <Swiper
          slidesPerView={3}
          spaceBetween={30}
          className="mySwiper"
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
        >
          {data.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="flex flex-col items-center gap-2 border border-gray-200 p-2 rounded-lg">
                <img
                  src={item.image || "/images/default.png"}
                  alt="avatar"
                  className="h-16 w-16 rounded-full object-cover"
                />
                <h2 className="text-base font-medium capitalize">
                  {item.fullname}
                </h2>
                <Button
                  onClick={() => sendFriendRequest(item._id)}
                  type="smSecondary"
                  icon="user-add-fill"
                >
                  Add Friend
                </Button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Card>
  );
};

export default FriendSuggestion;
