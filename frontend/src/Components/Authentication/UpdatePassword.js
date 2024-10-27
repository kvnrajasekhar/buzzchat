
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
import { Input, InputGroup } from "@chakra-ui/input";
import { useState } from "react";
import { Button } from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/ChatProvider";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import axios from "axios";

const UpdatePassword = ({ user, children }) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [olShow, setolShow] = useState(false);
  const [newShow, setNewshow] = useState(false);
  const [cnfShow, setCnfShow] = useState(false);
  const [oldPassword, setOldPassword] = useState(user.oldPassword);
  const [newPassword, setNewPassword] = useState(user.newPassword);
  const [confirmPassword, setConfirmPassword] = useState(user.confirmPassword);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { darkMode } = ChatState();

  const logoutHandler = (e) => {
    e.preventDefault();
    localStorage.removeItem("userInfo");
    history.push("/");
  };
  const Updateing = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({
        title: "Confrim Password do not match",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    setLoading(true);
    const timeout = setTimeout(() => {
      axios
        .put(
          `/api/user/` + user._id + `/updatepassword`,
          {
            oldPassword: oldPassword,
            newPassword: newPassword,
            confirmPassword: confirmPassword,
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
            title: "Password Updated",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          localStorage.setItem(
            "userInfo",
            JSON.stringify({
              password: newPassword,
            })
          );
          console.log(res);
          logoutHandler(e);
          onClose();
        })
        .catch((err) => {
          setLoading(false);
          toast({
            title: "Password Not Updated",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          console.log(err);
        });
    }, 3000);
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
            Update Password
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <VStack spacing="5px">
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
              <FormControl
                style={{ marginBottom: "5px" }}
                id="oldPassword"
                isRequired
              >
                <FormLabel>Old Password</FormLabel>
                <InputGroup>
                  <Input
                    type={olShow ? "text" : "password"}
                    placeholder="Enter your old password"
                    onChange={(ev) => {
                      setOldPassword(ev.target.value);
                    }}
                    value={oldPassword}
                  />
                  <Button
                    h="1.75rem"
                    size="sm"
                    bgColor={"white"}
                    m={"1"}
                    onClick={() => {
                      setolShow(!olShow);
                    }}
                  >
                    {olShow ? "Hide" : "Show"}
                  </Button>
                </InputGroup>
              </FormControl>
              <FormControl
                style={{ marginBottom: "5px" }}
                id="newPassword"
                isRequired
              >
                <FormLabel>New Password</FormLabel>
                <InputGroup>
                  <Input
                    type={newShow ? "text" : "password"}
                    placeholder="Enter your new password"
                    onChange={(ev) => {
                      setNewPassword(ev.target.value);
                    }}
                    value={newPassword}
                  />
                  <Button
                    h="1.75rem"
                    size="sm"
                    bgColor={"white"}
                    m={"1"}
                    onClick={() => {
                      setNewshow(!newShow);
                    }}
                  >
                    {newShow ? "Hide" : "Show"}
                  </Button>
                </InputGroup>
              </FormControl>
              <FormControl
                style={{ marginBottom: "5px" }}
                id="confirmPassword"
                isRequired
              >
                <FormLabel>Confirm New Password</FormLabel>
                <InputGroup>
                  <Input
                    type={cnfShow ? "text" : "password"}
                    placeholder="Confirm new password"
                    onChange={(ev) => {
                      setConfirmPassword(ev.target.value);
                    }}
                    value={confirmPassword}
                  />
                  <Button
                    h="1.75rem"
                    size="sm"
                    bgColor={"white"}
                    m={"1"}
                    onClick={() => {
                      setCnfShow(!cnfShow);
                    }}
                  >
                    {cnfShow ? "Hide" : "Show"}
                  </Button>
                </InputGroup>
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

export default UpdatePassword;
