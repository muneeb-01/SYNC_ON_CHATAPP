import { useAppStore } from "@/store";
import { RiCloseFill } from "react-icons/ri";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
const ChatHeader = () => {
  const { closeChat, selectedChatData, selectedChatType } = useAppStore();
  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-center px-20 max-sm:p-5">
      <div className="flex gap-5 items-center  w-full justify-between">
        <div className="flex gap-3 items-center justify-center">
          <div className=" relative w-12 h-12">
            <Avatar className="h-12 w-12 rounded-full overflow-hidden max-sm:mb-4">
              {selectedChatData?.image ? (
                <AvatarImage
                  src={selectedChatData?.image}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`h-12 w-12 text-lg border flex items-center justify-center  rounded-full ${getColor(
                    selectedChatData?.color
                  )}`}
                >
                  {selectedChatData?.firstname
                    ? selectedChatData?.firstname
                        .split("")
                        .shift()
                        .toUpperCase()
                    : selectedChatData.email.split("").shift().toUpperCase()}
                </div>
              )}
            </Avatar>
          </div>
          <div>
            {selectedChatType === "contact" && selectedChatData.firstname
              ? `${selectedChatData.firstname} ${selectedChatData.lastname}`
              : `${selectedChatData.email}`}
          </div>
        </div>
        <div className=" flex items-center justify-center gap-5">
          <button className=" text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all">
            <RiCloseFill onClick={closeChat} className="text-3xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
