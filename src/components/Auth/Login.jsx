import React, { useEffect, useState } from "react";
import BgImage from "../../assets/login.png";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Base_Url } from "@/config";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${Base_Url}api/v1/admin/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Login Successful!");
        localStorage.setItem("token", result.data);

        setTimeout(() => navigate("/home"), 1000);
      } else {
        toast.error(result.message || "Invalid credentials");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/home", { replace: true });
  }, [navigate]);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-[1000px] h-auto md:h-[85vh] bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">

        {/* LEFT SIDE */}
        <div className="w-full md:w-[50%] p-8 md:p-10 flex flex-col justify-center bg-gradient-to-b from-yellow-200 via-white to-white">

          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">
            Welcome Back
          </h1>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 mb-4 outline-none"
          />

          {/* PASSWORD FIELD */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 mb-6 outline-none pr-12"
            />

            {/* SHOW / HIDE PASSWORD TOGGLE */}
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c1.97 0 3.833-.54 5.42-1.48M9.88 9.88a3 3 0 0 0 4.24 4.24M6.228 6.228A10.45 10.45 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.5a10.52 10.52 0 0 1-4.293 5.307M6.228 6.228L3 3m3.228 3.228 12.544 12.544" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM2.036 12C3.423 7.943 7.36 4.5 12 4.5c4.64 0 8.578 3.443 9.964 7.5-1.386 4.057-5.324 7.5-9.964 7.5-4.64 0-8.578-3.443-9.964-7.5Z" />
                </svg>
              )}
            </span>
          </div>

          {/* LOGIN BUTTON */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-black transition 
              ${
                loading
                  ? "bg-yellow-500 cursor-not-allowed"
                  : "bg-yellow-400 hover:bg-yellow-500"
              }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5 animate-spin text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l3 3-3 3v-4a8 8 0 01-8-8z"
                  ></path>
                </svg>
                Processing...
              </div>
            ) : (
              "Submit"
            )}
          </button>
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="w-full md:w-[50%] h-[250px] md:h-full">
          <img
            src={BgImage}
            alt="Login"
            className="w-full h-full object-cover"
          />
        </div>

      </div>
    </div>
  );
}
