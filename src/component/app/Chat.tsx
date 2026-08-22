import Avatar from "../shared/Avatar";
import Button from "../shared/Button";
import Input from "../shared/Input";

const Chat = () => {
  return (
    <div>
      <div className="h-140 overflow-auto space-y-8">
        {Array(20)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="space-y-8">
              <div className="flex gap-4 items-start">
                <Avatar image="/images/avtar.jpg" size="md" />
                <div className="relative flex-1 bg-rose-50 p-2 rounded-xl text-slate-700 border border-rose-100">
                  <h2 className="font-bold">Arushi</h2>
                  <label>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Reprehenderit tempora cum et dolor autem rem doloribus velit
                    tenetur a, dolores facilis minus, ipsum est voluptates
                    officia deleniti magni dicta at?
                  </label>
                  <i className="ri-arrow-left-s-fill text-rose-50 text-4xl absolute -top-1 -left-5"></i>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="relative flex-1 bg-violet-50 p-2 rounded-xl text-slate-700 border border-violet-100">
                  <h2 className="font-bold">Arushi</h2>
                  <label>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Reprehenderit tempora cum et dolor autem rem doloribus velit
                    tenetur a, dolores facilis minus, ipsum est voluptates
                    officia deleniti magni dicta at?
                  </label>
                  <i className="ri-arrow-right-s-fill text-violet-50 text-4xl absolute -top-1 -right-5  "></i>
                </div>
                <Avatar image="/images/default.png" size="md" />
              </div>
            </div>
          ))}
      </div>
      <div className="p-3">
        <div className="flex items-center gap-4">
          <form className="flex gap-4 flex-1">
            <Input name="message" placeholder="Enter message..." />
            <Button icon="arrow-right-double-line" type="secondary">
              Send
            </Button>
          </form>
          <button className="h-11 w-11 rounded-full bg-indigo-50 hover:bg-indigo-100 hover:text-slate-800">
            <i className="ri-attachment-2"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
