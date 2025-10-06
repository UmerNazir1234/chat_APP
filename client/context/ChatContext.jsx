import { useContext, useEffect, useState, createContext,} from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";


export const ChatContext = createContext();


export const ChatProvider = ({ children }) => {

  const [message, setMessage] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessage, setUnseenMessage] = useState({});

  const { socket, axios } = useContext(AuthContext);

// ✅ Get all users for sidebar
  const getUser = async () => {
    try {
      const { data } = await axios.get("/api/message/users"); 
      if (data.success) {
        setUsers(data.users);
        setUnseenMessage(data.unseenmessage || {});
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };
 // ✅ Get messages for selected user
  const getMessage = async (userId) => {
    try {
      const { data } = await axios.get(`/api/message/${userId}`);
      if (data.success) {
        setMessage(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

    // ✅ Send message to selected user
  const sendMessage = async (messageData) => {
    if (!selectedUser) return;
    try {
      const { data } = await axios.post(
        `/api/message/send/${selectedUser._id}`,
        messageData
      );
      if (data.success) {
        setMessage((prev) => [...prev, data.newMessage]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };
   // ✅ Subscribe to socket messages
  const subscribeToMessage = () => {
    if (!socket) return;
    socket.on("newMessage", (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        setMessage((prev) => [...prev, newMessage]);
        axios.put(`/api/message/mark/${newMessage._id}`);
      } else {
        setUnseenMessage((prev) => ({
          ...prev,
          [newMessage.senderId]: prev[newMessage.senderId] ? prev[newMessage.senderId] +1 : 1
        }));
      }
    });
  };
 const unsubscribeFromMessage = () => {
    if (socket) socket.off("newMessage");
  };

 

   useEffect(() => {
    subscribeToMessage();
    return () => unsubscribeFromMessage();
  }, [socket, selectedUser]);

  const value ={
    message,
    users,
    selectedUser,
    getUser,
    setMessage,
    sendMessage,
    setSelectedUser,
    unseenMessage,
    setUnseenMessage,
    getMessage,

    }
    return(
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}