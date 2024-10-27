
import React from "react";
import { useDisclosure } from "@chakra-ui/react";
import { IconButton } from "@chakra-ui/button";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { VStack } from "@chakra-ui/layout";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { useState } from "react";
// import Lorem from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { Image, Text } from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import axios from "axios";

const UpdateProfile = ({ user, children }) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState(user.name);
  const [pic, setPic] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { darkMode } = ChatState();

  const logoutHandler = (e) => {
    e.preventDefault();
    localStorage.removeItem("userInfo");
    history.push("/");
  };
  // const { user } = ChatState();
  const Updateing = (e) => {
    e.preventDefault();
    setLoading(true);
    const timeout = setTimeout(() => {
      // setShowMessage(true);

      axios
        .put(
          `/api/user/` + user._id,
          {
            name: name,
            pic: pic,
          },
          {
            headers: {
              Authorization: `Bearer ${
                JSON.parse(localStorage.getItem("userInfo")).token
              }`,
            },
          }
        )
        .then((res) => {
          setLoading(false);
          toast({
            title: "Profile Updated",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          localStorage.setItem(
            "userInfo",
            JSON.stringify({
              ...JSON.parse(localStorage.getItem("userInfo")),
              name: name,
              pic: pic,
            })
          );
          console.log(res);
          logoutHandler(e);
          onClose();
        })
        .catch((err) => {
          setLoading(false);
          toast({
            title: "Profile Not Updated",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          console.log(err);
        });
    }, 3000);
  };
  const postDetails = (pics) => {
    setLoading(true);
    console.log("in post details");
    if (pics === undefined) {
      toast({
        title: "Please Select An Image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (
      pics.type === "image/jpeg" ||
      pics.type === "image/png" ||
      pics.type === "image/jpg"
    ) {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "daspplhqg");
      fetch("https://api.cloudinary.com/v1_1/daspplhqg/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setLoading(false);
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please Select An Image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  return (
    <div>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex", md: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
        ></IconButton>
      )}
      <Modal sz="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          bg={!darkMode ? "white" : "#1A202C"}
          color={darkMode ? "white" : "#1A202C"}
        >
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            Update Profile
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <VStack spacing="5px">
              <FormControl id="first-name" style={{ marginBottom: "5px" }}>
                <FormLabel>Name</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter Your Name Here"
                  onChange={(ev) => {
                    setName(ev.target.value);
                  }}
                  value={name}
                />
              </FormControl>
              <FormControl
                style={{ marginBottom: "5px" }}
                id="email"
                isRequired
              >
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  placeholder="Enter Your Email Here"
                  value={user.email}
                  disabled
                  // value={email}
                />
              </FormControl>
              <FormControl style={{ marginBottom: "5px" }} id="pic">
                <FormLabel>Profile Pic</FormLabel>
                <Input
                  type="file"
                  accept="image/*"
                  p={1}
                  placeholder="Enter Your Name Here"
                  onChange={(ev) => {
                    console.log("chanegd ");
                    postDetails(ev.target.files[0]);
                  }}
                />
              </FormControl>
              <span style={{ color: "red" }}>
                Note: You will be logged out on updating your profile
              </span>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={Updateing}
              isLoading={loading}
            >
              Update
            </Button>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UpdateProfile;
