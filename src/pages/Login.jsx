import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BaseUrl, apiAuth } from "../../utils/global";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = ({ toggleLogin }) => {
  const [forget, setForget] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [forgotEmail, setForgotEmail] = useState(""); // State for forgot email input
  const [forgotEmailError, setForgotEmailError] = useState(""); // State for forgot email validation error
  const navigate = useNavigate();

  useEffect(() => {
    // Check if "Remember Me" data exists in localStorage
    const storedEmail = localStorage.getItem("email");
    const storedPassword = localStorage.getItem("password");

    if (storedEmail && storedPassword) {
      setEmail(storedEmail);
      setPassword(storedPassword);
      setRememberMe(true);
    }
  }, []);

  const notifyError = () => {
    toast.error("Login failed. Please try again.", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email and password
    let isValid = true;

    if (email.trim() === "") {
      setEmailError("Email is required");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (password.trim() === "") {
      setPasswordError("Password is required");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!isValid) {
      return; // Do not proceed if there are validation errors
    }

    try {
      const response = await axios.post(
        `${BaseUrl}login-user`,
        { email, password },
        {
          headers: {
            Authorization: "Basic " + btoa(`${apiAuth.username}:${apiAuth.pass}`),
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const user = response.data.data;
      const user_id = user.id;

      sessionStorage.setItem("jwt", response.data.jwt);

      if (rememberMe) {
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);
      } else {
        localStorage.removeItem("email");
        localStorage.removeItem("password");
      }

      toggleLogin();
      navigate("/");
    } catch (error) {
      console.error(error);
      notifyError();
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();

    // Validate forgot email
    if (forgotEmail.trim() === "") {
      setForgotEmailError("Email is required");
      return;
    } else {
      setForgotEmailError("");
    }

    try {
      // Call your API to send the forgot password email
      const response = await axios.post(
        `${BaseUrl}forgotmail`,
        { email: forgotEmail },
        {
          headers: {
            Authorization: "Basic " + btoa(`${apiAuth.username}:${apiAuth.pass}`),
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
// console.log(response.data);
const toastConfig = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
};

if (response.data.response_code === 200) {
  toast.success("Password reset email sent successfully!", toastConfig);
  setForget(false);
} else {
  toast.error("Wrong email address!", toastConfig);
}

    } catch (error) {
      console.error(error);
      notifyError();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto flex-grow min-h-[80vh] p-4 md:p-8 relative max-lg:py-10 justify-center items-center flex">
      <form
        className="w-full max-w-[500px] border border-slate-300 border-opacity-80 p-3 md:p-4 flex gap-3 flex-col"
        onSubmit={handleSubmit}
      >
        <h2 className="text-center w-full text-xl font-bold">Login</h2>
        <div className="w-full flex gap-3 flex-col">
          <div className="w-full flex gap-0 flex-col">
            <label htmlFor="email" className="text-sm mb-1">
              Email or Mobile
            </label>
            <input
              type="text"
              id="email"
              className={`text-sm border ${
                emailError ? 'border-red-500' : 'border-slate-300'
              } border-opacity-70 outline-none px-2 py-2 pl-3`}
              placeholder="Email"
              name="email"
              value={email}
              onChange={handleInputChange}
            />
            {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
          </div>
          <div className="w-full flex gap-0 flex-col">
            <label htmlFor="password" className="text-sm mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              className={`text-sm border ${
                passwordError ? 'border-red-500' : 'border-slate-300'
              } border-opacity-70 outline-none px-2 py-2 pl-3`}
              placeholder="Password"
              name="password"
              value={password}
              onChange={handleInputChange}
            />
            {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
          </div>
          <button
            className="bg-[#0f85eb] w-full p-2 text-white text-sm"
            type="submit"
          >
            Login
          </button>
          <div className="flex justify-between items-center">
            <p onClick={() => setForget(!forget)} className="cursor-pointer">
              Forgot your password?
            </p>
            <label htmlFor="rememberMe" className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={rememberMe}
                onChange={handleRememberMeChange}
              />
              <span className="text-xs ml-1">Remember me</span>
            </label>
          </div>
          {forget && (
            <div>
              <input
                type="text"
                id="forg"
                className={`text-sm border ${
                  forgotEmailError ? 'border-red-500' : 'border-slate-300'
                } border-opacity-70 outline-none px-2 py-2 pl-3 w-full mb-3`}
                placeholder="Enter Email id "
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
              />
              {forgotEmailError && (
                <p className="text-red-500 text-xs mt-1">{forgotEmailError}</p>
              )}
              <button
                className="bg-black w-full p-2 text-white text-sm font-medium"
                type="button"
                onClick={handleForgotSubmit}
              >
                Submit
              </button>
            </div>
          )}
        </div>
        <p className="border-b pb-2 border-slate-500 border-opacity-80"></p>
        <h2 className="text-center w-full text-xl font-bold">
          Don't Have an Account..?
        </h2>
        <Link
          className="bg-[#ec6e57] w-full p-2 text-white text-sm font-medium text-center"
          to="/register"
        >
          Register Free
        </Link>
      </form>
      <ToastContainer /> {/* Toast notifications */}
    </div>
  );
};

export default Login;
