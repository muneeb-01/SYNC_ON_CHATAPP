import { useAppStore } from "@/store";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
const ContactList = ({ contacts, isChannel = false }) => {
  const {
    selectedChatType,
    selectedChatData,
    setSelectedChatMessages,
    setSelectedChatType,
    setSelectedChatData,
  } = useAppStore();

  const handleClick = (contact) => {
    if (isChannel) {
      setSelectedChatType("channel");
    } else setSelectedChatType("contact");

    setSelectedChatData(contact);
    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };

  return (
    <div className="mt-5">
      {contacts.map((contact) => {
        return (
          <div
            key={contact._id}
            className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${
              selectedChatData && selectedChatData._id === contact._id
                ? "bg-[#8417ff] hover:bg-[#8417ff]"
                : "hover:bg-[#f1f1f111]"
            }`}
            onClick={() => handleClick(contact)}
          >
            <div className="flex gap-5 items-center justify-start text-neutral-300">
              {!isChannel && (
                <div className=" relative w-10 h-10">
                  <Avatar className="h-10 w-10 rounded-full overflow-hidden max-sm:mb-4">
                    {contact?.image ? (
                      <AvatarImage
                        src={contact?.image}
                        alt="profile"
                        className="object-cover w-full h-full bg-black"
                      />
                    ) : (
                      <div
                        className={`h-10 w-10 text-lg border flex items-center justify-center  rounded-full ${getColor(
                          contact?.color
                        )}`}
                      >
                        {contact?.firstname
                          ? contact?.firstname.split("").shift().toUpperCase()
                          : contact.email.split("").shift().toUpperCase()}
                      </div>
                    )}
                  </Avatar>
                </div>
              )}
              {isChannel && (
                <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                  #
                </div>
              )}
              {isChannel ? (
                <span>{contact.name}</span>
              ) : (
                <span>{`${
                  contact.firstname && contact.lastname
                    ? `${contact.firstname} ${contact.lastname}`
                    : `${contact.email}`
                }  `}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ContactList;
