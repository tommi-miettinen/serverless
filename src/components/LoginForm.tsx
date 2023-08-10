const LoginForm = () => {
  return (
    <div className="flex flex-col p-8 rounded-2xl border gap-4 w-[450px]">
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
    </div>
  );
};

export default LoginForm;
