"use client";
import { useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import SignWithGoogleButton from "./SignWithGoogleButton";
import axios from "axios";
import { login } from "../store/userStore";

const SignUpForm = ({ setSigningUp }: { setSigningUp: (signingUp: boolean) => void }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    try {
      const result = await axios.post("/api/auth/signup", { username, password });
      console.log(result);
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  const props = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: {
      duration: 300,
    },
  });
  return (
    <animated.div className="flex flex-col gap-4" style={props}>
      <div>
        <label htmlFor="username" className="block mb-2 text-sm font-medium text-white">
          Username
        </label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          id="username"
          className="bg-gray-800  text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">
          Password
        </label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          id="password"
          className="bg-gray-800  text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          required
        />
      </div>
      <button
        onClick={handleSignUp}
        className="px-5 py-2.5 bg-indigo-300 hover:bg-opacity-90 text-black font-medium w-full rounded-lg mt-4"
      >
        Luo tili
      </button>
      <span className="text-sm">
        Already have an account?
        <span className="font-semibold ml-1 underline cursor-pointer" onClick={() => setSigningUp(false)}>
          Sign In
        </span>
      </span>
    </animated.div>
  );
};

const LoginForm = ({ setSigningUp }: { setSigningUp: (signingUp: boolean) => void }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const props = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: {
      duration: 300,
    },
  });
  return (
    <animated.div className="flex flex-col gap-4" style={props}>
      <div>
        <label htmlFor="username" className="block mb-2 text-sm font-medium text-white">
          Username
        </label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          id="username"
          className="bg-gray-800  text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">
          Password
        </label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          id="password"
          className="bg-gray-800  text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          required
        />
      </div>
      <button
        onClick={() => login({ username, password })}
        className="px-5 py-2.5 bg-indigo-300 hover:bg-opacity-90 text-black font-medium w-full rounded-lg mt-4"
      >
        Kirjaudu
      </button>
      <SignWithGoogleButton />
      <span className="text-sm">
        Dont have an account?
        <span className="font-semibold ml-1 underline cursor-pointer" onClick={() => setSigningUp(true)}>
          Sign Up
        </span>
      </span>
    </animated.div>
  );
};

const Form = () => {
  const [signingUp, setSigningUp] = useState(false);

  return (
    <div className="flex flex-col p-8 rounded-2xl border border-gray-700 gap-4 w-[450px] overflow-hidden">
      {signingUp ? <SignUpForm setSigningUp={setSigningUp} /> : <LoginForm setSigningUp={setSigningUp} />}
    </div>
  );
};

export default Form;
