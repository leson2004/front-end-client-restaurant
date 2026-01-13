import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  IconButton,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Slide,
  Popover,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { deepOrange } from "@mui/material/colors";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";

import {
  collection,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  addDoc,
  limit,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../Config/Client/Firebase";
import UserInfoForm from "./UserInforForm";
import EmojiPicker from "emoji-picker-react";
import { Link } from "react-router-dom";

import threeDot from "../../Assets/Client/Images/three-dot.gif";

function ChatPopup() {
  // * Khai báo các state
  const [isOpen, setIsOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [userInfo, setUserInfo] = useState(() => {
    const savedUserInfo = localStorage.getItem("userInfo");
    return savedUserInfo ? JSON.parse(savedUserInfo) : null;
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [adminTyping, setAdminTyping] = useState(false);
  const [botTyping, setBotTyping] = useState(false);
  const [chatMode, setChatMode] = useState("bot"); // 'bot' hoặc 'human'
  const [humanChatStatus, setHumanChatStatus] = useState("inactive"); // 'inactive', 'active', 'ended'

  const predefinedMessages = [
    "Xin chào",
    "Địa chỉ của nhà hàng?",
    "Liên hệ với nhà hàng như nào?",
    "Nhà hàng có chỗ gửi xe không, gửi xe có bị tính phí không?",
    "Giờ hoạt động của nhà hàng?",
    "Đặt bàn như nào?",
    "Gặp nhân viên tư vấn!",
  ];

  // * Effect để lấy và lắng nghe tin nhắn mới
  useEffect(() => {
    let unsubscribe;

    const fetchMessages = () => {
      if (userInfo) {
        const { fullname, tel } = userInfo;
        const chatId = `${fullname}_${tel}`;

        const messagesCollection = collection(db, "messages");
        const q = query(
          messagesCollection,
          where("chatId", "==", chatId),
          orderBy("timestamp"),
          limit(50)
        );

        unsubscribe = onSnapshot(q, (querySnapshot) => {
          const fetchedMessages = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
            timestamp: doc.data().timestamp?.toDate() || new Date(),
          }));

          const latestAdminTypingMessage = fetchedMessages.find(
            (msg) => msg.adminTyping === true
          );
          setAdminTyping(!!latestAdminTypingMessage);

          const displayMessages = fetchedMessages.filter(
            (msg) => !msg.adminTyping
          );
          setMessages(displayMessages);
        });
      }
    };

    fetchMessages();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [userInfo]);

  // * Effect để xác định trạng thái chat hiện tại dựa trên tin nhắn
  useEffect(() => {
    const determineCurrentChatState = () => {
      if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        const humanChatKeywords = ["tiếp nối", "nhân viên tư vấn"];
        const botChatKeywords = ["kết thúc", "cuộc trò chuyện đã kết thúc"];

        const isHumanChat = humanChatKeywords.some((keyword) =>
          lastMessage.text.includes(keyword)
        );
        const isBotChat = botChatKeywords.some((keyword) =>
          lastMessage.text.includes(keyword)
        );

        if (isHumanChat) {
          setChatMode("human");
          setHumanChatStatus("active");
        } else if (isBotChat) {
          setChatMode("bot");
          setHumanChatStatus("inactive");
        }
      }
    };

    determineCurrentChatState();
  }, [messages]);

  // * Hàm định dạng thời gian tin nhắn
  const formatMessageTimestamp = (timestamp) => {
    const now = new Date();
    const timeDifference = now - timestamp;
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));

    if (minutesDifference < 1) {
      return "Mới nhất";
    } else if (minutesDifference < 60) {
      return `${minutesDifference} phút trước`;
    } else if (timeDifference < 24 * 60 * 60 * 1000) {
      const hoursDifference = Math.floor(minutesDifference / 60);
      return `${hoursDifference} giờ trước`;
    } else {
      return timestamp.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }
  };

  // * Hàm xử lý gửi tin nhắn
  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const chatId = `${userInfo.fullname}_${userInfo.tel}`;

      const newMessageData = {
        text: newMessage,
        timestamp: new Date(),
        role: "customer",
        fullname: userInfo?.fullname || "Khách hàng",
        tel: userInfo?.tel || "",
        title: userInfo?.title || "Anh/Chị",
        status: "sending",
        uid: userInfo?.uid || "",
        chatId: chatId,
      };

      setMessages((prevMessages) => [...prevMessages, newMessageData]);
      setNewMessage("");

      try {
        // Gửi tin nhắn của người dùng
        const docRef = await addDoc(collection(db, "messages"), {
          ...newMessageData,
          timestamp: serverTimestamp(),
          status: "sent",
        });

        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.timestamp === newMessageData.timestamp
              ? { ...msg, status: "sent", id: docRef.id }
              : msg
          )
        );

        if (chatMode === "bot") {
          setBotTyping(true);
          // Gọi API chatbot
          const response = await axios.post(
            "http://localhost:6969/api/chatbot",
            { message: newMessageData.text }
          );

          // Thêm một chút delay để tạo cảm giác tự nhiên
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Tạo tin nhắn cho bot
          const botMessageData = {
            text: response.data.response.response,
            timestamp: new Date(),
            role: "admin",
            fullname: "Chatbot",
            status: "sending",
            chatId: chatId,
          };

          // Thêm tin nhắn của bot vào state
          setMessages((prevMessages) => [...prevMessages, botMessageData]);

          // Gửi tin nhắn của bot lên Firestore
          const botDocRef = await addDoc(collection(db, "messages"), {
            ...botMessageData,
            timestamp: serverTimestamp(),
            status: "sent",
          });

          // Cập nhật state với id của tin nhắn bot
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.timestamp === botMessageData.timestamp
                ? { ...msg, status: "sent", id: botDocRef.id }
                : msg
            )
          );

          // Kiểm tra nếu cần chuyển sang chat với nhân viên
          if (response.data.response.endConversation) {
            const switchMessage = {
              text: "Bạn đang được chuyển sang chat với nhân viên hỗ trợ. Vui lòng đợi trong giây lát.",
              timestamp: new Date(),
              role: "admin",
              fullname: "Hệ thống",
              status: "sent",
              chatId: chatId,
            };
            setMessages((prevMessages) => [...prevMessages, switchMessage]);
            await addDoc(collection(db, "messages"), {
              ...switchMessage,
              timestamp: serverTimestamp(),
            });
          }
        }
        // Nếu đang ở chế độ 'human', không cần xử lý gì thêm vì tin nhắn đã được gửi lên Firestore
      } catch (error) {
        console.error("Error sending message: ", error);
        // Xử lý lỗi...
      } finally {
        setBotTyping(false);
      }
    }
  };

  // * Hàm chuyển đổi URL thành link có thể nhấp được
  const convertLinksToJSX = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <Link
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              wordBreak: "break-all",
              color: "#003b9c",
              textDecoration: "underline",
            }}
          >
            {part}
          </Link>
        );
      }
      return part;
    });
  };

  const sortedMessages = [...messages].sort(
    (a, b) => b.timestamp - a.timestamp
  );

  // * Hàm mở cửa sổ chat
  const handleOpen = () => {
    setIsOpen(true);
  };

  // * Hàm đóng cửa sổ chat
  const handleClose = () => {
    setIsOpen(false);
  };

  // * Hàm xử lý khi submit form nhập thông tin chat
  const handleFormSubmit = (userData) => {
    setUserInfo(userData);
    setIsOpen(true);
  };

  // * Hàm xử lý khi chọn emoji
  const handleEmojiClick = (emojiObject) => {
    setNewMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  // * Hàm xử lý khi nhấn nút emoji
  const handleEmojiButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // * Hàm đóng bảng chọn emoji
  const handleCloseEmoji = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "emoji-popover" : undefined;

  return (
    <>
      {!isOpen && (
        <Box
          sx={{
            position: "fixed",
            bottom: -10,
            right: 0,
            backgroundColor: "#FEA115",
            color: "white",
            borderRadius: "8px 8px 0 0",
            cursor: "pointer",
            boxShadow: "0 2px 4px #8a8a8a",
            zIndex: 1000,
            width: "350px",
            display: "flex",
            alignItems: "center",
            padding: "10px 15px",
          }}
          onClick={handleOpen}
        >
          <ChatIcon sx={{ mr: 1, fontSize: "15px" }} />
          <Typography
            variant="body2"
            sx={{
              fontSize: "14px",
              color: "#000000",
            }}
          >
            Chat với nhân viên tư vấn
          </Typography>
        </Box>
      )}

      <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            right: 0,
            width: "350px",
            height: userInfo ? "500px" : "auto",
            maxHeight: "80vh",
            backgroundColor: "#fff",
            borderRadius: "8px 8px 0 0",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2) !important",
            zIndex: 1000,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {!userInfo ? (
            <Box sx={{ padding: "20px" }}>
              <UserInfoForm
                onFormSubmit={handleFormSubmit}
                onCancel={handleClose}
              />
            </Box>
          ) : (
            <Paper
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
              elevation={3}
            >
              <Box
                sx={{
                  backgroundColor: "#FEA115",
                  color: "white",
                  padding: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    sx={{ marginRight: "10px" }}
                    src="../../Assets/Client/Images/huong-sen-logo.png"
                  />

                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", color: "white" }}
                    >
                      Xin chào!
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "black", fontSize: "12px" }}
                    >
                      Mình cần nhà hàng hỗ trợ gì ạ?
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0 }}>
                  <IconButton sx={{ color: "white" }} onClick={handleClose}>
                    <CloseIcon />
                  </IconButton>
                </Box>
              </Box>
              <Box
                className="messages"
                sx={{
                  flexGrow: 1,
                  overflowY: "auto",
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column-reverse",
                }}
              >
                {chatMode === "bot" && botTyping && (
                  <Box
                    sx={{
                      alignSelf: "flex-start",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        marginRight: "5px",
                        fontStyle: "italic",
                        color: "gray",
                      }}
                    >
                      Chatbot đang trả lời
                    </Typography>
                    <img
                      src={threeDot}
                      alt="typing"
                      style={{ width: "20px", height: "20px" }}
                    />
                  </Box>
                )}
                {chatMode === "human" &&
                  humanChatStatus === "active" &&
                  adminTyping && (
                    <Box
                      sx={{
                        alignSelf: "flex-start",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          marginRight: "5px",
                          fontStyle: "italic",
                          color: "gray",
                        }}
                      >
                        Nhân viên đang trả lời
                      </Typography>
                      <img
                        src={threeDot}
                        alt="typing"
                        style={{ width: "20px", height: "20px" }}
                      />
                    </Box>
                  )}
                {sortedMessages.map((message, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      mb: 4,
                      p: 2,
                      borderRadius: 1,
                      backgroundColor:
                        message.role === "customer" ? "#FEA115" : "#f0f0f0",
                      alignSelf:
                        message.role === "customer" ? "flex-end" : "flex-start",
                      textAlign: message.role === "customer" ? "left" : "left",
                      maxWidth: "80%",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      position: "relative",
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                    }}
                  >
                    {message.role === "admin" && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 1,
                          alignSelf: "flex-start",
                        }}
                      >
                        <Avatar
                          sx={{ marginRight: "10px", mr: 1 }}
                          src="../../Assets/Client/Images/huong-sen-logo.png"
                        />
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: "bold", color: "#ffa724" }}
                        >
                          Nhà Hàng Hương Việt
                        </Typography>
                      </Box>
                    )}
                    <Typography
                      variant="body1"
                      sx={{
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                      }}
                    >
                      {convertLinksToJSX(message.text)}
                    </Typography>

                    <Typography
                      variant="caption"
                      sx={{
                        position: "absolute",
                        bottom: -30,
                        right: 2,
                        color: "gray",
                        width: "300px",
                        textAlign: "right",
                      }}
                    >
                      {`${
                        message.status === "sending" ? "Đang gửi" : "Đã gửi"
                      } • `}
                      {formatMessageTimestamp(message.timestamp)}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <hr />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  flexDirection: "column",
                }}
              >
                {/* Danh sách tin nhắn có sẵn */}
                <Box
                  sx={{
                    display: "block",
                    overflowX: "auto",
                    mb: 2,
                    width: "100%",
                    padding: "8px",
                    backgroundColor: "#f9f9f9",
                    borderRadius: 2,
                    whiteSpace: "nowrap",
                    "&::-webkit-scrollbar": {
                      height: "8px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "#c1c1c1",
                      borderRadius: "4px",
                    },
                  }}
                >
                  {predefinedMessages.map((message, index) => (
                    <Button
                      key={index}
                      color="warning"
                      variant="outlined"
                      size="small"
                      onClick={async () => {
                        await setNewMessage(message);
                        handleSendMessage(message);
                      }}
                      sx={{
                        mr: 1,
                        whiteSpace: "nowrap",
                        padding: "2px 6px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {message}
                    </Button>
                  ))}
                </Box>

                <Box
                  sx={{ display: "flex", alignItems: "center", width: "100%" }}
                >
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    type="search"
                    placeholder={
                      chatMode === "bot"
                        ? "Nhập câu hỏi cho chatbot..."
                        : humanChatStatus === "active"
                        ? "Nhập tin nhắn cho nhân viên..."
                        : "Đang chờ nhân viên..."
                    }
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage();
                      }
                    }}
                    disabled={
                      chatMode === "human" && humanChatStatus !== "active"
                    }
                    sx={{
                      mr: 1,
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                    }}
                  />
                  <IconButton
                    onClick={handleSendMessage}
                    sx={{
                      mr: 1,
                      display: { xs: "flex", sm: "flex", md: "none" },
                    }}
                  >
                    <SendIcon sx={{ color: "#ffa115" }} />
                  </IconButton>
                  <IconButton
                    onClick={handleEmojiButtonClick}
                    sx={{ mr: 1, display: { xs: "none", md: "flex" } }}
                  >
                    <EmojiEmotionsIcon />
                  </IconButton>
                  <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleCloseEmoji}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                  >
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                  </Popover>
                </Box>
              </Box>
            </Paper>
          )}
        </Box>
      </Slide>
    </>
  );
}

export default ChatPopup;
