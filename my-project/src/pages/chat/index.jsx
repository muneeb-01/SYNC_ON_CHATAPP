import { useAppStore } from "@/store";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ContactsContainer from "./Components/Contacts-container/ContactsContainer";
import ChatContainer from "./Components/Chat-Container/ChatContainer";
import EmptyChatContainer from "./Components/EmptyChatContainer";

function index() {
  const { userInfo, selectedChatType } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast("Please setup profile to proceed further");
      navigate("/profile");
    }
  }, [userInfo, navigate]);

  return (
    <div className="flex text-white h-[100vh] overflow-hidden">
      <ContactsContainer />
      {selectedChatType === undefined ? (
        <EmptyChatContainer />
      ) : (
        <ChatContainer />
      )}
    </div>
  );
}

export default index;
