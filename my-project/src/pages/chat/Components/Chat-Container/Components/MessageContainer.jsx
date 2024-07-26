import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { SEARCH_MESSAGES_OF_TWO_USERS_ROUTE } from "@/utils/constants";
import moment from "moment";
import { useEffect, useRef } from "react";

const MessageContainer = () => {
  const scrollRef = useRef();
  const {
    selectedChatType,
    selectedChatData,
    selectedChatMessages,
    userInfo,
    setSelectedChatMessages,
  } = useAppStore();

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, idx) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={idx}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
        </div>
      );
    });
  };

  const renderDMMessages = (message) => {
    return (
      <div
        className={`${
          message.sender === selectedChatData._id ? "text-right" : "text-left"
        }`}
      >
        {selectedChatType === "contact" && (
          <div
            className={`${
              message.sender !== selectedChatData._id
                ? "bg-[#8471ff]/5 text-[#8471ff]/90 border-[#8471ff]/50"
                : "bg-[#2a2b33]/5 text-[#fff]/80 border-[#fff]/20"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {message.content}
          </div>
        )}
        <div className="text-xs text-gray-600 ">
          {moment(message.timestamp).format("LT")}
        </div>
      </div>
    );
  };

  useEffect(() => {
    try {
      const getMessages = async () => {
        const responce = await apiClient.post(
          SEARCH_MESSAGES_OF_TWO_USERS_ROUTE,
          { id: selectedChatData._id },
          { withCredentials: true }
        );
        if (responce.status || responce.data.messages) {
          setSelectedChatMessages(responce.data.messages);
        }
      };
      if (selectedChatData._id) {
        if (selectedChatType === "contact") {
          getMessages();
        }
      }
    } catch (error) {}

    return () => {};
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }

    return () => {};
  }, [selectedChatMessages]);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessages()}
      <div ref={scrollRef}></div>
    </div>
  );
};

export default MessageContainer;
