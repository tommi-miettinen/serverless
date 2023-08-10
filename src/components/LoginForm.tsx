"use client";
import { useState } from "react";
import { useSpring, animated } from "@react-spring/web";

const SignUpForm = ({ setSigningUp }: { setSigningUp: (signingUp: boolean) => void }) => {
  const props = useSpring({
    from: { opacity: 0.5 },
    to: { opacity: 1 },
    config: {
      duration: 500,
    },
  });

  return (
    <animated.div className="flex flex-col gap-4" style={props}>
      <div>
        <label htmlFor="username" className="block mb-2 text-sm font-medium text-white">
          Username
        </label>
        <input
          type="text"
          id="username"
          className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">
          Password
        </label>
        <input
          type="password"
          id="password"
          className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          required
        />
      </div>
      <button className="px-5 py-2.5 bg-white hover:bg-white/90 text-black w-full rounded-lg mt-4">Luo tili</button>
      <span className="text-sm">
        Already have an account?
        <span className="font-semibold ml-2 underline cursor-pointer" onClick={() => setSigningUp(false)}>
          Sign In
        </span>
      </span>
    </animated.div>
  );
};

const LoginForm = ({ setSigningUp }: { setSigningUp: (signingUp: boolean) => void }) => {
  const props = useSpring({
    from: { opacity: 0.5 },
    to: { opacity: 1 },
    config: {
      duration: 500,
    },
  });
  return (
    <animated.div className="flex flex-col gap-4" style={props}>
      <div>
        <label htmlFor="username" className="block mb-2 text-sm font-medium text-white">
          Username
        </label>
        <input
          type="text"
          id="username"
          className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">
          Password
        </label>
        <input
          type="password"
          id="password"
          className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          required
        />
      </div>
      <button className="px-5 py-2.5 bg-white hover:bg-white/90 text-black w-full rounded-lg mt-4">Kirjaudu</button>
      <span className="text-sm">
        Dont have an account?
        <span className="font-semibold ml-2 underline cursor-pointer" onClick={() => setSigningUp(true)}>
          Sign Up
        </span>
      </span>
    </animated.div>
  );
};

const Form = () => {
  const [signingUp, setSigningUp] = useState(false);

  return (
    <div className="flex flex-col p-8 rounded-2xl border gap-4 w-[450px]">
      {signingUp ? <SignUpForm setSigningUp={setSigningUp} /> : <LoginForm setSigningUp={setSigningUp} />}
    </div>
  );
};

export default Form;
