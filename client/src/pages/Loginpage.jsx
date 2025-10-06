import React, { useContext, useState } from "react";
import assets from "../assets/assets.js";
import { AuthContext } from "../../context/AuthContext.jsx";

const Loginpage = () => {
  const [currState, setCurrState] = useState("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [showBio, setShowBio] = useState(false);

  const { login } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (currState === "signup") {
      // Step 1: Show bio field first
      if (!showBio) {
        setShowBio(true);
        return;
      }

      // Step 2: Validate all fields
      if (!name || !email || !password || !bio) {
        alert("Please fill all fields");
        return;
      }

      // Step 3: Call signup
      const formData = { fullName: name, email, password, bio };
      login("signup", formData);
      console.log("Sign Up Submitted:", formData);
    } else {
      // Login
      if (!email || !password) {
        alert("Email and password are required");
        return;
      }

      const formData = { email, password };
      login("login", formData);
      console.log("Login Submitted:", formData);
    }
  };

  const buttonClass =
    "bg-gradient-to-r from-purple-400 to-violet-600 text-white text-sm font-light py-2 px-6 rounded-full cursor-pointer hover:underline transition-all";

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center sm:justify-evenly max-sm:flex-col max-sm:gap-10 px-4 backdrop-blur-2xl">
      {/* Logo */}
      <img
        src={assets.logo_big}
        alt="Logo"
        className="w-[min(30vw,250px)] max-sm:w-32"
      />

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="border-2 bg-white/10 text-white border-gray-500 
        p-6 flex flex-col gap-6 rounded-lg shadow-lg 
        w-full max-w-sm sm:max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center">
          {currState === "signup" ? "Create Account" : "Login"}
        </h2>

        {currState === "signup" && (
          <>
            {!showBio ? (
              <>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="px-3 py-2 rounded bg-transparent border border-gray-400 focus:outline-none focus:border-white"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="px-3 py-2 rounded bg-transparent border border-gray-400 focus:outline-none focus:border-white"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="px-3 py-2 rounded bg-transparent border border-gray-400 focus:outline-none focus:border-white"
                />
              </>
            ) : (
              <textarea
                placeholder="Write your bio..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                required
                className="px-3 py-2 rounded bg-transparent border border-gray-400 focus:outline-none focus:border-white"
                rows="3"
              />
            )}

            <button type="submit" className={buttonClass}>
              {showBio ? "Finish Sign Up" : "Create Account"}
            </button>

            <p className="text-sm text-center">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setCurrState("login");
                  setShowBio(false);
                }}
                className="text-indigo-400 hover:underline cursor-pointer"
              >
                Login
              </button>
            </p>
          </>
        )}

        {currState === "login" && (
          <>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="px-3 py-2 rounded bg-transparent border border-gray-400 focus:outline-none focus:border-white"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="px-3 py-2 rounded bg-transparent border border-gray-400 focus:outline-none focus:border-white"
            />

            <button type="submit" className={buttonClass}>
              Login
            </button>

            <p className="text-sm text-center">
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setCurrState("signup");
                  setShowBio(false);
                }}
                className="text-indigo-400 hover:underline cursor-pointer"
              >
                Sign up
              </button>
            </p>
          </>
        )}
      </form>
    </div>
  );
};

export default Loginpage;
