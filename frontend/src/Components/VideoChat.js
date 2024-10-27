/* eslint-disable no-unused-vars */
import React from "react";
import { Typography, AppBar } from "@mui/material";
import VideoPlayer from "../Components/videoChat/VideoPlayer";
import Options from "../Components/videoChat/Options";
import Notifications from "../Components/videoChat/Notifications";
import { makeStyles } from "@mui/material/styles";
import { ContextProvider } from "./SocketContext";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  IconButton,
} from "@chakra-ui/react";
import { PhoneIcon } from "@chakra-ui/icons";
import { useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import "./videoChatStyles.css";
import { Box } from "@chakra-ui/react";

const VideoChat = () => {
  return (
    <ContextProvider>
      <Box
        styles={{
          justifyContent: "center",
          textAlign: "center",
          alignItems: "center",
        }}
        width="50%"
        margin="auto"
      >
        <VideoPlayer />
        <Options>
          <Notifications />
        </Options>
      </Box>
    </ContextProvider>
  );
};

export default VideoChat;
