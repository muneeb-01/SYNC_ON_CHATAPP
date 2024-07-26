import ProfileInfo from "./Component/ProfileInfo";
import NewDM from "./Component/NewDM";
import { useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { GET_CONTACTS_FOR_DM_LIST_ROUTE } from "@/utils/constants";
import { useAppStore } from "@/store";
import ContactList from "@/components/ContactList";
const ContactsContainer = () => {
  const {
    setDirectMessagesContacts,
    directMessagesContacts,
    selectedChatMessages,
  } = useAppStore();

  useEffect(() => {
    try {
      const getContactsForDM = async () => {
        const responce = await apiClient.get(GET_CONTACTS_FOR_DM_LIST_ROUTE, {
          withCredentials: true,
        });
        if (responce.status === 200 && responce.data.contacts) {
          setDirectMessagesContacts(responce.data.contacts);
        }
      };
      getContactsForDM();
    } catch (error) {}

    return () => {};
  }, []);

  return (
    <div className=" relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-dark-1 border-r-2 border-[#2f303b] w-full">
      <div className="poppins-medium text-3xl px-8 py-6">
        <h1 className=" font-bold">
          Sync<span className=" text-purple-400">on</span>
        </h1>
      </div>
      <div className=" my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text={"Direct Messages"} />
          <NewDM />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={directMessagesContacts} />
        </div>
      </div>
      <div className=" my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text={"Channels"} />
        </div>
      </div>
      <ProfileInfo />
    </div>
  );
};

export default ContactsContainer;

const Title = ({ text }) => {
  return (
    <h6 className=" uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm">
      {text}
    </h6>
  );
};
