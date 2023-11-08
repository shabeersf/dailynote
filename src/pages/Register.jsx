import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BaseUrl, apiAuth } from "../../utils/global";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = ({ toggleLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    try {
      const response = await axios.post(
        `${BaseUrl}sign-up`,
        {
          name,
          email,
          password,
          mobile,
        },
        {
          headers: {
            Authorization:
              "Basic " + btoa(`${apiAuth.username}:${apiAuth.pass}`),
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      // console.log(response.data);
      if (response.data.status === "Validation Error") {
        const validationErrors = response.data.data.err;
    
        // Handle the validation errors, e.g., show them on the form
        // console.log(response.data);
        
        // Loop through each validation error and display a toast for each
        validationErrors.forEach(errorMessage => {
            toast.error(errorMessage);
        });
    }
     else  {
      sessionStorage.setItem("jwt", response.data.jwt);

      // You can optionally handle the JWT response here
      // const jwt = response.data.jwt;
      // localStorage.setItem("jwt", jwt);

      toggleLogin();
      navigate("/"); // Navigate to the home page
    }
    } catch (error) {
      console.error(error);
      toast.error("Signup failed. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      setName(value);
    } else if (name === "email") {
      setEmail(value);
    }else if (name === "mobile") {
      setMobile(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto flex-grow min-h-[80vh] p-4 md:p-8 relative max-lg:py-10 justify-center items-center flex">
      <form
        className="w-full max-w-[500px] border border-slate-300 border-opacity-80 p-3 md:p-4 flex gap-3 flex-col"
        onSubmit={handleSubmit}
      >
        <h2 className="text-center w-full text-xl font-bold">Signup</h2>
        <div className="w-full flex gap-3 flex-col">
          <div className="w-full flex gap-0 flex-col">
            <label htmlFor="name" className="text-sm mb-1">
              Name
            </label>
            <input required 
              type="text"
              id="name"
              className="text-sm border border-slate-300 border-opacity-70 outline-none px-2 py-2 pl-3"
              placeholder="Name"
              name="name"
              value={name}
              onChange={handleInputChange}
            />
          </div>
          <div className="w-full flex gap-0 flex-col">
            <label htmlFor="email" className="text-sm mb-1">
              Email
            </label>
            <input required 
              type="email"
              id="email"
              className="text-sm border border-slate-300 border-opacity-70 outline-none px-2 py-2 pl-3"
              placeholder="Email"
              name="email"
              value={email}
              onChange={handleInputChange}
            />
          </div>
          <div className="w-full flex gap-0 flex-col">
            <label htmlFor="mobile" className="text-sm mb-1">
              Mobile
            </label>
            <input required 
              type="text"
              id="mobile"
              className="text-sm border border-slate-300 border-opacity-70 outline-none px-2 py-2 pl-3"
              placeholder="Mobile"
              name="mobile"
              value={mobile}
              onChange={handleInputChange}
            />
          </div>
          <div className="w-full flex gap-0 flex-col">
            <label htmlFor="password" className="text-sm mb-1">
              Password
            </label>
            <input required 
              type="password"
              id="password"
              className="text-sm border border-slate-300 border-opacity-70 outline-none px-2 py-2 pl-3"
              placeholder="Password"
              name="password"
              value={password}
              onChange={handleInputChange}
            />
          </div>
          <div className="w-full flex gap-0 flex-col">
            <label htmlFor="confirmPassword" className="text-sm mb-1">
              Confirm Password
            </label>
            <input required 
              type="password"
              id="confirmPassword"
              className="text-sm border border-slate-300 border-opacity-70 outline-none px-2 py-2 pl-3"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleInputChange}
            />
          </div>
          <button
            className="bg-[#0f85eb] w-full p-2 text-white text-sm"
            type="submit"
          >
            Signup
          </button>
        </div>
        <p className="border-b pb-2 border-slate-500 border-opacity-80"></p>
        <h2 className="text-center w-full text-xl font-bold">
          Already have an account?
        </h2>
        <Link
          className="bg-[#ec6e57] w-full p-2 text-white text-sm font-medium text-center"
          to="/sign-in"
        >
          Sign In
        </Link>
      </form>
    </div>
  );
};

export default Register;
