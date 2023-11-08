import React, { useState } from "react";
import { DatePicker } from "antd";
import axios from "axios";
import { BaseUrl, apiAuth } from "../../utils/global";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Event = ({ userId }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [days, setDays] = useState("");
  const [date, setDate] = useState(null);
  const navigate = useNavigate();
  const pass = apiAuth.pass;
  const username = apiAuth.username;

  // Date validation function
  const isDateValid = (selectedDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare only dates
    return selectedDate >= today;
  };

  const handleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleChanges = (event) => {
    setDays(event.target.value);
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  const notifySuccess = () => {
    toast.success("Event created successfully!", {
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isDateValid(date)) {
      toast.error("Please select a valid date (not in the past).", {
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
        `${BaseUrl}add-event`,
        {
          uid: userId,
          title: title,
          status: "active",
          description: description,
          date: date?.format("YYYY-MM-DD"), // Use format() method to convert moment date to string
          days: days,
        },
        {
          headers: {
            Authorization: "Basic " + btoa(`${username}:${pass}`),
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      // console.log("Event added:", response.data);
      // console.log(days, title, description, date?.format("YYYY-MM-DD"));

      // Reset form values
      setTitle("");
      setDescription("");
      setDays("");
      setDate(null);
      navigate("/");
      notifySuccess();
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto flex-grow min-h-[80vh] p-4 md:p-8 relative max-lg:py-10 justify-center items-center flex">
      <form
        className="w-full max-w-[500px] border border-slate-300 border-opacity-80 p-3 md:p-4 flex gap-3 flex-col"
        onSubmit={handleSubmit}
      >
        <h2 className="text-center w-full text-xl font-bold">Add Event</h2>
        <div className="w-full flex gap-3 flex-col">
          <div className="w-full flex gap-0 flex-col">
            <label htmlFor="title" className="text-xs mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              className="text-xs border border-slate-300 border-opacity-70 outline-none px-2 py-2 pl-3"
              placeholder="Title"
              value={title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="w-full flex max-md:flex-col gap-2">
            <div className="w-full md:flex-1">
              <label htmlFor="date" className="text-xs mb-1">
                Date
              </label>
              <div className="w-full  p-0 border border-slate-300 rounded-md">
                <DatePicker
                
                  className="w-full p-2"
                  placeholder="Enter Date"
                  onChange={handleDateChange} // Use onChange to update the selected date
                  required
                  format={"DD-MM-YYYY"}
                />
              </div>
            </div>
            <div className="w-full md:flex-1 h-full ">
              <label htmlFor="days" className="text-xs mb-1">
                No of Days
              </label>
              <input
                type="number"
                className="w-full h-[2.8rem] focus:outline-none border-slate-300 border rounded-md pl-4 no-arrow"
                min="1"
                max="9"
                id="days"
                onChange={handleChanges}
              />
            </div>
          </div>

          <div className="w-full flex gap-0 flex-col">
            <label htmlFor="desc" className="text-xs mb-1">
              Description
            </label>
            <textarea
              id="desc"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="text-xs border border-slate-300 border-opacity-70 outline-none px-2 py-2 pl-3"
              placeholder="Description"
              rows="5"
              cols="10"
              required
            ></textarea>
            <p>Characters left: {100 - description.length}</p>
          </div>
          <button
            className="bg-[#0f85eb] w-full p-2 text-white text-xs"
            type="submit"
          >
            Submit
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

export default Event;
