import Card from "../shared/Card";
import Divider from "../shared/Divider";
import IconButton from "../shared/IconButton";

const Posts = () => {
  return (
    <div className="space-y-8">
      {Array(20)
        .fill(0)
        .map((item, index) => (
          <Card
            key={index}
            // divider
            // footer={
            //   <div className="flex justify-between">
            //     <label className="text-base font-normal">
            //       12 Jan 2023, 8:13 PM
            //     </label>
            //     <div className="space-x-2">
            //       <IconButton icon="edit-box-line" type="info" />
            //       <IconButton icon="delete-bin-3-line" type="danger" />
            //     </div>
            //   </div>
            // }
          >
            <div className="space-y-4">
              <div>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam
                fugit beatae eos sed eius sequi qui, molestias inventore magni
                culpa. Voluptatem, aut quidem! Magnam exercitationem sit, itaque
                sapiente architecto aspernatur.
              </div>
              <div className="flex justify-between items-center">
                <label className="text-base font-normal">
                  12 Jan 2023, 8:13 PM
                </label>
                <div className="space-x-2">
                  <IconButton icon="edit-box-line" type="info" />
                  <IconButton icon="delete-bin-3-line" type="danger" />
                </div>
              </div>
              <Divider />
              <div className="space-x-2">
                <IconButton icon="thumb-up-line" type="danger">
                  20K
                </IconButton>
                <IconButton icon="thumb-down-line" type="warning">
                  20K
                </IconButton>
                <IconButton icon="chat-1-line" type="success">
                  5K
                </IconButton>
              </div>{" "}
            </div>
          </Card>
        ))}
    </div>
  );
};

export default Posts;
