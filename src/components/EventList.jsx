import React from "react";
import { FiEdit } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const EventList = ({
  title,
  description,
  date,
  days,
  statusUpdate,
  statusUpdates,
  id,
  edit,
  deleteEvent,
  status,
  incompleteds
}) => {
  const currentDate = new Date(); // Get the current date

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Call the deleteEvent function if the user confirms
        deleteEvent(id);
        Swal.fire("Deleted!", "Your event has been deleted.", "success");
      }
    });
  };

  const isPastEvent = new Date(date) < currentDate; // Compare event date with current date
  const isCompleted = status === "completed"; // Check if status is completed

  return (
    <div
      className={` overflow-x-scroll no-scrollbar grid grid-cols-7 p-2 text-[13px] max-md:mb-3 mb-1 box-border border-l-2 bg-[#fbf9ff] border-[#6a2af5] max-md:gap-3 ${
        isPastEvent ? "text-red-500" : isCompleted ? "text-green-400" : ""
      }`}
    >
      <div className="md:col-span-2 col-span-7 max-md:text-base  max-md:text-[#203259] max-md:font-bold  pr-1">
        {title}
      </div>
      <div className="md:col-span-2 col-span-7 pr-1 max-md:text-sm max-md:text-gray-500">
        {description}
      </div>
      <div className="md:text-center col-span-3 sm:col-span-2 md:col-span-1 pr-1">
        {date}
      </div>
      <div className="md:text-center col-span-2 md:col-span-1 pr-1">
        {days} day(s)
      </div>
      <div className="md:text-center max-sm:col-span-7 col-span-2 md:col-span-1 flex justify-center items-center gap-2">
        {edit && (
          <button
            className="px-3 py-1 bg-[#22ab59] text-white "
            onClick={() => statusUpdate(id)}
          >
            Complete
          </button>
        ) }
        {
         incompleteds && (
          <button
            className="px-2 py-1 bg-red-500 text-white "
            onClick={() => statusUpdates(id)}
          >
            Incomplete
          </button>
        ) }
        {deleteEvent && (
          <div className=" flex gap-2 items-center justify-center">
            <Link to={`/update-event/${id}`}>
              <FiEdit
                size={23}
                className="p-1 bg-blue-600 text-white rounded-sm"
              />
            </Link>
            <div onClick={handleDelete}>
              <FaTrash
                size={23}
                className="p-1 bg-red-600 text-white rounded-sm cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventList;
