import { useAppStore } from "@/store";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { IoPowerSharp } from "react-icons/io5";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { apiClient } from "@/lib/api-client";
import { LOGOUT_ROUTE } from "@/utils/constants";

const ProfileInfo = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const responce = await apiClient.post(
        LOGOUT_ROUTE,
        {},
        { withCredentials: true }
      );

      if (responce.status === 200) {
        setUserInfo(null);
        navigate("/auth");
      }
    } catch (error) {}
  };

  return (
    <div className=" absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33]">
      <div className="flex gap-3 items-center justify-center">
        <div className=" relative w-12 h-12">
          <Avatar className="h-12 w-12 rounded-full overflow-hidden max-sm:mb-4">
            {userInfo?.image ? (
              <AvatarImage
                src={userInfo?.image}
                alt="profile"
                className="object-cover w-full h-full bg-black"
              />
            ) : (
              <div
                className={`h-12 w-12 text-lg border flex items-center justify-center  rounded-full ${getColor(
                  userInfo?.color
                )}`}
              >
                {userInfo?.firstname
                  ? userInfo?.firstname.split("").shift().toUpperCase()
                  : userInfo.email.split("").shift().toUpperCase()}
              </div>
            )}
          </Avatar>
        </div>
        <div className="poppins-light">
          {userInfo.firstname && userInfo.lastname
            ? userInfo.firstname + " " + userInfo.lastname
            : ""}
        </div>
      </div>
      <div className="flex gap-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FiEdit2
                onClick={() => navigate("/profile")}
                className=" text-purple-500 text-xl font-medium"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit Profile</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <IoPowerSharp
                onClick={handleLogout}
                className=" text-red-400 text-xl font-medium"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ProfileInfo;
