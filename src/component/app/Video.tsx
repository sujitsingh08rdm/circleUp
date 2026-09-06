import { useContext, useEffect, useRef, useState } from "react";
import CatchError from "../../lib/CatchError";
import Button from "../shared/Button";
import Context from "../../Context";
import { toast } from "react-toastify";
import socket from "../../lib/socket";
import { useNavigate, useParams } from "react-router-dom";
import { Modal, notification } from "antd";
import HttpInterceptor from "../../lib/HttpsInterceptor";

//ice server (interective connection endpoint) specialized configuration endpoints used in WebRTC to help devices find the best path to connect to each other, especially when hidden behind firewalls or NAT (Network Address Translation) routers.
// stun :session traversal utility for NAT(network address translation) : Discovers your device's public IP address and port so a peer knows where to send data

const config = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

type CallType = "pending" | "calling" | "incoming" | "talking" | "end";
export interface onOfferInterface {
  offer: RTCSessionDescriptionInit;
  from: any;
}

type AudioSrcType =
  | "/sounds/call.mp3"
  | "/sounds/ring.mp3"
  | "/sounds/reject.mp3";

interface onAnswerInterface {
  answer: RTCSessionDescriptionInit;
  from: string;
}

interface onCandidateInterface {
  candidate: RTCIceCandidateInit;
  from: string;
}

function getCallTiming(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

const Video = () => {
  const navigate = useNavigate();
  const { session, liveActiveSession, sdp, setSdp } = useContext(Context);
  const { id } = useParams();
  const [notify, notifyUi] = notification.useNotification();
  const [open, setOpen] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const localVideoContainerRef = useRef<HTMLDivElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoContainerRef = useRef<HTMLDivElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const webRtcRef = useRef<RTCPeerConnection | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isVideoSharing, setIsVideoSharing] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [status, setStatus] = useState<CallType>("pending");
  const [timer, setTimer] = useState(0);

  const stopAudio = () => {
    if (!audioRef.current) {
      return;
    }
    const player = audioRef.current;
    player.pause();
    player.currentTime = 0;
  };

  const playAudio = (src: AudioSrcType, loop: boolean = false) => {
    stopAudio();

    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const player = audioRef.current;
    player.src = src;
    player.loop = loop;
    player.load();
    player.play();
  };

  const toggleScreen = async () => {
    try {
      const localVideo = localVideoRef.current;
      if (!localVideo) {
        return;
      }

      if (!isScreenSharing) {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });

        const screenShareTrack = stream.getVideoTracks()[0];
        const senderVideoTrack = webRtcRef.current
          ?.getSenders()
          .find((s) => s.track?.kind === "video");

        if (screenShareTrack && senderVideoTrack) {
          await senderVideoTrack.replaceTrack(screenShareTrack);
        }

        localVideo.srcObject = stream;
        localStreamRef.current = stream;
        setIsScreenSharing(true);

        // detect screen sharing off
        screenShareTrack.onended = async () => {
          setIsScreenSharing(false);
          const videoCamStream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          const videoTrack = videoCamStream.getVideoTracks()[0];
          const senderTrack = webRtcRef.current
            ?.getSenders()
            .find((s) => s.track?.kind === "video");

          if (videoTrack && senderTrack) {
            await senderTrack.replaceTrack(videoTrack);
          }
          localVideo.srcObject = videoCamStream;
          localStreamRef.current = videoCamStream;
          setIsVideoSharing(true);
        };
      } else {
        const localStream = localStreamRef.current;
        if (!localStream) {
          return;
        }
        localStream.getTracks().forEach((track) => {
          track.stop();
        });
        localVideo.srcObject = null;
        localStreamRef.current = null;

        setIsScreenSharing(false);
        setIsMuted(false);
      }
    } catch (error) {
      CatchError(error.message);
    }
  };

  const toggleVideo = async () => {
    try {
      const localVideo = localVideoRef.current;

      if (!localVideo) {
        return;
      }

      if (!isVideoSharing) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        localVideo.srcObject = stream;
        localStreamRef.current = stream;
        setIsVideoSharing(true);
        setIsMuted(false);
      } else {
        const localStream = localStreamRef.current;
        if (!localStream) {
          return;
        }

        localStream.getTracks().forEach((track) => track.stop());
        localVideo.srcObject = null;
        localStreamRef.current = null;
        setIsVideoSharing(false);
        setIsMuted(false);
      }
    } catch (error) {
      CatchError(error);
    }
  };

  const toggleMic = () => {
    try {
      const localStream = localStreamRef.current;
      if (!localStream) {
        return;
      }
      const audioTrack = localStream
        .getTracks()
        .find((tracks) => tracks.kind === "audio");

      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    } catch (error) {
      CatchError(error);
    }
  };

  const toggleFullScreen = (type: "local" | "remote") => {
    try {
      if (!isScreenSharing && !isVideoSharing) {
        return toast.warn("You're not streaming");
      }

      const videoContainer =
        type === "local"
          ? localVideoContainerRef.current
          : remoteVideoContainerRef.current;

      if (!videoContainer) {
        return;
      }

      if (!document.fullscreenElement) {
        videoContainer.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    } catch (error) {
      CatchError(error.message);
    }
  };

  const webRtcConnection = async () => {
    // const { data } = await HttpInterceptor("/twilio/turn-server");
    // init a instance of RTC peer connection with stun server
    webRtcRef.current = new RTCPeerConnection(config);
    // webRtcRef.current = new RTCPeerConnection({ iceServers: data });

    const localStream = localStreamRef.current;
    if (!localStream) {
      return;
    }

    //setting the current track to webrtc
    localStream.getTracks().forEach((track) => {
      webRtcRef.current?.addTrack(track, localStream);
    });
    // give information about connected users information like poert public ip.
    webRtcRef.current.onicecandidate = (e) => {
      console.log("e.candidate");
      if (e.candidate) {
        socket.emit("candidate", { candidate: e.candidate, to: id });
      }
    };
    //onconnection change give information about connection where it coneced or not or connection failed.
    webRtcRef.current.onconnectionstatechange = () => {
      console.log(webRtcRef.current?.connectionState);
    };

    //this is will give information coming from other or remote user
    webRtcRef.current.ontrack = (e) => {
      const remoteStream = e.streams[0];
      const remoteVideo = remoteVideoRef.current;

      if (!remoteVideo) {
        return;
      }
      remoteVideo.srcObject = remoteStream;
      const videoTracks = remoteStream.getVideoTracks()[0];
      if (videoTracks) {
        videoTracks.onmute = () => {
          console.log("video off from remote side");
          remoteVideo.style.display = "none";
        };

        videoTracks.onunmute = () => {
          console.log("video on from remote side");
          remoteVideo.style.display = "block";
        };

        videoTracks.onended = () => {
          console.log("video ended from remote side");
          remoteVideo.style.display = "none";
          remoteVideo.srcObject = null;
        };
      }
    };

    //setting the current track to webrtc
    // localStream.getTracks().forEach((track) => {
    //   webRtcRef.current?.addTrack(track, localStream);
    // });
  };

  const startCall = async () => {
    try {
      if (!isScreenSharing && !isVideoSharing) {
        return toast("Start your streaming first");
      }
      await webRtcConnection();
      if (!webRtcRef.current) {
        return;
      }

      // setting an  offer to other clinet
      const offer = await webRtcRef.current.createOffer();
      // setting in description to accept offer
      await webRtcRef.current.setLocalDescription(offer);
      // signalling -> an way to send the offer to other/remote user , can be done using socket

      playAudio("/sounds/ring.mp3", true);
      setStatus("calling");

      notify.open({
        message: (
          <h2 className="capitalize font-medium">
            {liveActiveSession.fullname}
          </h2>
        ),
        description: "Calling..",
        duration: 30,
        onClose: stopAudio,
        actions: [
          <button
            key="end"
            className="bg-rose-400 px-3 py-1 rounded text-white hover:bg-rose-500"
            onClick={endCall}
          >
            End Call
          </button>,
        ],
        placement: "bottomRight",
      });

      socket.emit("offer", { offer, to: id, from: session });
    } catch (error) {
      CatchError(error);
    }
  };

  const acceptCall = async (payload: onOfferInterface) => {
    try {
      setSdp(null);
      await webRtcConnection();
      if (!webRtcRef.current) {
        return;
      }
      const offer = new RTCSessionDescription(payload.offer);
      await webRtcRef.current.setRemoteDescription(offer);

      const answer = await webRtcRef.current.createAnswer();
      await webRtcRef.current.setLocalDescription(answer);

      notify.destroy();
      setStatus("talking");
      stopAudio();
      socket.emit("answer", { answer, to: id });
    } catch (error) {
      CatchError(error);
    }
  };

  // event listeners
  const onOffer = (payload: onOfferInterface) => {
    setStatus("incoming");

    notify.open({
      message: (
        <h2 className="capitalize font-medium">{payload.from.fullname}</h2>
      ),
      description: "Incoming call..",
      duration: 30,
      actions: [
        <div key="calls" className="space-x-2">
          <button
            onClick={() => acceptCall(payload)}
            className="bg-green-400 px-3 py-1 rounded text-white hover:bg-green-500"
          >
            Accept
          </button>
          <button
            onClick={endCall}
            className="bg-rose-400 px-3 py-1 rounded text-white hover:bg-rose-500"
          >
            End Call
          </button>
        </div>,
      ],
      placement: "bottomRight",
    });
  };

  const onCandidate = async (payload: onCandidateInterface) => {
    try {
      if (!webRtcRef.current) {
        return;
      }
      const candidate = new RTCIceCandidate(payload.candidate);
      await webRtcRef.current.addIceCandidate(candidate);
    } catch (error) {
      CatchError(error);
    }
  };

  const onAnswer = async (payload: onAnswerInterface) => {
    try {
      if (!webRtcRef.current) {
        return;
      }
      const answer = new RTCSessionDescription(payload.answer);
      await webRtcRef.current.setRemoteDescription(answer);
      notify.destroy();
      stopAudio();
      setStatus("talking");
    } catch (error) {
      CatchError(error);
    }
  };

  const endStreaming = () => {
    localStreamRef.current?.getTracks().forEach((track) => track.stop());

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  };

  const onEnd = () => {
    setStatus("end");
    playAudio("/sounds/reject.mp3");
    notify.destroy();
    endStreaming();
    setOpen(true);
  };

  const endCall = () => {
    try {
      setStatus("end");
      playAudio("/sounds/reject.mp3");
      socket.emit("end", { to: id });
      notify.destroy();
      endStreaming();
      setOpen(true);
    } catch (error) {
      CatchError(error);
    }
  };

  useEffect(() => {
    socket.on("offer", onOffer);
    socket.on("candidate", onCandidate);
    socket.on("answer", onAnswer);
    socket.on("end", onEnd);

    return () => {
      socket.off("offer", onOffer);
      socket.off("candidate", onCandidate);
      socket.off("answer", onAnswer);
      socket.off("end", onEnd);
    };
  }, []);

  useEffect(() => {
    let interval: any;

    if (status === "talking") {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [status]);

  useEffect(() => {
    if (!liveActiveSession) {
      endCall();
    }
  }, [liveActiveSession]);

  const redirectOnCallEnd = () => {
    setOpen(false);
    navigate("/app");
  };

  useEffect(() => {
    if (sdp) {
      notify.destroy();
      onOffer(sdp);
    }
  }, [sdp]);

  // useEffect(() => {
  //   let interval: any;
  //   if (status === "pending") {
  //     return;
  //   }

  //   if (!audioRef.current) {
  //     clearInterval(interval);
  //     audioRef.current = new Audio();
  //   }

  //   if (status === "calling" || status === "incoming") {
  //     clearInterval(interval);
  //     audioRef.current.pause();
  //     audioRef.current.src = "/sounds/call.mp3";
  //     audioRef.current.currentTime = 0;
  //     audioRef.current.load();
  //     audioRef.current.play();
  //   }

  //   if (status === "talking") {
  //     clearInterval(interval);
  //     audioRef.current.pause();
  //     audioRef.current.currentTime = 0;
  //     interval = setInterval(() => {
  //       setTimer((prev) => prev + 1);
  //     }, 1000);
  //   }

  //   if (status === "end") {
  //     clearInterval(interval);
  //     audioRef.current.pause();
  //     audioRef.current.src = "/sounds/reject.mp3";
  //     audioRef.current.currentTime = 0;
  //     audioRef.current.load();
  //     audioRef.current.play();
  //     notify.destroy();
  //   }

  //   return () => {
  //     if (audioRef.current) {
  //       audioRef.current.pause();
  //       audioRef.current.currentTime = 0;
  //       audioRef.current = null;
  //     }
  //     clearInterval(interval);
  //   };
  // }, [status]);

  return (
    <div className="space-y-8">
      <div
        ref={remoteVideoContainerRef}
        className="bg-black w-full h-0 relative pb-[56.25%] rounded-xl"
      >
        <video
          ref={remoteVideoRef}
          className="absolute top-0 left-0 w-full h-full"
          autoPlay
          playsInline
        ></video>
        <button className="absolute bottom-5 left-5 text-gray-50 bg-gray-800 opacity-80 rounded text-sm py-1 px-2 hover:text-gray-100">
          Rahul Prasad
        </button>
        <button
          onClick={() => toggleFullScreen("remote")}
          className="absolute bottom-5 right-5 text-gray-50 bg-gray-800 opacity-80 rounded text-sm py-1 px-2 hover:text-gray-200 hover:scale-110"
        >
          <i className="ri-fullscreen-line"></i>
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div
          ref={localVideoContainerRef}
          className="bg-black w-full h-0 relative pb-[56.25%] rounded-xl"
        >
          <video
            ref={localVideoRef}
            className="absolute top-0 left-0 w-full h-full"
            autoPlay
            playsInline
          ></video>
          <button className="absolute capitalize bottom-2 left-2 text-gray-50 bg-gray-800 opacity-80 rounded text-xs py-1 px-2 hover:text-gray-100">
            {session && session.fullname}
          </button>
          <button
            onClick={() => toggleFullScreen("local")}
            className="absolute bottom-2 right-2 text-gray-50 bg-gray-800 opacity-80 rounded text-sm py-.5 px-1 hover:text-gray-200 hover:scale-110"
          >
            <i className="ri-fullscreen-line text-[90%]"></i>
          </button>
        </div>
        <Button type="dark" icon="user-add-line">
          Add
        </Button>
      </div>
      <div className="flex justify-between items-center bg-gray-200 rounded-xl p-4">
        <div className="space-x-4">
          <button
            onClick={toggleMic}
            className={`${isMuted ? "bg-red-50 text-red-500 hover:bg-red-500 hover:text-red-50" : "bg-amber-50 text-amber-500 hover:bg-amber-500 hover:text-amber-50"} h-12 w-12 rounded-full `}
          >
            {isMuted ? (
              <i className="ri-mic-off-line"></i>
            ) : (
              <i className="ri-mic-line"></i>
            )}
          </button>
          <button
            onClick={toggleVideo}
            className={`${isVideoSharing ? "bg-red-50 text-red-500 hover:bg-red-500 hover:text-red-50" : "bg-green-50 text-green-500 hover:bg-green-500 hover:text-green-50"} h-12 w-12 rounded-full  `}
          >
            {isVideoSharing ? (
              <i className="ri-video-off-line"></i>
            ) : (
              <i className="ri-video-on-line"></i>
            )}
          </button>
          {/* <button
            onClick={toggleVideo}
            className="bg-rose-50 h-12 w-12 rounded-full text-rose-500 hover:bg-rose-500 hover:text-rose-50"
          >
            <i className="ri-video-off-line"></i>
          </button> */}
          <button
            onClick={toggleScreen}
            className={`${isScreenSharing ? "bg-red-50 text-red-500 hover:bg-red-500 hover:text-red-50" : "bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-blue-50"} h-12 w-12 rounded-full "`}
          >
            {isScreenSharing ? (
              <i className="ri-tv-2-fill"></i>
            ) : (
              <i className="ri-tv-2-line"></i>
            )}
          </button>
        </div>
        <div className="space-x-4">
          {status === "talking" && <label>{getCallTiming(timer)}</label>}
          {(status === "pending" || status === "end") && (
            <Button icon="phone-line" type="success" onClick={startCall}>
              Call
            </Button>
          )}
          {status === "talking" && (
            <Button icon="close-circle-line" type="danger" onClick={endCall}>
              End
            </Button>
          )}
        </div>
      </div>
      <Modal
        open={open}
        onCancel={redirectOnCallEnd}
        centered
        mask={{ closable: true }}
        footer={null}
      >
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold">Call disconnected</h2>

          <Button onClick={redirectOnCallEnd} type="danger">
            Thank you!
          </Button>
        </div>
      </Modal>
      {notifyUi}
    </div>
  );
};

export default Video;
