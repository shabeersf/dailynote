
import React, { useState, useEffect } from "react";
import { DatePicker } from "antd";
import axios from "axios";
import { BaseUrl, apiAuth } from "../../utils/global";
import dayjs from 'dayjs';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";

const UpdateEvent = ({ userId }) => {
  const { eventId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [days, setDays] = useState("");
  const [dates, setDates] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const navigate = useNavigate();
  const pass = apiAuth.pass;
  const username = apiAuth.username;

  const isDateValid = (selectedDate) => {
    const datePattern = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
 
    if (!datePattern.test(selectedDate)) {
      return false; // Date format is not valid
      
    }
  
    const currentDate = new Date();
    
    const [day, month, year] = selectedDate.split("-").map(Number);
    const selectedDateTime = new Date(year, month - 1, day); // Month is 0-based
    selectedDateTime.setHours(currentDate.getHours());
    selectedDateTime.setMinutes(currentDate.getMinutes());
    selectedDateTime.setSeconds(currentDate.getSeconds());
    selectedDateTime.setMilliseconds(currentDate.getMilliseconds());

    return selectedDateTime >= currentDate;
  };
   

  useEffect(() => {
    // Fetch event details
    const fetchEventDetails = async () => {
      try {
        const response = await axios.post(
          `${BaseUrl}get-event`,
          {
            ids: eventId,
            uids: userId,
          },
          {
            headers: {
              Authorization: "Basic " + btoa(`${username}:${pass}`),
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        const eventData = response.data.data;
        setTitle(eventData.title);
        setDescription(eventData.description);
        setDays(eventData.days);
        setDates(eventData.date);
        setDataLoaded(true);
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };

    fetchEventDetails();
  }, []);

  const handleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleChanges = (event) => {
    setDays(event.target.value);
  };

  const handleDateChange = (newDate) => {
    const formattedDate = newDate.format("DD-MM-YYYY");
    setDates(formattedDate);
  };

  const notifySuccess = () => {
    toast.success("Event updated successfully!", {
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

    if (!isDateValid(dates)) {
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
        `${BaseUrl}update-event`,
        {
          title: title,
          description: description,
          date: dayjs(dates, 'DD-MM-YYYY').format("YYYY-MM-DD"),
          days: days,
          uid: userId,
          id: eventId,
        },
        {
          headers: {
            Authorization: "Basic " + btoa(`${username}:${pass}`),
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      setTitle("");
      setDescription("");
      setDays("");
      setDates(null);
      navigate("/");
      // console.log(response);
      notifySuccess();
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto flex-grow min-h-[80vh] p-4 md:p-8 relative max-lg:py-10 justify-center items-center flex">
      {dataLoaded ? (
        <form
          className="w-full max-w-[500px] border border-slate-300 border-opacity-80 p-3 md:p-4 flex gap-3 flex-col"
          onSubmit={handleSubmit}
        >
          <h2 className="text-center w-full text-xl font-bold">Update Event</h2>
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
              <div className="w-full p-0 border border-slate-300 rounded-md">
                
              <DatePicker
  onChange={handleDateChange}
  required
  defaultValue={dates && dayjs(dates, 'DD-MM-YYYY')}
  format={'DD-MM-YYYY'}
  className="w-full h-[2rem] focus:outline-none border-slate-300 border rounded-md pl-4 no-arrow"
/>

              </div>
            </div>
            <div className="w-full md:flex-1 h-full">
              <label htmlFor="days" className="text-xs mb-1">
                No of Days
              </label>
              <input
                type="number"
                className="w-full h-[2rem] focus:outline-none border-slate-300 border rounded-md pl-4 no-arrow"
                min="1"
                max="9"
                id="days"
                onChange={handleChanges}
                value={days}
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
            Update
          </button>
        </div>
        </form>
      ) : (
        <p>Loading...</p>
      )}
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

export default UpdateEvent;
