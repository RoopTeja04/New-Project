import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../../stores/authStores";
import { Messages } from "primereact/messages";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const { email, password, setEmail, setPassword, loginAccount } = useAuthStore();
  const navigate = useNavigate();

  const [error, setError] = useState<string>("");
  const msgs = useRef<Messages>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!email && !password) {
      setError("all");
      return;
    }
    if (!email) {
      setError("email");
      return;
    }
    if (!emailRegex.test(email.trim())) {
      setError("invalidEmail");
      return;
    }
    if (!password) {
      setError("password");
      return;
    }

    setError("");
    setIsSubmitting(true);
    setIsSuccess(false);

    try {
      const response = await loginAccount({ email, password });
      if (response.status === 200) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSubmitting(false);
          navigate("/dashboard");
        }, 1500);
      }
    } catch (err: any) {
      setIsSubmitting(false);
      const backendError =
        err.response?.data?.message || "Login failed. Please try again.";
      msgs.current?.show({
        severity: "error",
        detail: backendError,
      });
    }
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen w-full">
        <div className="w-[80%] h-[80%] shadow-2xl flex relative overflow-hidden">
          <div className="w-1/2 h-full bg-blue-950 flex flex-col items-center justify-center text-white">
            <p className="text-3xl font-bold mb-4">Welcome Back!</p>
            <p className="text-gray-300 text-center px-10">Login to your account to continue building your workspace.</p>
          </div>
          <div className="w-1/2 h-full relative bg-white">
            <div className="absolute top-4 w-full px-8 z-10">
              <Messages ref={msgs} />
            </div>
            
            {isSubmitting && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm h-full">
                <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl w-full max-w-sm m-4">
                  {!isSuccess ? (
                    <div className="flex flex-col items-center text-center p-6">
                      <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-5">
                        <i
                          className="pi pi-spinner pi-spin text-blue-500"
                          style={{ fontSize: "2.5rem" }}
                        />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-800">Logging in...</h2>
                      <p className="text-gray-500 mt-2 mb-6">Please wait while we verify your credentials.</p>
                      <div className="w-full mt-2">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 animate-pulse w-full"></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center p-6">
                      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-5">
                        <i
                          className="pi pi-check-circle text-green-500"
                          style={{ fontSize: "2.5rem" }}
                        />
                      </div>
                      <h2 className="text-xl font-semibold text-green-600">Login Complete</h2>
                      <p className="text-gray-500 mt-2 mb-2">Redirecting to your dashboard...</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-col p-12 justify-center h-full space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Login</h2>
                <p className="text-gray-500 mt-1">Enter your details below to login to your account</p>
              </div>

              <div className="flex flex-col space-y-2 w-full mt-4">
                <label className="font-bold text-gray-700">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    className={`${error === "email" || error === "all" || error === "invalidEmail" ? "border-red-500" : "border-gray-300"} w-full border-2 rounded-lg p-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter your email"
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error === "email" || error === "all" || error === "invalidEmail") setError("");
                    }}
                    onKeyDown={(e) => { if(e.key === 'Enter') handleLogin(); }}
                  />
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
                </div>
                {(error === "email" || error === "all") && (
                  <p className="text-red-500 font-medium text-sm">Email is required</p>
                )}
                {error === "invalidEmail" && (
                  <p className="text-red-500 font-medium text-sm">Please enter a valid email address</p>
                )}
              </div>

              <div className="flex flex-col space-y-2 w-full">
                <label className="font-bold text-gray-700">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    className={`${error === "password" || error === "all" ? "border-red-500" : "border-gray-300"} w-full border-2 rounded-lg p-2.5 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter your password"
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error === "password" || error === "all") setError("");
                    }}
                    onKeyDown={(e) => { if(e.key === 'Enter') handleLogin(); }}
                  />
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
                  <button 
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
                  </button>
                </div>
                {(error === "password" || error === "all") && (
                  <p className="text-red-500 font-medium text-sm">Password is required</p>
                )}
              </div>

              <button
                onClick={() => handleLogin()}
                className="w-full bg-blue-700 text-white font-medium tracking-[0.7px] rounded-lg p-3 mt-4 cursor-pointer hover:bg-blue-800 transition-colors"
              >
                Login
              </button>
              
              <div className="text-center mt-4">
                <p className="text-gray-600">
                  Don't have an account? <Link to="/create" className="text-blue-600 font-semibold hover:underline">Create one</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
