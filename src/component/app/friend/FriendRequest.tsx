// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Card from "../../shared/Card";
import Button from "../../shared/Button";
import useSWR, { mutate } from "swr";
import Fetcher from "../../../lib/Fetcher";
import { Empty, Skeleton } from "antd";
import CatchError from "../../../lib/CatchError";
import HttpInterceptor from "../../../lib/HttpsInterceptor";

const FriendRequest = () => {
  const { data, isLoading, error } = useSWR("/friend/request", Fetcher);

  const acceptFriend = async (id: string) => {
    try {
      await HttpInterceptor.put(`/friend/${id}`, { status: "accepted" });
      mutate("/friend/request");

      mutate("/friend");
    } catch (error) {
      CatchError(error);
    }
  };

  if (isLoading) {
    return <Skeleton />;
  }

  if (error) {
    return <Empty />;
  }

  return (
    <Card title="Friend Request" divider>
      {data.length === 0 && <Empty />}
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
          {data.map((item: any, index: number) => (
            <SwiperSlide key={index}>
              <div className="flex flex-col items-center gap-2 border border-gray-200 p-2 rounded-lg">
                <img
                  src={item.user.image || "/images/default.png"}
                  alt="avatar"
                  className="h-16 w-16 rounded-full object-cover"
                />
                <h2 className="text-base font-medium capitalize">
                  {item.user.fullname}
                </h2>
                <Button
                  onClick={() => acceptFriend(item._id)}
                  type="smSecondary"
                  icon="user-add-fill"
                >
                  Accept Request
                </Button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Card>
  );
};

export default FriendRequest;
