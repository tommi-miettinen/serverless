"use client";
import { useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import SignWithGoogleButton from "./SignWithGoogleButton";
import { login, useUserStore, signUp, setSigningUp, LoginState } from "../store/userStore";
import Spinner from "./Spinner";

const loginLabels: Record<LoginState, JSX.Element> = {
  [LoginState.LoginIdle]: <span>Login</span>,

  [LoginState.LoggingIn]: (
    <>
      <span>Logging in</span>
      <Spinner className="font-semibold w-5 h-5 translate-y-[1.5px] text-white fill-black" />
    </>
  ),
  [LoginState.LoginDone]: <span>Login</span>,
  [LoginState.SignUpIdle]: <span>Create account</span>,
  [LoginState.SigningUp]: (
    <>
      <span>Signing up</span>
      <Spinner className="font-semibold w-5 h-5 translate-y-[1.5px] text-white fill-black" />
    </>
  ),

  [LoginState.SignUpDone]: (
    <>
      <span>Account created</span>
      <svg
        className="duration-200 scale w-5 h-5 translate-y-[1.5px] mr-2 text-black-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
      </svg>
    </>
  ),
};

const UnifiedForm = () => {
  const loginState = useUserStore((state) => state.loginState);
  const error = useUserStore((state) => state.error);
  const signingUp = useUserStore((state) => state.signingUp);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [spring] = useSpring(
    () => ({
      from: { opacity: 0 },
      to: { opacity: 1 },
      config: {
        duration: 300,
      },
      reset: true,
    }),
    [signingUp]
  );

  const handleSubmit = () => (signingUp ? signUp({ username, password }) : login({ username, password }));

  return (
    <div className="flex flex-col p-8 rounded-2xl sm:border border-gray-700 gap-4 w-full sm:w-[450px] overflow-hidden">
      <animated.div className="w-full flex flex-col gap-4" style={spring}>
        <p className="text-sm text-red-600 dark:text-red-500">
          <span className="font-medium">{error}</span>
        </p>

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-white">
            Username
          </label>
          <input
            value={username}
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            id="username"
            className="autofill:bg-gray-800 bg-gray-800  text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
            className="autofill:bg-gray-800 bg-gray-800 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>
        <button
          onClick={handleSubmit}
          className="px-5 py-2.5 bg-indigo-300 hover:bg-opacity-90 text-black font-medium w-full rounded-lg mt-4 flex items-center justify-center gap-2"
        >
          {loginLabels[loginState]}
        </button>
        {signingUp ? null : <SignWithGoogleButton />}
        <span className="text-sm text-white">
          {signingUp ? "Already have an account?" : "Dont have an account?"}
          <span className="font-semibold ml-1 underline cursor-pointer" onClick={() => setSigningUp(!signingUp)}>
            {signingUp ? "Sign In" : "Sign Up"}
          </span>
        </span>
      </animated.div>
    </div>
  );
};

export default UnifiedForm;
