
import React from "react";
import { Tooltip, useDisclosure } from "@chakra-ui/react";
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
// import Lorem from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { Image, Text } from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import UpdatePassword from "../Authentication/UpdatePassword";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  // console.log(user);
  // const initialRef = React.useRef(null);
  // const finalRef = React.useRef(null);
  const { darkMode } = ChatState();
  return (
    <span>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <Tooltip label="Click to view profile" hasArrow placement="bottom-end">
          <IconButton
            display={{ base: "flex", md: "flex" }}
            icon={<ViewIcon />}
            onClick={onOpen}
          ></IconButton>
        </Tooltip>
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
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            {user.pic ? (
              <Image
                borderRadius="full"
                boxSize="150px"
                src={user.pic}
                alt={user.name}
              />
            ) : (
              <></>
            )}
            <Text>
              <b>Email: </b>
              <span>{user.email}</span>
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </span>
  );
};

export default ProfileModal;
