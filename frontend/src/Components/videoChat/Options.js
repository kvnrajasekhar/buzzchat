
import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
// import { Button, Grid, Typography } from "@material-ui/core";
// import { Assignment, Phone, PhoneDisabled } from "@material-ui/icons";
// import { makeStyles } from "@material-ui/core/styles";
import { useContext } from "react";
import { SocketContext } from "../SocketContext";
// import { TextField } from "@material-ui/core";
import {
  Grid,
  GridItem,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";
import { useState } from "react";
import { IconButton } from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";

const Options = ({ children }) => {
  const { me, callAccepted, callEnded, name, setName, leaveCall, callUser } =
    useContext(SocketContext);
  const [idToCall, setIdToCall] = useState("");

  return (
    <div>
      <Box
        style={{
          border: "solid black 2px",
          padding: "5px",
          borderRadius: "5px",
        }}
      >
        <form noValidate autoComplete="off">
          <Grid>
            <GridItem xs={12} md={6} display="flex" flexDirection="column">
              <h6>Make a Call</h6>
              <Input
                placeholder="ID to call"
                value={idToCall}
                onChange={(e) => {
                  setIdToCall(e.target.value);
                }}
              />

              {callAccepted && !callEnded ? (
                <Button
                  colorScheme="red"
                  onClick={() => {
                    leaveCall();
                  }}
                  marginTop="5px"
                >
                  Hang Up
                </Button>
              ) : (
                <Button
                  colorScheme="blue"
                  onClick={() => {
                    callUser(idToCall);
                  }}
                  marginTop="5px"
                >
                  Call
                </Button>
              )}
              <CopyToClipboard text={me} style={{ padding: "5px" }}>
                <IconButton
                  colorScheme="blue"
                  aria-label="Search database"
                  icon={
                    <>
                      <CopyIcon /> Copy Your ID
                    </>
                  }
                  marginTop="5px"
                ></IconButton>
              </CopyToClipboard>
            </GridItem>
          </Grid>
        </form>
        {children}
      </Box>
    </div>
  );
};

export default Options;
