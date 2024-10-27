/* eslint-disable no-unused-vars */
import { createContext, useContext, useEffect } from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
// import { useEffect } from "react";
const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [notification, setNotification] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [chats, setChats] = useState([]);
  const [aiMessage, setAiMessage] = useState("");
  let history = useHistory();
  // console.log(history);
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) {
      {
        history && history.push("/");
      }
    }
  }, [history]);
  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification,
        darkMode,
        setDarkMode,
        aiMessage,
        setAiMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
