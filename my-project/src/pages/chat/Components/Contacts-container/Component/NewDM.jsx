import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { ScrollArea } from "@/components/ui/scroll-area";
import Lottie from "react-lottie";
import React from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { animationDefaultOption } from "@/lib/utils";
import { getColor } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiClient } from "@/lib/api-client";
import { SEARCH_CONTACTS_ROUTE } from "@/utils/constants";
import { useDebounce } from "@/Hooks/useDebounce";
import { useAppStore } from "@/store";

const NewDM = () => {
  const { setSelectedChatType, setSelectedChatData } = useAppStore();
  const [openNewContactMode, setOpenNewContactModel] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm);
  useEffect(() => {
    const searchContacts = async (debouncedSearchTerm) => {
      try {
        const responce = await apiClient.post(
          SEARCH_CONTACTS_ROUTE,
          { searchTerm: debouncedSearchTerm },
          { withCredentials: true }
        );
        if (responce.status === 200 && responce.data.contacts) {
          setSearchedContacts(responce.data.contacts);
        }
      } catch (error) {}
    };
    if (debouncedSearchTerm.length > 0) {
      searchContacts(debouncedSearchTerm);
    }
    return () => {};
  }, [debouncedSearchTerm]);

  const handleSelectNewContact = (contact) => {
    setOpenNewContactModel(false);
    setSelectedChatType("contact");
    setSelectedChatData(contact);
    setSearchedContacts([]);
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              onClick={() => setOpenNewContactModel(true)}
              className="text-neutral-400 font-light text-opacity-90 text-center hover:text-neutral-100 cursor-pointer transition-all duration-300"
            />
          </TooltipTrigger>
          <TooltipContent className="bg-dark-1 border-none mb-2 p-3 text-white">
            Select New Contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={openNewContactMode} onOpenChange={setOpenNewContactModel}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Please select a contact</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="w-full">
            <input
              placeholder="Search Contacts"
              className="rounded-lg p-4 w-full bg-[#2c2e3b] border-none"
              onChange={(e) =>
                e.target.value.length
                  ? setSearchTerm(e.target.value)
                  : setSearchedContacts([])
              }
            />
          </div>
          {searchedContacts.length > 0 && (
            <ScrollArea className="h-[250px]">
              <div className="flex flex-col gap-5">
                {searchedContacts.map((contact) => {
                  return (
                    <div
                      onClick={() => handleSelectNewContact(contact)}
                      key={contact._id}
                      className="flex gap-3 items-center cursor-pointer"
                    >
                      <div className=" relative w-12 h-12">
                        <Avatar className="h-12 w-12 rounded-full overflow-hidden max-sm:mb-4">
                          {contact?.image ? (
                            <AvatarImage
                              src={contact?.image}
                              alt="profile"
                              className="object-cover w-full h-full bg-black"
                            />
                          ) : (
                            <div
                              className={`h-12 w-12 text-lg border flex items-center justify-center  rounded-full ${getColor(
                                contact?.color
                              )}`}
                            >
                              {contact?.firstname
                                ? contact?.firstname
                                    .split("")
                                    .shift()
                                    .toUpperCase()
                                : contact.email.split("").shift().toUpperCase()}
                            </div>
                          )}
                        </Avatar>
                      </div>
                      <div className="flex flex-col">
                        <span>
                          {contact.firstname && contact.lastname
                            ? `${contact.firstname} ${contact.lastname}`
                            : contact.email}
                        </span>
                        <span className="text-xs">{contact.email}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
          {searchedContacts.length <= 0 && (
            <div className="flex-1 md:bg-dark-1 mt-[3vh] md:flex flex-col justify-center items-center  duration-1000 transition-all">
              <Lottie
                isClickToPauseDisabled={true}
                height={100}
                width={100}
                options={animationDefaultOption}
              />
              <div className=" text-opacity-80 text-white flex flex-col gap-5 items-center mt-[3vh] lg:text-2xl text-xl transition-all duration-300 text-center">
                <h3 className="poppins-medium">
                  Hi<span className="text-purple-500">! </span>
                  <span className="text-purple-500"></span>Search new
                  <span className="text-purple-500">Contacts.</span>
                </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDM;
