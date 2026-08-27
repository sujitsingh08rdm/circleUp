import useSWR, { mutate } from "swr";
import Fetcher from "../../lib/Fetcher";
import Card from "../shared/Card";
import { Skeleton } from "antd";
import Error from "../shared/Error";
import CatchError from "../../lib/CatchError";
import HttpInterceptor from "../../lib/HttpsInterceptor";

const Friends = () => {
  const { data, error, isLoading } = useSWR("/friend", Fetcher);

  const unfriend = async (id: string) => {
    try {
      await HttpInterceptor.delete(`/friend/${id}`);
      mutate("/friend");
    } catch (error) {
      CatchError(error);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-linear-to-br from-indigo-100 via-blue-100 to-violet-100 p-5">
        <Skeleton active />
      </div>
    );
  }

  if (error) {
    return <Error message={error.message} />;
  }

  return (
    <div className="grid grid-cols-3 gap-8">
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
            {item.status === "accepted" ? (
              <button
                onClick={() => unfriend(item._id)}
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
          </div>
        </Card>
      ))}
    </div>
  );
};

export default Friends;
