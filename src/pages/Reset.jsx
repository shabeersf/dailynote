import React, { useState } from "react";
import axios from "axios";
import { BaseUrl, apiAuth } from "../../utils/global";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Reset = ({ userId }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const pass = apiAuth.pass;
  const username = apiAuth.username;

  const handleChangeOldPassword = (event) => {
    setOldPassword(event.target.value);
  };

  const handleChangeNewPassword = (event) => {
    setNewPassword(event.target.value);
  };

  const handleChangeConfirmPassword = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.", {
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
        `${BaseUrl}reset-password`,
        {
          uid: userId,
          old_pass: oldPassword,
          new_pass: newPassword,
        },
        {
          headers: {
            Authorization: "Basic " + btoa(`${username}:${pass}`),
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      // Check the response status code
      if (response.status === 200) {
        // Reset form values
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        navigate("/"); // You might want to navigate to a different page after password reset
        // Notify success
        toast.success("Password reset successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }  else {
        // Handle other error cases here
        toast.error("An error occurred. Please try again later.", {
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
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Old password is incorrect.", {
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

  return (
    <div className="w-full max-w-[1400px] mx-auto flex-grow min-h-[80vh] p-4 md:p-8 relative max-lg:py-10 justify-center items-center flex">
      <form
        className="w-full max-w-[500px] border border-slate-300 border-opacity-80 p-3 md:p-4 flex gap-3 flex-col"
        onSubmit={handleSubmit}
      >
        <h2 className="text-center w-full text-xl font-bold">Reset Password</h2>
        <div className="w-full flex gap-3 flex-col">
          <div className="w-full flex gap-0 flex-col">
            <label htmlFor="oldPassword" className="text-xs mb-1">
              Old Password
            </label>
            <input
              type="password"
              id="oldPassword"
              className="text-xs border border-slate-300 border-opacity-70 outline-none px-2 py-2 pl-3"
              placeholder="Old Password"
              value={oldPassword}
              onChange={handleChangeOldPassword}
              required
            />
          </div>
          <div className="w-full flex gap-0 flex-col">
            <label htmlFor="newPassword" className="text-xs mb-1">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              className="text-xs border border-slate-300 border-opacity-70 outline-none px-2 py-2 pl-3"
              placeholder="New Password"
              value={newPassword}
              onChange={handleChangeNewPassword}
              required
            />
          </div>
          <div className="w-full flex gap-0 flex-col">
            <label htmlFor="confirmPassword" className="text-xs mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="text-xs border border-slate-300 border-opacity-70 outline-none px-2 py-2 pl-3"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={handleChangeConfirmPassword}
              required
            />
          </div>
          <button
            className="bg-[#0f85eb] w-full p-2 text-white text-xs"
            type="submit"
          >
            Reset Password
          </button>
        </div>
      </form>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Reset;
