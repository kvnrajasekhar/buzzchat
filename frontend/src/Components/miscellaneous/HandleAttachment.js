
import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { AttachmentIcon } from "@chakra-ui/icons";
import { useToast } from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import { useHistory } from "react-router-dom";
import axios from "axios";

const HandleAttachment = () => {
  const [pic, setPic] = useState("");
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const { selectedChat } = ChatState();
  // console.log(selectedChat);
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
    // pics.type === "image/jpeg" ||
    // pics.type === "image/png" ||
    // pics.type === "image/jpg"
    console.log(pics);
    if (1) {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "daspplhqg");
      fetch("https://api.cloudinary.com/v1_1/daspplhqg/auto/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(pic);
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

  const Updateing = (e, onClose) => {
    onClose();
    e.preventDefault();
    console.log(pic);
    setLoading(true);
    const timeout = setTimeout(() => {
      axios
        .post(
          `/api/message/`,
          {
            image: pic,
            chatId: selectedChat._id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${
                JSON.parse(localStorage.getItem("userInfo")).token
              }`,
            },
          }
        )
        .then((res) => {
          setLoading(false);
          toast({
            title: "Image Sent",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          localStorage.setItem(
            "userInfo",
            JSON.stringify({
              ...JSON.parse(localStorage.getItem("userInfo")),
              image: pic,
            })
          );
          console.log(res);
          onClose();
        })
        .catch((err) => {
          setLoading(false);
          toast({
            title: "Not able to send Image",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          console.log(err);
        });
    }, 3000);
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = React.useRef(null);
  return (
    <div>
      <Tooltip label="Add Attachments" hasArrow placement="bottom-end">
        <IconButton icon={<AttachmentIcon />} onClick={onOpen}></IconButton>
      </Tooltip>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Attachments</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl style={{ marginBottom: "5px" }} id="pic">
              <Input
                type="file"
                // accept="image/*"
                p={1}
                placeholder="Enter Your Name Here"
                onChange={(ev) => {
                  console.log("chanegd ");
                  postDetails(ev.target.files[0]);
                }}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={(e) => {
                Updateing(e, onClose);
              }}
            >
              Upload
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

export default HandleAttachment;
