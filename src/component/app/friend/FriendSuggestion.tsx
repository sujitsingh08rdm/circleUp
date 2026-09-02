// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import Card from "../../shared/Card";
import Button from "../../shared/Button";

const FriendSuggestion = () => {
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
          {Array(10)
            .fill(0)
            .map((item, index) => (
              <SwiperSlide key={index}>
                <div className="flex flex-col items-center gap-2 border border-gray-200 p-2 rounded-lg">
                  <img
                    src="/images/default.png"
                    alt="avatar"
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  <h2 className="text-base font-medium capitalize">Sujit</h2>
                  <Button type="smSecondary" icon="user-add-fill">
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
