import Avatar from "../shared/Avatar";
import Button from "../shared/Button";
import Input from "../shared/Input";
import Form from "../shared/Form";
import socket from "../../lib/socket";
import {
  useContext,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FC,
} from "react";
import Context from "../../Context";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import Fetcher from "../../lib/Fetcher";
import HttpInterceptor from "../../lib/HttpsInterceptor";
import { v4 as uuid } from "uuid";
import CatchError from "../../lib/CatchError";
import Card from "../shared/Card";
import moment from "moment";

interface messageRecievedInterface extends AttachmentUIInterface {
  from: string;
  message: string;
}

interface AttachmentUIInterface {
  file: { path: string; type: string };
}

const AttachmentUI: FC<AttachmentUIInterface> = ({ file }) => {
  if (file.type.startsWith("video/")) {
    return <video className="w-full" controls src={file.path}></video>;
  }

  if (file.type.startsWith("image/")) {
    return <img className="w-full" src={file.path} />;
  }

  return (
    <Card>
      <i className="ri-file-line text-5xl"></i>
    </Card>
  );
};

const Chat = () => {
  const chatContainer = useRef<HTMLDivElement | null>(null);

  const [chats, setChats] = useState<any>([]);
  const { session } = useContext(Context);
  const { id } = useParams();
  const { data } = useSWR(id ? `/chat/${id}` : null, id ? Fetcher : null);
  console.log(chats);

  const messageHandler = (messageRecieved: messageRecievedInterface) => {
    setChats((prev: any) => [...prev, messageRecieved]);
  };

  const attachmentHandler = (messageRecieved: messageRecievedInterface) => {
    setChats((prev: any) => [...prev, messageRecieved]);
  };

  //listening recieved messages
  useEffect(() => {
    socket.on("message", messageHandler);
    socket.on("attachment", attachmentHandler);

    return () => {
      socket.off("message", messageHandler);
      socket.off("attachment", attachmentHandler);
    };
  }, []);

  //setting old chats
  useEffect(() => {
    if (data) {
      setChats(data);
    }
  }, [data]);

  //setup scrollbar position
  useEffect(() => {
    const chatDiv = chatContainer.current;
    if (chatDiv) {
      chatDiv.scrollTop = chatDiv.scrollHeight;
    }
  }, [chats]);

  const sendMessage = (values: any) => {
    const payload = {
      from: session,
      to: id,
      message: values.message,
    };

    setChats((prev: any) => [...prev, payload]);
    socket.emit("message", payload);
  };

  const fileSharing = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const input = e.target;
      if (!input.files) {
        return;
      }
      const file = input.files[0];
      const url = URL.createObjectURL(file);
      const ext = file.name.split(".").pop();
      const filename = `${uuid()}.${ext}`;
      const path = `chats/${filename}`;

      const payload = {
        path,
        type: file.type,
        status: "private",
      };

      const options = {
        headers: { "Content-Type": file.type },
      };

      const { data } = await HttpInterceptor.post("/storage/upload", payload);
      await HttpInterceptor.put(data.url, file, options);

      const localMetadata = {
        file: {
          path: url,
          type: file.type,
        },
      };

      const remoteMetadata = {
        file: {
          path: path,
          type: file.type,
        },
      };

      const attachmentPayload = {
        from: session,
        to: id,
        message: filename,
      };

      setChats((prev: any) => [
        ...prev,
        { ...attachmentPayload, ...localMetadata },
      ]);
      socket.emit("attachment", { ...attachmentPayload, ...remoteMetadata });
    } catch (error) {
      CatchError(error.message);
    }
  };

  const download = async (filename: string) => {
    try {
      const path = `chats/${filename}`;

      const { data } = await HttpInterceptor.post("/storage/download", {
        path,
      });

      const a = document.createElement("a");
      a.href = data.url;
      a.download = filename;
      a.click();
    } catch (error) {
      CatchError(error);
    }
  };

  return (
    <div>
      <div className="h-140 overflow-auto space-y-8" ref={chatContainer}>
        {chats.map((item: any, index: number) => (
          <div key={index} className="space-y-8">
            {item.from.id === session.id || item.from._id === session.id ? (
              <div className="flex gap-4 items-start">
                <Avatar
                  image={session.image || "/images/avtar.jpg"}
                  size="md"
                />
                <div className="relative flex-1 bg-rose-50 p-2 rounded-xl text-slate-700 border border-rose-100">
                  <h2 className="font-bold capitalize">You</h2>
                  {item.file && <AttachmentUI file={item.file} />}
                  <label>{item.message}</label>
                  {item.file && (
                    <div>
                      <Button
                        icon="download-line"
                        type="smSecondary"
                        onClick={() => download(item.message)}
                      >
                        Download
                      </Button>
                    </div>
                  )}
                  <div className="text-gray-500 text-right text-sm">
                    {moment().format("MMM DD, YYYY hh:mm:ss A")}
                  </div>
                  <i className="ri-arrow-left-s-fill text-rose-50 text-4xl absolute -top-1 -left-5"></i>
                </div>
              </div>
            ) : (
              <div className="flex gap-4 items-start">
                <div className="relative flex-1 flex flex-col gap-4 bg-violet-50 p-2 rounded-xl text-slate-700 border border-violet-100">
                  <h2 className="font-bold">{item.from.fullname}</h2>
                  {item.file && <AttachmentUI file={item.file} />}
                  <label>{item.message}</label>
                  {item.file && (
                    <div>
                      <Button
                        onClick={() => download(item.message)}
                        icon="download-line"
                        type="smSecondary"
                      >
                        Download
                      </Button>
                    </div>
                  )}
                  <div className="text-gray-500 text-right text-sm">
                    {moment().format("MMM DD, YYYY hh:mm:ss A")}
                  </div>
                  <i className="ri-arrow-right-s-fill text-violet-50 text-4xl absolute -top-1 -right-5"></i>
                </div>
                <Avatar
                  image={item.from.image || "/images/default.png"}
                  size="md"
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="p-3">
        <div className="flex items-center gap-4">
          <Form
            onValue={sendMessage}
            className="flex gap-4 flex-1"
            reset={true}
          >
            <Input name="message" placeholder="Enter message..." />
            <Button icon="arrow-right-double-line" type="secondary">
              Send
            </Button>
          </Form>
          <button className="relative h-11 w-11 rounded-full bg-indigo-50 hover:bg-indigo-100 hover:text-slate-800">
            <i className="ri-attachment-2"></i>
            <input
              onChange={fileSharing}
              type="file"
              className="bg-red-500 h-full w-full absolute top-0 left-0 rounded-full opacity-0"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
