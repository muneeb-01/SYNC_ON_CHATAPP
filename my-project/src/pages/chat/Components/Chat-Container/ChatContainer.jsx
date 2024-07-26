import React from "react";
import ChatHeader from "./Components/ChatHeader";
import MessageBar from "./Components/MessageBar";
import MessageContainer from "./Components/MessageContainer";
function ChatContainer() {
  return (
    <div className="fixed top-0 h-[100vh] w-[100vw] bg-dark-1 flex flex-col md:static md:flex-1">
      <ChatHeader />
      <MessageContainer />
      <MessageBar />
    </div>
  );
}

export default ChatContainer;
