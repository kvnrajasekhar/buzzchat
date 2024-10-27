/* eslint-disable no-unused-vars */
import React from "react";
import { Spinner, Tooltip } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Button } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import icon from "./searchIcon.png";
import {
  SearchIcon,
  BellIcon,
  ChevronDownIcon,
  MoonIcon,
  SunIcon,
} from "@chakra-ui/icons";
import { Avatar, AvatarBadge, AvatarGroup } from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import { getSender } from "../../config/ChatLogics";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from "@chakra-ui/react";
import ProfileModal from "./ProfileModal";
import { useHistory } from "react-router-dom";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import ChatLoading from "../ChatLoading";
// import { accessChat } from "../../../../backend/controllers/chatControllers";
import UserListItem from "../UserAvatar/UserListItem";
import { set } from "mongoose";
import UpdateProfile from "../Authentication/UpdateProfile";
import UpdatePassword from "../Authentication/UpdatePassword";
const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChats, setLoadingChats] = useState(false);

  const history = useHistory();
  const logoutHandler = (e) => {
    e.preventDefault();
    localStorage.removeItem("userInfo");
    history.push("/");
  };
  const [user, setUser] = useState([]);
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
    if (!userInfo) {
      history && history.push("/");
    }
  }, [history]);

  // for drawer
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
    darkMode,
    setDarkMode,
  } = ChatState();
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResults(data);
    } catch (err) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChats(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post("/api/chat", { userId }, config);
      if (!chats.find((chat) => chat._id === data._id)) {
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
      setLoadingChats(false);
      onClose();
    } catch (err) {
      toast({
        title: "Error fetching the chat",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg={darkMode ? "#272626" : "white"}
        w="100%"
        p="5px 10px"
        borderWidth={darkMode ? "0px" : "5px"}
      >
        <Tooltip label="Search User to Chat" hasArrow placement="bottom-end">
          <Button bg={!darkMode ? "white" : "#272626"} className="searchBtn">
            {/* <i class="fa fa-search" aria-hidden="true"></i> */}
            <SearchIcon color={!darkMode ? "#272626" : "white"} />
            <Text
              display={{ base: "none", md: "flex" }}
              onClick={onOpen}
              color={!darkMode ? "#272626" : "white"}
            >
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text
          fontSize="2xl"
          fontFamily="Work sans"
          color={!darkMode ? "#272626" : "white"}
        >
          Let's Talk
        </Text>
        <div>
          <Menu>
            <MenuButton
              p={1}
              onClick={() => {
                setDarkMode(!darkMode);
              }}
            >
              {!darkMode ? (
                <MoonIcon fontSize="2xl" m={1} color="#272626" />
              ) : (
                <SunIcon fontSize="2xl" m={1} color="white" />
              )}
            </MenuButton>
            <MenuButton p={1}>
              <BellIcon
                fontSize="2xl"
                m={1}
                color={!darkMode ? "#272626" : "white"}
              />
            </MenuButton>
            <MenuList>
              {(!notification || !notification.length) && "No Notifications"}
              {notification &&
                notification.map((notif) => {
                  <MenuItem
                    key={notif._id}
                    onClick={() => {
                      setSelectedChat(notif.chat);
                      setNotification(notification.filter((n) => n !== notif));
                    }}
                  >
                    {notif.chat.isGroupChat
                      ? `New Message in ${notif.chat.chatName}`
                      : `New Message from ${getSender(user, notif.chat.users)}`}
                  </MenuItem>;
                })}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              ></Avatar>
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <UpdateProfile user={user}>
                <MenuItem>Update Profile</MenuItem>
              </UpdateProfile>
              <UpdatePassword user={user}>
                <MenuItem>Update Password</MenuItem>
              </UpdatePassword>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                onChange={(e)=>handleSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResults?.map((user) => {
                return (
                  <UserListItem
                    user={user}
                    key={user._id}
                    handleFunction={() => {
                      accessChat(user._id);
                    }}
                  />
                );
              })
            )}
            {loading && <Spinner color="red.500" ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
