/* eslint-disable no-unused-vars */
import React from "react";
import { Input, Button, IconButton, FormControl } from "@chakra-ui/react";
import { RepeatClockIcon } from "@chakra-ui/icons";
import { Tooltip } from "@chakra-ui/tooltip";
import HandleAttachment from "./miscellaneous/HandleAttachment";
import { useDisclosure } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import Lottie from "lottie-react";
import { TimeIcon, ChatIcon, PhoneIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { useEffect } from "react";
import { ChatState } from "../Context/ChatProvider";
import axios from "axios";
import { useToast } from "@chakra-ui/react";

const ScheduleMessage = () => {
  const toast = useToast();
  const submitMessage = async (event) => {
    // event.preventDefault();

    if (event.key === "Enter" && newMessage !== "") {
      {
        // socket && socket.emit("stop typing", selectedChat._id);
      }
      if (newMessage === "") {
        toast({
          title: "Error Occured!",
          description: "Please fill all the details ",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }
      const date1 = new Date(scheduledAt);
      const date2 = new Date();
      if (date1 < date2) {
        toast({
          title: "Error Occured!",
          description: "Schedule date is not valid ",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
            disappearMode: disappearingChat,
            scheduledAt: scheduledAt,
          },
          config
        );
        console.log(data);
        setNewMessage("");
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
    // setNewMessage("");
    // setDate(new Date());
  };
  const {
    user,
    selectedChat,
    setSelectedChat,
    notification,
    setNotification,
    darkMode,
  } = ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scheduledAt, setScheduledAt] = useState(new Date());
  const [newMessage, setNewMessage] = useState("");
  const [socketConnnected, setSocketConnnected] = useState(false);
  const [disappearingChat, setDisappearingChat] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const currentDate = new Date();
  return (
    <>
      <Tooltip label="Schedule Message" hasArrow placement="bottom-end">
        <IconButton icon={<RepeatClockIcon />} onClick={onOpen}></IconButton>
      </Tooltip>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Schedule Message</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Select Date and Time"
              size="md"
              type="datetime-local"
              onChange={(e) => {
                setScheduledAt(e.target.value);
                console.log(setScheduledAt);
              }}
            />
            <FormControl
              onKeyDown={submitMessage}
              isRequired
              mt={3}
              display="flex"
            >
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                }}
              />
              <Tooltip
                label={
                  !disappearingChat
                    ? "Enable disappearing Chats"
                    : "Enable normal Chats"
                }
                hasArrow
                placement="bottom-end"
              >
                <IconButton
                  display={{ base: "flex" }}
                  onClick={() => {
                    setDisappearingChat(!disappearingChat);
                  }}
                  icon={!disappearingChat ? <TimeIcon /> : <ChatIcon />}
                />
              </Tooltip>
              <Tooltip label="Send Attachments">
                <HandleAttachment user={user} />
              </Tooltip>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ScheduleMessage;
