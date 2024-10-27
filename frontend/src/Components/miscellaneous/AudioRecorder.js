
import React from "react";
import { ReactMediaRecorder } from "react-media-recorder";
import { IconButton } from "@chakra-ui/react";
import { PhoneIcon } from "@chakra-ui/icons";
import cloudinary from "cloudinary-core";

const AudioRecorder = () => {
  const sendRecordedAudio = async (audio) => {
    const data = new FormData();
    data.append("file", audio);
    data.append("upload_preset", "chat-app"); // Replace with your actual upload preset name
    data.append("cloud_name", "daspplhqg"); // Replace with your actual cloud name

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/daspplhqg/video/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const responseData = await response.json();
      console.log(responseData);
    } catch (error) {
      console.error(error);
    }
    // const sendRecordedAudio = async (audio) => {
    //   const cloudinaryCore = new cloudinary.Cloudinary({
    //     cloud_name: "daspplhqg",
    //   });
    //   const data = new FormData();
    //   data.append("file", audio);
    //   data.append("upload_preset", "chat-app1");
    //   data.append("cloud_name", "daspplhqg");
    //   fetch("https://api.cloudinary.com/v1_1/daspplhqg/video/upload", {
    //     method: "post",
    //     body: audio,
    //   })
    //     .then((res) => res.json())
    //     .then((data) => {
    //       // setPic(data.url.toString());
    //       // setLoading(false);
    //       console.log(data);
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //       // setLoading(false);
    //     });
    // const config = {
    //   headers: {
    //     "Content-Type": "multipart/form-data",
    //   },
    // };
    // axios.post("/api/message/audio", formData, config).then((res) => {
    //   console.log(res);
    // });
  };
  const handleDownload = (blobUrl) => {
    const anchor = document.createElement("a");
    anchor.href = blobUrl;
    anchor.download = "recorded_audio.wav";
    anchor.click();
  };
  return (
    <div>
      <ReactMediaRecorder
        audio
        render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
          <div>
            {<p>{status}</p>}
            <button
              onClick={() => {
                startRecording();
                console.log("started");
              }}
            >
              <IconButton display={{ base: "flex" }} icon={<PhoneIcon />} />
            </button>
            <button
              onClick={() => {
                stopRecording();
                console.log(mediaBlobUrl);
                sendRecordedAudio(mediaBlobUrl);

                console.log("stopped");
              }}
            >
              <IconButton display={{ base: "flex" }} icon={<PhoneIcon />} />
            </button>
            {<audio src={mediaBlobUrl} controls autoPlay />}
            {/* <p>{mediaBlobUrl}</p> */}
            {mediaBlobUrl && (
              <a href={mediaBlobUrl} download="recorded_audio.wav">
                Download Recorded Audio
              </a>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default AudioRecorder;
