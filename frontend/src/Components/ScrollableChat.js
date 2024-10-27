/* eslint-disable no-unused-vars */
import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { format } from "date-fns";
import { ChatState } from "../Context/ChatProvider";
import ProfileModal from "./miscellaneous/ProfileModal";
import { Image } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { set } from "mongoose";
import { CalendarIcon, ArrowDownIcon } from "@chakra-ui/icons";
import chatBG from "../animation/chatBG.webp";
import { CopyToClipboard } from "react-copy-to-clipboard";
import axios from "axios";

const ScrollableChat = ({ messages, disappearingChat, setMessages }) => {
  const { user, darkMode } = ChatState();
  const [identifyType, setIdentifyType] = useState(0);
  const [openMessageId, setOpenMessageId] = useState(null);
  const toggleDropdown = (messageId) => {
    setOpenMessageId(messageId === openMessageId ? null : messageId);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMessageId && !event.target.closest(".messageContainer")) {
        setOpenMessageId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openMessageId]);

  var type = 0;
  const getHours = (dateObj) => {
    const date = new Date(dateObj);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    if (hours < 10) {
      return `0${hours}:`;
    } else {
      return `${hours}:`;
    }
    if (minutes < 10) {
      return `0${minutes} `;
    } else {
      return `${minutes} `;
    }
  };

  const getFileType = (extension) => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif"];
    const videoExtensions = ["mp4", "avi", "mov", "mkv"];
    const audioExtensions = ["mp3", "wav", "ogg"];
    const documentExtensions = ["doc", "docx", "pdf", "txt"];

    if (imageExtensions.includes(extension)) {
      return "Image";
    } else if (videoExtensions.includes(extension)) {
      return "Video";
    } else if (audioExtensions.includes(extension)) {
      return "Audio";
    } else if (documentExtensions.includes(extension)) {
      return "Document";
    } else {
      return "Unknown";
    }
  };
  const Check = (url) => {
    // console.log(url);
    const urlObject = new URL(url);
    const extension = urlObject.pathname.split(".").pop();
    // console.log("File extension:", extension);
    // const fileType = getFileType(extension);

    const imageExtensions = ["jpg", "jpeg", "png", "gif"];
    const videoExtensions = ["mp4", "avi", "mov", "mkv"];
    const audioExtensions = ["mp3", "wav", "ogg", "m4a"];
    const documentExtensions = ["doc", "docx", "pdf", "txt"];

    if (imageExtensions.includes(extension)) {
      // setIdentifyType("Image");
      type = 1;
      return;
    } else if (videoExtensions.includes(extension)) {
      type = 2;
      // setIdentifyType("Video");
      return;
    } else if (audioExtensions.includes(extension)) {
      type = 3;
      // setIdentifyType("Audio");
      return;
    } else if (documentExtensions.includes(extension)) {
      type = 4;
      // setIdentifyType("Document");
      return;
    } else {
      type = 5;
      // setIdentifyType("Unknown");
      return;
    }
  };
  const getMins = (dateObj) => {
    const date = new Date(dateObj);
    const minutes = date.getMinutes();
    if (minutes < 10) {
      return `0${minutes} `;
    } else {
      return `${minutes} `;
    }
  };
  const printDate = (messages, m, i) => {
    const date1 = new Date(m?.createdAt);
    const date2 = new Date(messages[i - 1]?.createdAt);
    const monthName = format(date1, "MMMM");
    if (
      i == 0 ||
      date2.getDate() != date1.getDate() ||
      date2.getMonth() != date1.getMonth() ||
      date2.getFullYear() != date1.getFullYear()
    ) {
      return (
        <span
          backgroundColor={darkMode ? "red" : "#8c8c8c"}
          className="dateStamp"
        >
          {monthName} {date1.getDate()}, {date1.getFullYear()}
        </span>
      );
    }
  };
  var isDifferenceGreaterThan24Hours = false;
  var timeDifference = 0;
  const CheckDateDiff = (m) => {
    const date1 = new Date(m?.createdAt);
    const date2 = new Date();
    timeDifference = date2 - date1;
    const twentyFourHoursInMilliseconds = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    // console.log(timeDifference);
    if (timeDifference > twentyFourHoursInMilliseconds || timeDifference < 0) {
      isDifferenceGreaterThan24Hours = true;
    } else {
      isDifferenceGreaterThan24Hours = false;
    }
  };

  const deleteMessage = async (messageId) => {
    // Filter the messages to remove the one with the matching ID
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios
        .delete(`/api/message/${messageId}`, config)
        .then((response) => {
          // Handle successful deletion on the backend
          console.log("Message deleted from the backend:", response.data);
        })
        .catch((error) => {
          // Handle errors
          console.error("Error deleting message from the backend:", error);
        });
      const updatedMessages = messages.filter(
        (message) => message._id !== messageId
      );
      setMessages(updatedMessages);
    } catch (error) {
      console.log(error);
    }
  };

  function linkify(message) {
    const contentWithLinks = darkMode
      ? message.replace(
          /(https?:\/\/\S+)/g,
          '<a href="$1" target="_blank" style="color: #28E8FF; text-decoration: underline;">$1</a>'
        )
      : message.replace(
          /(https?:\/\/\S+)/g,
          '<a href="$1" target="_blank" style="color: blue; text-decoration: underline;">$1</a>'
        );
    return contentWithLinks;
  }

  function NewlineText(props) {
    let text = props.text;
    if (!text) {
      return null;
    }

    const linkifiedText = linkify(text);

    // Use dangerouslySetInnerHTML for linkified content
    const linkifiedContent = {
      __html: linkifiedText,
    };

    // Render linkified content
    return (
      <div
        dangerouslySetInnerHTML={linkifiedContent}
        style={{ whiteSpace: "pre-wrap" }}
      />
    );
  }

  return (
    <ScrollableFeed>
      <div>
        {messages &&
          messages.map((m, i) => (
            <div>
              {CheckDateDiff(m)}
              {timeDifference >= 0 &&
              (!m.disappearMode ||
                (m.disappearMode && !isDifferenceGreaterThan24Hours)) ? (
                <>
                  <p className="printDate">{printDate(messages, m, i)}</p>
                  <div
                    style={{ display: "flex" }}
                    key={m._id}
                    className="messageContainer"
                  >
                    {(isSameSender(messages, m, i, user._id) ||
                      isLastMessage(messages, i, user._id)) && (
                      <Tooltip
                        label={m.sender.name}
                        placement="bottom-start"
                        hasArrow
                      >
                        <ProfileModal user={m.sender}>
                          <Avatar
                            mt="7px"
                            mr={1}
                            size="sm"
                            cursor="pointer"
                            name={m.sender.name}
                            src={m.sender.pic}
                          />
                        </ProfileModal>
                      </Tooltip>
                    )}
                    <p
                      className="printingMessage"
                      style={{
                        backgroundColor: `${
                          m.sender._id === user._id
                            ? !darkMode
                              ? "#BEE3F8"
                              : "#035c4c"
                            : darkMode
                            ? "#272626"
                            : "#B9F5D0"
                        }`,
                        color: `${darkMode ? "white" : "black"}`,

                        marginLeft: isSameSenderMargin(
                          messages,
                          m,
                          i,
                          user._id
                        ),
                        marginTop: isSameUser(messages, m, i, user._id)
                          ? 3
                          : 10,
                        borderRadius: "20px",
                        padding: "5px 15px",
                        maxWidth: "75%",
                      }}
                    >
                      {m.image && Check(m.image)}
                      {/* <NewlineText text={m.content} /> */}
                      {m.image && type == 1 ? (
                        <Box
                          boxSize="sm"
                          style={{
                            height: "fit-content",
                          }}
                        >
                          <Image src={m.image} alt="Some image" />
                        </Box>
                      ) : (
                        <> </>
                      )}
                      {m.image && type == 2 ? (
                        <Box
                          boxSize="sm"
                          style={{
                            height: "fit-content",
                          }}
                        >
                          <video controls>
                            <source src={m.image} type="video/mp4" />
                            Your browser does not support the video element.
                          </video>
                        </Box>
                      ) : (
                        <> </>
                      )}
                      {m.image && type == 3 ? (
                        <Box
                          style={{
                            width: "fit-content",
                          }}
                        >
                          <audio controls>
                            <source src={m.image} type="audio/mpeg" />
                            Your browser does not support the audio element.
                          </audio>
                        </Box>
                      ) : (
                        <> </>
                      )}
                      {m.image && type == 4 ? (
                        <Box Boxsize="sm">
                          <CalendarIcon fontSize={"22px"} />
                          <a
                            href={m.image}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Download Document
                          </a>
                        </Box>
                      ) : (
                        <> </>
                      )}
                      {m.image && type == 5 ? (
                        <Box width="100px">Not supportable File</Box>
                      ) : (
                        <> </>
                      )}
                      <p>
                        <NewlineText text={m.content} />
                      </p>
                      <span
                        className="arrowIcon"
                        onClick={() => {
                          toggleDropdown(m._id);
                        }}
                      >
                        <ArrowDownIcon />
                      </span>

                      <span className="timeStamp">
                        {getHours(m.createdAt) + getMins(m.createdAt)}
                      </span>
                    </p>
                  </div>
                  {openMessageId === m._id && (
                    <div
                      className="dropdown-content"
                      style={{
                        float: isSameUser(messages, m, i, user._id)
                          ? "right"
                          : "left",
                        borderRadius: "20px",
                        padding: "5px 15px",
                        maxWidth: "75%",
                      }}
                    >
                      <Box
                        alignItems="center"
                        bg={darkMode ? "#272626" : "white"}
                        borderRadius="lg"
                        backgroundColor={darkMode ? "#272626" : "gray"}
                        className="dropdown-content"
                      >
                        <CopyToClipboard
                          text={m.content}
                          style={{ padding: "5px" }}
                        >
                          <option
                            value="option1"
                            style={{
                              border: "solid white",
                              padding: "5px",
                              borderRadius: "5px",
                            }}
                          >
                            Copy
                          </option>
                        </CopyToClipboard>
                        <option
                          value="option2"
                          style={{
                            border: "solid white",
                            padding: "5px",
                            borderRadius: "5px",
                          }}
                          onClick={() => {
                            deleteMessage(m._id);
                          }}
                        >
                          Delete
                        </option>
                      </Box>
                    </div>
                  )}
                </>
              ) : (
                <></>
              )}
            </div>
          ))}
      </div>
    </ScrollableFeed>
  );
};

export default ScrollableChat;
