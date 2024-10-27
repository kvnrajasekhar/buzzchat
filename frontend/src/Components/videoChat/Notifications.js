/* eslint-disable no-unused-vars */
import React from "react";
import { Button } from "@chakra-ui/react";

import { useContext } from "react";
import { SocketContext } from "../SocketContext";
const Notifications = () => {
  const { answerCall, call, callAccepted } = useContext(SocketContext);
  return (
    <div>
      {call.isReceivedCall && !callAccepted && (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <h1>{call.name} is calling:</h1>
          <Button colorScheme="blue" variant="solid" onClick={answerCall}>
            Answer
          </Button>
        </div>
      )}
    </div>
  );
};

export default Notifications;
