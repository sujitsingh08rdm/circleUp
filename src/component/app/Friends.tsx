import Card from "../shared/Card";

const Friends = () => {
  return (
    <div className="grid grid-cols-3 gap-8">
      {Array(20)
        .fill(0)
        .map((item, index) => (
          <Card key={index}>
            <div className="flex flex-col items-center gap-2">
              <img
                src="/images/default.png"
                className="w-16 h-16 rounded-full border border-rose-50 object-cover"
                alt="avtar"
              />
              <h2 className="font-bold text-base">Er Saurav</h2>
              <button className="px-2 py-1 bg-rose-400 text-white text-xs flex items-center hover:bg-rose-600 hover:text-gray-200 rounded-md">
                <i className="ri-user-minus-fill mr-1"></i>
                Unfriend
              </button>
            </div>
          </Card>
        ))}
    </div>
  );
};

export default Friends;
