import { useRazorpay, type RazorpayOrderOptions } from "react-razorpay";
import Button from "./shared/Button";
import CatchError from "../lib/CatchError";
import HttpInterceptor from "../lib/HttpsInterceptor";
const env = import.meta.env;

const Home = () => {
  const { Razorpay } = useRazorpay();

  const pay = async () => {
    try {
      const { data } = await HttpInterceptor.post("/payment/order", {
        amount: 500,
      });

      const options: RazorpayOrderOptions = {
        key: env.VITE_RAZORPAY_KEY_ID,
        name: "Sujit Bhai",
        description: "Emitter",
        image:
          "https://www.codingott.com/_next/image?url=%2Fimages%2Flogo-new.png&w=64&q=75&dpl=dpl_5C2vyK4m7T5FczTUaRMYY7mTKVmq",
        amount: data.amount,
        currency: env.VITE_CURRENCY,
        order_id: data.id,
        handler: (data) => {
          //will on on payment success
          console.log(data);
        },
      };
      const rzp = new Razorpay(options);
      rzp.open();
      //will on on payment failure , we wont write any payment verification on client side, since let ssay during payment if internet goes down, it could cause in verification failure so better write in serve side with webhooks
      rzp.on("payment.failed", (data) => {
        console.log("payment failed");
      });
    } catch (error) {
      CatchError(error);
    }
  };

  return <Button onClick={pay}>Pay Now</Button>;
};

export default Home;
