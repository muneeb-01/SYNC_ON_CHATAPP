import { useSocket } from "@/Hooks/SocketContext";
import { useAppStore } from "@/store";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";
const MessageBar = () => {
  const emojiRef = useRef();
  const [emojiPickerOpen, setemojiPickerOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { selectedChatType, selectedChatData, userInfo } = useAppStore();
  const socket = useSocket();
  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setemojiPickerOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef]);

  const handleSendMessage = async () => {
    if (selectedChatType === "contact") {
      socket.emit("sendMessage", {
        sender: userInfo.id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      });
    }
    setMessage("");
  };

  return (
    <div className="h-[10vh] bg-dark-1  flex justify-center items-center px-8 mb-6 gap-6">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md  items-center gap-5 pr-5">
        <input
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
          value={message}
          type="text"
          className=" flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
          placeholder="Enter Message"
        />
        <button className="text-neutral-500 focus:border-none focus:outline-none rounded-full p-2 focus:text-white transition-all duration-300 ">
          <GrAttachment className=" text-2xl" />
        </button>
        <div className="relative">
          <button
            onClick={() => setemojiPickerOpen(!emojiPickerOpen)}
            className="text-neutral-500 focus:border-none focus:outline-none rounded-full p-2 focus:text-white transition-all duration-300"
          >
            <RiEmojiStickerLine className=" text-2xl" />
          </button>
          <div ref={emojiRef} className=" absolute bottom-16 right-0">
            <EmojiPicker
              theme="dark"
              open={emojiPickerOpen}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
            />
          </div>
        </div>
      </div>
      <button
        onClick={handleSendMessage}
        className=" bg-[#8417ff] hover:bg-[#741bda]  focus:bg-[#741bda] flex items-center justify-center p-5 rounded-md text-neutral-300 focus:border-none focus:outline-none   focus:text-white transition-all duration-300"
      >
        <IoSend className=" text-2xl" />
      </button>
    </div>
  );
};

export default MessageBar;
