import Button from "../shared/Button";
import Card from "../shared/Card";

const Audio = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4">
        <Card title="Monu Kumar">
          <div className="flex flex-col items-center">
            <img
              src="/images/default.png"
              className="w-40 h-40 rounded-full object-cover"
              alt="avatar"
            />
          </div>
        </Card>
        <Card title="Arushi">
          <div className="flex flex-col items-center">
            <img
              src="/images/avtar.jpg"
              className="w-40 h-40 rounded-full object-cover"
              alt="avatar"
            />
          </div>
        </Card>
      </div>
      <div className="flex justify-between items-center bg-gray-200 rounded-xl p-4">
        <div className="space-x-4">
          <button className="bg-amber-50 h-12 w-12 rounded-full text-amber-500 hover:bg-amber-500 hover:text-amber-50">
            <i className="ri-mic-line"></i>
          </button>
          <button className="bg-blue-50 h-12 w-12 rounded-full text-blue-500 hover:bg-blue-500 hover:text-blue-50">
            <i className="ri-add-fill"></i>
          </button>
        </div>
        <Button icon="close-circle-fill" type="danger">
          End
        </Button>
      </div>
    </div>
  );
};

export default Audio;
