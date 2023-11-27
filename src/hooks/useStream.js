import { useEffect, useRef, useState } from "react";

export const useStream = () => {
  const videoRef = useRef();
  const [mic, setMic] = useState(true);
  const [camera, setCamera] = useState(true);

  /**@returns {HTMLVideoElement}*/
  const getVideoElement = () => videoRef.current;

  /**@param {MediaStream} stream */
  const startStream = (stream) => {
    if (!stream) return;
    const videoElement = getVideoElement();
    videoElement.srcObject = stream;
    videoElement.play();
  };

  /**@returns {MediaStream} */
  const getStream = () => {
    const videoElement = getVideoElement();
    if (!videoElement) return;
    return videoElement.srcObject;
  };

  const toggleMic = () => {
    const stream = getStream();
    stream
      .getAudioTracks()
      .forEach((track) => (track.enabled = !track.enabled));
    setMic((prev) => !prev);
  };
  const toggleCamera = () => {
    const stream = getStream();
    stream
      .getVideoTracks()
      .forEach((track) => (track.enabled = !track.enabled));
    setCamera((prev) => !prev);
  };

  const stopStream = () => {
    const stream = getStream();
    stream?.getTracks().forEach((track) => track.stop());
    setCamera(true);
    setMic(true);
  };

  useEffect(() => {
    return () => {
      stopStream();
    };
  }, []);

  return {
    ref: videoRef,
    getVideoElement,
    startStream,
    getStream,
    stopStream,
    toggleMic,
    toggleCamera,
    mic,
    camera,
  };
};
