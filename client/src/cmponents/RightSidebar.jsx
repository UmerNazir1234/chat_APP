import React, { useContext, useEffect, useState } from "react"
import assets, { imagesDummyData } from "../assets/assets"
import { ChatContext } from "../../context/ChatContext"
import { AuthContext } from "../../context/AuthContext"

const RightSidebar = () => {

  const {selectedUser,message} = useContext(ChatContext)
  const {logout,onlineUser} = useContext(AuthContext)
  const [msgImages,setmsgImages]= useState([])

  // get all the images from the message and set to the state 
  useEffect(()=>{
    setmsgImages(message.filter(msg =>msg.image).map(msg=>msg.image))

  },[message])
  const [open, setOpen] = useState(false)

  

  if (!selectedUser) return null

  return (
    <>
      {/* --- Profile Image Button (Mobile Header) --- */}
      <div className="md:hidden flex items-center gap-2 p-3 border-b border-gray-700 bg-[#8185B2]/20">
        <img
          src={selectedUser?.profilePic || assets.avatar_icon}
          alt={`${selectedUser.fullName} profile`}
          className="w-10 h-10 rounded-full cursor-pointer border-2 border-violet-400"
          onClick={() => setOpen(true)}
        />
        <p className="text-white font-medium">{selectedUser.fullName}</p>
      </div>

      {/* --- Sidebar --- */}
      <div
        className={`fixed top-0 right-0 h-full w-4/5 sm:w-96 bg-[#8185B2]/90 text-white 
        shadow-lg transform transition-transform duration-300 z-50
        ${open ? "translate-x-0" : "translate-x-full"} 
        md:static md:translate-x-0 md:bg-[#8185B2]/10 md:shadow-none md:block`}
      >
        {/* Close button for mobile */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 md:hidden text-gray-200 text-xl"
        >
          ✕
        </button>

        {/* --- Profile section --- */}
        <div className="pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto">
          <img
            src={selectedUser?.profilePic || assets.avatar_icon}
            alt={`${selectedUser.fullName} profile`}
            className="w-20 aspect-[1/1] rounded-full"
          />
          <h1 className="px-10 text-xl font-medium mx-auto flex items-center gap-2">
            {onlineUser.includes(selectedUser._id) && <span className="w-2 h-2 rounded-full bg-green-500"></span>}
            {selectedUser.fullName}
          </h1>
          <p className="px-10 mx-auto">{selectedUser.bio}</p>
        </div>

        <hr className="border-[#ffffff50] my-4" />

        {/* --- Media section --- */}
        <div className="px-5 text-xs">
          <p>Media</p>
          <div className="mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80">
            {msgImages.map((url, index) => (
              <div
                key={index}
                onClick={() => window.open(url, "_blank")}
                className="cursor-pointer rounded"
              >
                <img src={url} alt={`media-${index}`} className="h-full rounded-md" />
              </div>
            ))}
          </div>
        </div>

        {/* --- Logout button --- */}
        <button
          onClick={() =>logout()} // replace with real handler
          className="absolute bottom-5 left-1/2 transform -translate-x-1/2
          bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none 
          text-sm font-light py-2 px-20 rounded-full cursor-pointer"
        >
          Logout
        </button>
      </div>
    </>
  )
}

export default RightSidebar
