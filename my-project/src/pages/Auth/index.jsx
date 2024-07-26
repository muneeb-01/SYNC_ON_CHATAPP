import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "../../lib/api-client";
import { SIGNUP_ROUTES, LOGIN_ROUTES } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";

function index() {
  const navigate = useNavigate();
  const { setUserInfo } = useAppStore();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");

  const validateLogin = () => {
    if (!email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required");
      return false;
    }
    return true;
  };

  const validateSignup = () => {
    if (!email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required");
      return false;
    }
    if (confirmPassword !== password) {
      toast.error("password and confirm password should be same");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (validateLogin()) {
      const responce = await apiClient.post(
        LOGIN_ROUTES,
        { email, password },
        { withCredentials: true }
      );
      if (responce.status === 201 && responce.data.user) {
        setUserInfo(responce.data.user);
        if (responce.data.user.profileSetup) {
          navigate("/chat");
        } else {
          navigate("/profile");
        }
      }
    }
  };
  const handleSignup = async () => {
    if (validateSignup()) {
      const responce = await apiClient.post(
        SIGNUP_ROUTES,
        { email, password },
        { withCredentials: true }
      );
      if (responce.status === 201 && responce.data.user) {
        setUserInfo(responce.data.user);
        navigate("/profile");
      }
    }
  };

  return (
    <div className="flex justify-center items-center w-[100vw] h-[100vh]">
      <div className="h-[80vh] border-2 border-white text-opacity-90 bg-white shadow-xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl 2xl:w-[35vw]">
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-2">
            <h1 className=" text-5xl md:text-5xl font-bold">Welcome</h1>
            <p className="font-sm text-center text-slate-700">
              Fill in the details to get started with the best chatapp!
            </p>
          </div>
          <div className="flex items-center justify-center w-full">
            <Tabs defaultValue="login" className=" w-3/4">
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                  value="login"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                  value="signup"
                >
                  Signup
                </TabsTrigger>
              </TabsList>
              <TabsContent className="flex flex-col gap-5 mt-10" value="login">
                <Input
                  placeholder="Email"
                  value={email}
                  type="email"
                  className="rounded-full p-6"
                  onChange={(e) => setemail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  value={password}
                  type="password"
                  className="rounded-full p-6"
                  onChange={(e) => setpassword(e.target.value)}
                />
                <Button className="rounded-full p-6" onClick={handleLogin}>
                  Login
                </Button>
              </TabsContent>
              <TabsContent className="flex flex-col gap-5 mt-10" value="signup">
                <Input
                  placeholder="Email"
                  value={email}
                  type="email"
                  className="rounded-full p-6"
                  onChange={(e) => setemail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  value={password}
                  type="password"
                  className="rounded-full p-6"
                  onChange={(e) => setpassword(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  value={confirmPassword}
                  type="password"
                  className="rounded-full p-6"
                  onChange={(e) => setconfirmPassword(e.target.value)}
                />
                <Button className="rounded-full p-6" onClick={handleSignup}>
                  Signup
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

export default index;
