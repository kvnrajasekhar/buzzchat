
import React from "react";
// import { Grid, Typography, Paper } from "@material-ui/core";
import { useContext } from "react";
import { Grid, GridItem } from "@chakra-ui/react";

import { SocketContext } from "../SocketContext";
const VideoPlayer = () => {
  const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } =
    useContext(SocketContext);
  return (
    <Grid
      justifyContent="center"
      display="flex"
      flexDirection="column"
      width="100%"
    >
      {/*  our video */}
      {console.log(stream)}
      {stream && (
        <GridItem xs={12} md={6} backgroundColor="white">
          <h5>{name || "Name"}</h5>
          <video playsInline muted ref={myVideo} autoPlay width="550px" />
        </GridItem>
      )}

      {/*  user video */}
      {callAccepted && !callEnded && (
        <GridItem xs={12} md={6}>
          <h5>{call.name || "Name"}</h5>
          <video playsInline ref={userVideo} autoPlay width="550px" />
        </GridItem>
      )}
    </Grid>
  );
};

export default VideoPlayer;
