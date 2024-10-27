
import React from "react";
import { ChatState } from "../Context/ChatProvider";
import { useState, useEffect } from "react";
import { DownloadIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { Tooltip } from "@chakra-ui/tooltip";

const DownloadChat = () => {
  const toast = useToast();
  const [messages, setMessages] = useState([]);
  const { selectedChat, user } = ChatState();
  const downloadChats = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      // console.log(messages);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to fetch the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      console.log(error);
    }
    const formattedChatData = messages.map(
      (chat) => ` ${chat.sender.name}: ${chat.content}`
    );
    const blob = new Blob([formattedChatData.join("\n")], {
      type: "text/plain",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "chats.txt";
    a.click();
  };
  return (
    <span>
      <Tooltip
        label="Download chats as text file"
        hasArrow
        placement="bottom-end"
      >
        <IconButton
          onClick={downloadChats}
          display={{ base: "flex" }}
          icon={<DownloadIcon />}
        />
      </Tooltip>
    </span>
  );
};

export default DownloadChat;
