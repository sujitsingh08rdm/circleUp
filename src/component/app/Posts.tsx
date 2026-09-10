const env = import.meta.env;
import { useState } from "react";
import Card from "../shared/Card";
import AntCard from "antd/es/card/Card";
import Divider from "../shared/Divider";
import Editor from "../shared/Editor";
import IconButton from "../shared/IconButton";
import Button from "../shared/Button";
import HttpInterceptor from "../../lib/HttpsInterceptor";
import { v4 as uuid } from "uuid";
import { message, Skeleton } from "antd";
import CatchError from "../../lib/CatchError";
import moment from "moment";
import useSWR, { mutate } from "swr";
import Fetcher from "../../lib/Fetcher";

interface fileDataInterface {
  url: string;
  file: File;
}

const Posts = () => {
  const { data, error, isLoading } = useSWR("/post", Fetcher);

  const [value, setValue] = useState("");
  const [fileData, setFileData] = useState<fileDataInterface | null>(null);

  const attachFile = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,video/*";
    input.click();

    input.onchange = () => {
      if (!input.files) {
        return;
      }
      const file = input.files[0];
      input.remove();
      const url = URL.createObjectURL(file);
      setFileData({ url, file });
    };
  };

  const createPost = async () => {
    let path = null;
    try {
      if (fileData) {
        const ext = fileData.file.name.split(".").pop();
        const filename = `${uuid()}.${ext}`;
        path = `posts/${filename}`;
        const payload = {
          path: path,
          status: "public-read",
          type: fileData.file.type,
        };

        const options = {
          headers: {
            "Content-Type": fileData.file.type,
          },
        };

        const { data } = await HttpInterceptor.post("/storage/upload", payload);

        await HttpInterceptor.put(data.url, fileData.file, options);
      }

      const formData = {
        attachment: path,
        type: path ? fileData?.file.type : null,
        content: value,
      };

      await HttpInterceptor.post("/post", formData);
      message.success("Post created successfullly");
      mutate("/post");
      setFileData(null);
      setValue("");
    } catch (error) {
      CatchError(error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-8">
        {value.length === 0 && (
          <h2 className="text-lg font-medium">Write your post here..</h2>
        )}

        {value.length > 0 && (
          <AntCard>
            <div className="space-y-4">
              {fileData && fileData.file.type.startsWith("image/") && (
                <img
                  className="rounded-lg object-cover w-full"
                  src={fileData.url}
                />
              )}
              {fileData && fileData.file.type.startsWith("video/") && (
                <video
                  className="rounded-lg object-cover w-full"
                  src={fileData.url}
                  controls
                />
              )}
              <div
                dangerouslySetInnerHTML={{ __html: value }}
                className="hard-reset"
              />
            </div>
            <label className="text-gray-600">
              {moment().format("MMM DD, hh:mm A")}
            </label>
          </AntCard>
        )}
        <Editor value={value} onChange={setValue} />
        <div className="space-x-4">
          <Button type="warning" icon="attachment-line" onClick={attachFile}>
            Attach
          </Button>
          {fileData && (
            <Button
              type="danger"
              icon="loop-right-line"
              onClick={() => setFileData(null)}
            >
              Reset
            </Button>
          )}
          <Button type="secondary" icon="upload-line" onClick={createPost}>
            Post
          </Button>
        </div>
      </div>
      {isLoading && <Skeleton active={true} />}

      {data &&
        data.map((item: any, index: number) => (
          <Card key={index}>
            <div className="space-y-4">
              {item.attachment && item.type.startsWith("image/") && (
                <img
                  className="rounded-lg object-cover w-full"
                  src={`${env.VITE_S3_URL}/${item.attachment}`}
                />
              )}
              {item.attachment && item.type.startsWith("video/") && (
                <video
                  className="rounded-lg object-cover w-full"
                  src={`${env.VITE_S3_URL}/${item.attachment}`}
                  controls
                />
              )}

              <div
                dangerouslySetInnerHTML={{ __html: item.content }}
                className="hard-reset"
              />

              <div className="flex justify-between items-center">
                <label className="text-base font-normal">
                  {moment(item.createdAt).format("MMM DD YYYY, hh:mm A")}
                </label>
                {/* <div className="space-x-2">
                  <IconButton icon="edit-box-line" type="info" />
                  <IconButton icon="delete-bin-3-line" type="danger" />
                </div> */}
              </div>
              <Divider />
              <div className="space-x-2">
                <IconButton icon="thumb-up-line" type="danger">
                  {item.like || 0}
                </IconButton>
                <IconButton icon="thumb-down-line" type="warning">
                  {item.dislike || 0}
                </IconButton>
                <IconButton icon="chat-1-line" type="success">
                  {item.comment || 0}
                </IconButton>
              </div>
            </div>
          </Card>
        ))}
    </div>
  );
};

export default Posts;
