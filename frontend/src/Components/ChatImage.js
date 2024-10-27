

import React from "react";
import { Image, Text } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
const ChatImage = ({ user }) => {
  return (
    <>
      {/* {console.log(user)} */}
      <Image
        borderRadius="full"
        boxSize="50px"
        src={user.pic}
        alt={user.name}
      />
    </>
  );
};

export default ChatImage;
