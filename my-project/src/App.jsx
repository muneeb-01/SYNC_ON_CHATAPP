import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth/index";
import Chat from "./pages/chat/index";
import Profile from "./pages/profile/index";
import { useAppStore } from "./store";
import { GET_USER_INFO } from "./utils/constants";
import { apiClient } from "./lib/api-client";

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isPrivateRoute = !!userInfo;
  return isPrivateRoute ? children : <Navigate to="/auth" />;
};

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthRoute = !!userInfo;
  return isAuthRoute ? <Navigate to="/chat" /> : children;
};

export default function Home() {
  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const responce = await apiClient.get(GET_USER_INFO, {
          withCredentials: true,
        });
        if (responce.status === 200 && responce.data.user) {
          setUserInfo(responce.data.user);
        } else {
          setUserInfo(undefined);
        }
      } catch (error) {
        setUserInfo(undefined);
      } finally {
        setLoading(false);
      }
    };

    if (!userInfo) {
      getUserInfo();
    } else {
      setLoading(false);
    }
  }, [userInfo, setUserInfo]);

  if (loading === true) return <>Loading...</>;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={
            <AuthRoute>
              <Auth />
            </AuthRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route path="/*" element={<Navigate to={"/auth"} />} />
      </Routes>
    </BrowserRouter>
  );
}
