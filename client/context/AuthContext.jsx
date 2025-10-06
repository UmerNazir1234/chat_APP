import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, settoken] = useState(localStorage.getItem("token"));
  const [authUser, setauthUser] = useState(null);
  const [onlineUser, setonlineUser] = useState([]);
  const [socket, setsocket] = useState(null);

  // ================= CHECK AUTH =================
  const checkAuth = async () => {
    try {
      if (!token) return; // prevent request if no token
      axios.defaults.headers.common["token"] = token;

      const { data } = await axios.get("/api/auth/check");
      if (data.success) {
        setauthUser(data.userData);
        connectSocket(data.userData);
      } else {
        setauthUser(null);
        localStorage.removeItem("token");
      }
    } catch (error) {
      toast.error(error.message);
      setauthUser(null);
    }
  };

  // ================= LOGIN / SIGNUP =================
  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials);
      if (data.success) {
        setauthUser(data.userData);
        connectSocket(data.userData);

        axios.defaults.headers.common["token"] = data.token;
        settoken(data.token);
        localStorage.setItem("token", data.token);

        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ================= LOGOUT =================
  const logout = async () => {
    localStorage.removeItem("token");
    settoken(null);
    setauthUser(null);
    setonlineUser([]);
    axios.defaults.headers.common["token"] = null;
    if (socket) socket.disconnect();
    toast.success("Logout Successfully");
  };

  // ================= UPDATE PROFILE =================
  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/auth/update-profile", body);
      if (data.success) {
        setauthUser(data.userData); // ✅ fixed (was data.user)
        toast.success("Profile updated successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ================= SOCKET =================
  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;

    const newSocket = io(backendUrl, {
      query: { userId: userData._id },
    });

    newSocket.connect();
    setsocket(newSocket);

    newSocket.on("getOnlineUsers", (userIds) => {
      setonlineUser(userIds);
    });
  };

  // ================= USE EFFECT =================
  useEffect(() => {
    checkAuth();
  }, [token]);

  const value = {
    axios,
    authUser,
    onlineUser,
    socket,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
