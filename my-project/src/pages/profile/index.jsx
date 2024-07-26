import { useAppStore } from "@/store";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { FaTrash, FaPlus } from "react-icons/fa";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { colors } from "@/lib/utils";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import {
  ADD_PROFILE_IMAGE_ROUTE,
  HOST,
  REMOVE_PROFILE_IMAGE_ROUTE,
  UPDATE_PROFILE_ROUTE,
} from "@/utils/constants";

function index() {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [firstname, setfirstname] = useState("");
  const [lastname, setlastname] = useState("");
  const [image, setimage] = useState(null);
  const [selectedColor, setselectedColor] = useState(0);
  const [hovered, setHoveed] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userInfo.profileSetup) {
      setfirstname(userInfo.firstname);
      setlastname(userInfo.lastname);
      setselectedColor(userInfo.color);
    }
    if (userInfo.image) {
      setimage(userInfo.image);
    }
  }, [userInfo]);

  const validateProfileInfo = () => {
    if (!firstname) {
      toast.error("First Name is Required.");
      return false;
    }
    if (!lastname) {
      toast.error("Last Name is Required.");
      return false;
    }
    return true;
  };

  const saveChanges = async () => {
    if (validateProfileInfo()) {
      try {
        console.log(UPDATE_PROFILE_ROUTE);
        const responce = await apiClient.post(
          UPDATE_PROFILE_ROUTE,
          { firstname, lastname, color: selectedColor },
          { withCredentials: true }
        );
        if (responce.status === 200 && responce.data.user) {
          setUserInfo(responce.data.user);
          toast.success("Profile updated successfully!!!");
          navigate("/chat");
        }
      } catch (error) {}
    }
  };

  const handleNavigate = () => {
    if (userInfo.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("Please setup profile...");
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profile-image", file);
      formData.append("Host", HOST);
      const responce = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, {
        withCredentials: true,
      });
      if (responce.status === 200 && responce.data.image) {
        setUserInfo({ ...userInfo, image: responce.data.image });
        toast.success("Image updated successfully");
      }
    }
  };

  const handleImageDelete = async () => {
    if (userInfo.image) {
      const responce = await apiClient.post(
        REMOVE_PROFILE_IMAGE_ROUTE,
        { imageUrl: userInfo.image },
        {
          withCredentials: true,
        }
      );
      if (responce.status === 200 && responce.data) {
        setUserInfo({ ...userInfo, image: responce.data.image });
        toast.success("Profile Picture deleted successfully");
        setimage(null);
      }
    }
  };

  return (
    <div className=" bg-dark-1 h-[100vh] flex items-center justify-center  flex-col gap-10 ">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max ">
        <div>
          <IoArrowBack
            onClick={handleNavigate}
            className="text-4xl lg:text-6xl text-white"
          />
        </div>
        <div className="grid grid-cols-2 max-sm:grid-cols-1">
          <div
            onMouseEnter={() => setHoveed(true)}
            onMouseLeave={() => setHoveed(false)}
            className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center"
          >
            <Avatar className="h-32 w-32 md:h-48 md:w-48 rounded-full  overflow-hidden max-sm:mb-4">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`h-32 w-32 md:h-48 md:w-48 text-5xl border flex items-center justify-center  rounded-full ${getColor(
                    selectedColor
                  )}`}
                >
                  {firstname
                    ? firstname.split("").shift().toUpperCase()
                    : userInfo.email.split("").shift().toUpperCase()}
                </div>
              )}
            </Avatar>
            {hovered && (
              <div
                onClick={image ? handleImageDelete : handleFileInputClick}
                className="flex justify-center items-center bg-black/50 ring-fuchsia-50 rounded-full absolute inset-0 max-sm:mb-[1.5vh]"
              >
                {image ? (
                  <FaTrash className=" text-white text-3xl cursor-pointer " />
                ) : (
                  <FaPlus className=" text-white text-3xl cursor-pointer " />
                )}
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
              name="profile-image"
              accept=".png, .jpg, .jpeg, .svg, .webp"
            />
          </div>
          <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
            <div className="w-full">
              <Input
                placeholder="Email"
                type="email"
                value={userInfo.email}
                disabled
                className=" rounded-lg p-6 bg-dark-2 border-none"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="First Name"
                type="text"
                value={firstname}
                onChange={(e) => {
                  setfirstname(e.target.value);
                }}
                className=" rounded-lg p-6 bg-dark-2 border-none"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="Last Name"
                type="text"
                value={lastname}
                onChange={(e) => {
                  setlastname(e.target.value);
                }}
                className=" rounded-lg p-6 bg-dark-2 border-none"
              />
            </div>
            <div className="flex w-full gap-5">
              {colors.map((color, idx) => {
                return (
                  <div
                    onClick={() => {
                      setselectedColor(idx);
                    }}
                    className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${
                      selectedColor === idx && "outline outline-2 outline-white"
                    }`}
                    key={idx}
                  ></div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="w-full">
          <Button
            onClick={saveChanges}
            className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

export default index;
