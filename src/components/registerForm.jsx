import React, { useState } from "react";
import { registerUser } from "@/utils/authUtils";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    await registerUser(email, password);
    
    setEmail("");
    setPassword("");
  };

  return (
    <div className="items-center justify-center py-8 bg-black text-white">
      <p className="py-4 text-2xl font-bold text-center text-blue-600">
        Please Register or Login to start managing our library
      </p>
      <div className="w-full max-w-md p-8 mx-auto space-y-8 bg-white rounded shadow-lg">
        <h2 className="text-2xl font-bold text-center text-blue-600">
          Register
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="register-email"
              className="block text-sm font-medium text-blue-700"
            >
              Email
            </label>
            <input
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="register-password"
              className="block text-sm font-medium text-blue-700"
            >
              Password
            </label>
            <input
              id="register-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
