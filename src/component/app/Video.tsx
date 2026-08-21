import Button from "../shared/Button";

const Video = () => {
  return (
    <div className="space-y-8">
      <div className="bg-black w-full h-0 relative pb-[56.25%] rounded-xl">
        <video className="absolute top-0 left-0 w-full h-full"></video>
        <button className="absolute bottom-5 left-5 text-gray-300 bg-gray-500 opacity-70 rounded text-sm py-1 px-2 hover:text-gray-100">
          Rahul Prasad
        </button>
        <button className="absolute bottom-5 right-5 text-gray-300 bg-gray-500 opacity-70 rounded text-sm py-1 px-2 hover:text-gray-100">
          <i className="ri-fullscreen-line"></i>
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-black w-full h-0 relative pb-[56.25%] rounded-xl">
          <video className="absolute top-0 left-0 w-full h-full"></video>
          <button className="absolute bottom-2 left-2 text-gray-300 bg-gray-500 opacity-70 rounded text-xs py-1 px-2 hover:text-gray-100">
            Rahul Prasad
          </button>
        </div>
        <Button type="dark" icon="user-add-line">
          Add
        </Button>
      </div>
      <div className="flex justify-between items-center bg-gray-200 rounded-xl p-4">
        <div className="space-x-4">
          <button className="bg-amber-50 h-12 w-12 rounded-full text-amber-500 hover:bg-amber-500 hover:text-amber-50">
            <i className="ri-mic-line"></i>
          </button>
          <button className="bg-green-50 h-12 w-12 rounded-full text-green-500 hover:bg-green-500 hover:text-green-50">
            <i className="ri-video-on-line"></i>
          </button>{" "}
          <button className="bg-rose-50 h-12 w-12 rounded-full text-rose-500 hover:bg-rose-500 hover:text-rose-50">
            <i className="ri-video-off-line"></i>
          </button>
          <button className="bg-blue-50 h-12 w-12 rounded-full text-blue-500 hover:bg-blue-500 hover:text-blue-50">
            <i className="ri-tv-2-line"></i>
          </button>
        </div>
        <Button icon="close-circle-fill" type="danger">
          End
        </Button>
      </div>
    </div>
  );
};

export default Video;
