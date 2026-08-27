import Fetcher from "../../lib/Fetcher";
import Card from "../shared/Card";
import UseSWR, { mutate } from "swr";
import { Empty, Skeleton } from "antd";
import Error from "../shared/Error";
import Button from "../shared/Button";
import CatchError from "../../lib/CatchError";
import HttpInterceptor from "../../lib/HttpsInterceptor";
import { useState } from "react";
import { toast } from "react-toastify";

const FriendSuggestion = () => {
  const [loading, setLoading] = useState({
    state: false,
    index: 0,
  });
  const { data, error, isLoading } = UseSWR("/friend/suggestion", Fetcher);

  async function sendFriendRequest(id: string, index: number) {
    try {
      setLoading({ state: true, index });
      await HttpInterceptor.post("/friend", { friend: id });
      toast.success("Friend request sent!");
      mutate("/friend/suggestion");
      mutate("/friend");
    } catch (error) {
      CatchError(error);
    } finally {
      setLoading({ state: false, index: 0 });
    }
  }

  return (
    <div className="h-70 overflow-auto">
      <Card divider title="Friend Suggestion">
        {isLoading && <Skeleton active />}
        {error && <Error message={error.message} />}
        {data && (
          <div className="space-y-4">
            {data.map((item: any, index: number) => (
              <div className="flex gap-4" key={index}>
                <img
                  src={item.image || "/images/default.png"}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h2 className="-mt-0.5 font-medium capitalize">
                    {item.fullname}
                    {/* <small>{moment(item.createdAt).format("DD MMM, YY")}</small> */}
                  </h2>
                  {/* <button className="px-2 py-1 bg-indigo-400 text-white text-xs flex items-center hover:bg-indigo-600 hover:text-gray-200 rounded-md">
                    <i className="ri-user-add-fill mr-1"></i>
                    Add Friend
                  </button> */}
                  <Button
                    loading={loading.state && loading.index === index}
                    onClick={() => {
                      sendFriendRequest(item._id, index);
                    }}
                    type="smSecondary"
                    icon="user-add-fill"
                  >
                    Add Friend
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        {data && data.length === 0 && <Empty />}
      </Card>
    </div>
  );
};

export default FriendSuggestion;
