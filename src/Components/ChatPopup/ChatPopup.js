import React, { useEffect, useRef, useState } from "react";
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

import { io } from "socket.io-client";

const socket = io("http://localhost:8080", {
  transports: ["websocket"],
});
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
    const savedUserInfo = localStorage.getItem("user");
    return savedUserInfo ? JSON.parse(savedUserInfo) : null;
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [adminTyping, setAdminTyping] = useState(false);
  const [botTyping, setBotTyping] = useState(false);
  const [chatMode, setChatMode] = useState("bot"); // 'bot' hoặc 'human'
  const [humanChatStatus, setHumanChatStatus] = useState("inactive"); // 'inactive', 'active', 'ended'
  const [roomId, setRoomId] = useState(null);
  const [sendError, setSendError] = useState(null);
  // timestamp updater state – triggers re-render every minute so that
  // formatMessageTimestamp can recalc relative times even when no new
  // messages arrive.
  const [now, setNow] = useState(new Date());
  const messagesEndRef = useRef(null);

  const predefinedMessages = [
    "Xin chào",
    "Địa chỉ của nhà hàng?",
    "Liên hệ với nhà hàng như nào?",
    "Giờ hoạt động của nhà hàng?",
    "Đặt bàn như nào?",
    "Gặp nhân viên tư vấn!",
    "Kết thúc cuộc trò chuyện với nhân viên tư vấn!",
  ];

  // * Effect để lấy và lắng nghe tin nhắn mới

  useEffect(() => {
    if (!userInfo || !userInfo.id) {
      console.warn("User info chưa có ID, không gọi API");
      return;
    }

    const initRoom = async () => {
      const res = await axios.post("http://localhost:8080/api/chat/room", {
        customerId: userInfo.id,
      });

      setRoomId(res.data.data.id);

      socket.emit("join-room", { roomId: res.data.data.id });
      // 2️ LẤY LỊCH SỬ TIN NHẮN
      const msgRes = await axios.get(
        `http://localhost:8080/api/chat/messages/${userInfo.id}`,
      );

      const historyMessages = msgRes.data.data.map((msg) => {
        const ts = new Date(msg.created_at);
        // if server time is ahead, fall back to client now so relative time works
        const timestamp = ts > new Date() ? new Date() : ts;
        return {
          id: msg.id,
          text: msg.message,
          message: msg.message,
          role: msg.sender_role,
          senderRole: msg.sender_role,
          fullname:
            msg.sender_role === "bot"
              ? "Chatbot"
              : msg.sender_role === "admin"
                ? "Nhân viên"
                : userInfo.fullname,
          status: "sent",
          timestamp,
          attachments: msg.attachments || null,
        };
      });

      setMessages(historyMessages);
    };

    initRoom();
  }, [userInfo]);

  // update `now` every minute so that timestamps refresh automatically
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Tự cuộn xuống cuối khi có tin nhắn mới hoặc khi đang typing
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, botTyping, adminTyping]);

  // * Effect để xác định trạng thái chat hiện tại dựa trên tin nhắn

  useEffect(() => {
    if (!socket) return;

    socket.on("receive-message", (data) => {
      if (data.senderRole === "bot") {
        setBotTyping(false);
      }

      setMessages((prev) => {
        // Update optimistic message

        if (data.tempId) {
          return prev.map((msg) =>
            msg.id === data.tempId
              ? {
                  ...msg,
                  status: "sent",
                  id: data.id,
                  timestamp:
                    new Date(data.created_at) > new Date()
                      ? new Date()
                      : new Date(data.created_at),
                }
              : msg,
          );
        }
        // 2️⃣ Tránh append trùng
        if (prev.some((msg) => msg.id === data.id)) {
          return prev;
        }
        // Bot / admin (include attachments for hybrid AI reply about menu)
        return [
          ...prev,
          {
            id: data.id,
            text: data.message,
            message: data.message,
            role: data.senderRole,
            senderRole: data.senderRole,
            fullname: data.senderRole === "bot" ? "Chatbot" : "Nhân viên",
            status: "sent",
            timestamp: new Date(data.created_at),
            attachments: data.attachments || null,
          },
        ];
      });
    });

    socket.on("error-message", (data) => {
      setSendError(data?.message || "Không gửi được tin nhắn");
    });

    return () => {
      socket.off("receive-message");
      socket.off("error-message");
    };
  }, []);

  // * Hàm định dạng thời gian tin nhắn (hiển thị theo múi giờ VN khi là ngày đầy đủ)
  const formatMessageTimestamp = (timestamp) => {
    if (!timestamp) return "Vừa xong";

    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    if (isNaN(date.getTime())) {
      return "Vừa xong";
    }

    // So sánh theo epoch (đã đúng nếu backend gửi ISO/UTC)
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 1) {
      return "Vừa xong";
    }
    if (diffMinutes < 60) {
      return `${diffMinutes} phút trước`;
    }

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) {
      return `${diffHours} giờ trước`;
    }

    // Hiển thị ngày giờ cố định theo múi giờ Việt Nam
    return date.toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  useEffect(() => {
    if (messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];
    const text = (lastMessage.message || "").toLowerCase();

    // only switch when the user sends the exact control messages
    if (
      text === "gặp nhân viên tư vấn!" ||
      text.includes("gặp nhân viên tư vấn")
    ) {
      setChatMode("human");
      setHumanChatStatus("active");
    }

    if (
      text === "kết thúc cuộc trò chuyện với nhân viên tư vấn!" ||
      text.includes("kết thúc cuộc trò chuyện")
    ) {
      setChatMode("bot");
      setHumanChatStatus("inactive");
    }
  }, [messages]);

  // * Hàm xử lý gửi tin nhắn

  const handleSendMessage = async (text) => {
    const content = text ?? newMessage;
    if (!content.trim() || !roomId) return; // use `content` instead of newMessage to handle preset texts

    // check for control messages and determine target mode **before** emitting
    const lowered = content.toLowerCase();
    const switchToHuman = lowered.includes("gặp nhân viên tư vấn");
    const switchToBot = lowered.includes("kết thúc cuộc trò chuyện");

    // calculate what mode we'll be in when the message is sent
    let currentMode = chatMode;
    if (switchToHuman) currentMode = "human";
    if (switchToBot) currentMode = "bot";

    // update state immediately so subsequent messages follow the new mode
    if (switchToHuman) {
      setChatMode("human");
      setHumanChatStatus("active");
    }
    if (switchToBot) {
      setChatMode("bot");
      setHumanChatStatus("inactive");
    }

    const toBot = currentMode === "bot";

    const tempId = Date.now();

    const optimisticMessage = {
      id: tempId,
      text: content,
      message: content,
      timestamp: new Date(),
      role: "customer",
      senderRole: "customer",
      fullname: userInfo?.fullname || "Khách hàng",
      tel: userInfo?.tel || "",
      status: "sending",
    };

    // 1️⃣ Hiển thị ngay
    setMessages((prev) => [...prev, optimisticMessage]);
    setNewMessage("");
    setSendError(null);

    // 2️⃣ Gửi socket (senderId for bot to answer "my order" by user_id)
    socket.emit("send-message", {
      tempId,
      roomId,
      senderRole: "customer",
      senderId: userInfo?.id ?? userInfo?.uid ?? null,
      message: content,
      toBot,
    });

    // 3️⃣ Nếu bot → bật typing
    if (toBot) {
      setBotTyping(true);
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
    (a, b) => a.timestamp - b.timestamp,
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
                  overflow: "hidden",
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
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
                          message.senderRole === "customer"
                            ? "#FEA115"
                            : "#f0f0f0",
                        alignSelf:
                          message.senderRole === "customer"
                            ? "flex-end"
                            : "flex-start",
                        textAlign:
                          message.senderRole === "customer" ? "left" : "left",
                        maxWidth: "80%",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        position: "relative",
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                      }}
                    >
                      {message.role !== "customer" && (
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
                      {/* Bot reply attachments: images + link (e.g. menu CTA) */}
                      {message.attachments && (
                        <Box sx={{ mt: 1 }}>
                          {message.attachments.images &&
                            message.attachments.images.length > 0 && (
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 0.5,
                                  mb: message.attachments.link ? 1 : 0,
                                }}
                              >
                                {message.attachments.images.map((imgUrl, i) => (
                                  <Box
                                    key={i}
                                    component="img"
                                    src={imgUrl}
                                    alt=""
                                    sx={{
                                      maxWidth: "100%",
                                      width: "auto",
                                      maxHeight: 140,
                                      objectFit: "cover",
                                      borderRadius: 1,
                                    }}
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                    }}
                                  />
                                ))}
                              </Box>
                            )}
                          {message.attachments.link &&
                            message.attachments.link.url && (
                              <Box
                                component="a"
                                href={message.attachments.link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                  display: "inline-block",
                                  mt: 0.5,
                                  py: 0.75,
                                  px: 1.5,
                                  backgroundColor: "#FEA115",
                                  color: "#fff",
                                  borderRadius: 1,
                                  textDecoration: "none",
                                  fontSize: 13,
                                  fontWeight: 500,
                                  "&:hover": { color: "#fff", opacity: 0.9 },
                                }}
                              >
                                {message.attachments.link.label || "Xem thêm"}
                              </Box>
                            )}
                        </Box>
                      )}

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
                  <div ref={messagesEndRef} />
                </Box>
                {/* Typing indicator ở dưới danh sách tin nhắn (gần ô nhập) */}
                {chatMode === "bot" && botTyping && (
                  <Box
                    sx={{
                      alignSelf: "flex-start",
                      display: "flex",
                      alignItems: "center",
                      flexShrink: 0,
                      py: 0.5,
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
                        flexShrink: 0,
                        py: 0.5,
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

                {sendError && (
                  <Typography
                    variant="caption"
                    sx={{ color: "error.main", mb: 0.5, width: "100%" }}
                  >
                    {sendError}
                  </Typography>
                )}
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
                  <IconButton onClick={handleSendMessage} sx={{ mr: 1 }}>
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
