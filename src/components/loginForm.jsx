import React, { useState } from "react";
import { login } from "@/utils/authUtils";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      setEmail("");
      setPassword("");
      // Optionally, navigate to another page or update state upon successful login
    } catch (error) {
      console.error("Error logging in:", error);
      // Optionally, display an error message to the user
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-lg">
        <h2 className="text-2xl font-bold text-center text-blue-600">
          Login
        </h2>
        <form id="login-form" onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="login-email"
              className="block text-sm font-medium text-blue-700"
            >
              Email
            </label>
            <input
              id="login-email"
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
              htmlFor="login-password"
              className="block text-sm font-medium text-blue-700"
            >
              Password
            </label>
            <input
              id="login-password"
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
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
