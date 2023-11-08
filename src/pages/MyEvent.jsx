import React, { useEffect, useState } from "react";
import EventList from "../components/EventList";
import axios from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import { BaseUrl, apiAuth } from "../../utils/global";
import Loading from "../components/Loading";
import ErrorDet from "../components/ErrorDet";
import { toast } from "react-toastify";
const MyEvent = ({ userId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [sortedDailys, setSortedDailys] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const uid = sessionStorage.getItem("id");
  // console.log(uid);
  const notify = () =>
    toast.success("Status changed successfully!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  const pass = apiAuth.pass;
  const username = apiAuth.username;
  const getCookie = (name) => {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2) {
      return parts.pop().split(";").shift();
    }
  };
  const fetchEvents = async () => {
    const response = await axios.post(
      `${BaseUrl}get-events`,
      { uid: userId },
      {
        headers: {
          Authorization: "Basic " + btoa(`${username}:${pass}`),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    // console.log(response.data);
    return response.data.data;
  };

  const deleteEventMutation = useMutation(
    (id) =>
      axios.post(
        `${BaseUrl}delete-event`,
        { id },
        {
          headers: {
            Authorization: "Basic " + btoa(`${username}:${pass}`),
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      ),
    {
      onSuccess: (response, id) => {
        setSortedDailys((prevSortedDailys) =>
          prevSortedDailys.filter((daily) => daily.id !== id)
        );
        // toast.success("Event deleted successfully!", {
        //   position: "top-right",
        //   autoClose: 5000,
        //   hideProgressBar: false,
        //   closeOnClick: true,
        //   pauseOnHover: true,
        //   draggable: true,
        //   progress: undefined,
        //   theme: "light",
        // });
      },
    }
  );
  const statusUpdatesMutation = useMutation(
    (id) =>
      axios.post(
        `${BaseUrl}status-update`,
        { status: "active", id },
        {
          headers: {
            Authorization: "Basic " + btoa(`${username}:${pass}`),
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      ),
    {
      onSuccess: (response, id) => {
        setSortedDailys((prevSortedDailys) =>
          prevSortedDailys.filter((daily) => daily.id !== id)
        );
        notify();
      },
    }
  );
  const statusUpdateMutation = useMutation(
    (id) =>
      axios.post(
        `${BaseUrl}status-update`,
        { status: "completed", id },
        {
          headers: {
            Authorization: "Basic " + btoa(`${username}:${pass}`),
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      ),
    {
      onSuccess: (response, id) => {
        setSortedDailys((prevSortedDailys) =>
          prevSortedDailys.filter((daily) => daily.id !== id)
        );
        notify();
      },
    }
  );
  const {
    isLoading,
    isError,
    isFetching,
    data: dailys,
    error,
  } = useQuery(["events"], fetchEvents);

  useEffect(() => {
    if (dailys && dailys.length > 0) {
      let sortedData = [...dailys];
      if (sortOption === "Oldest") {
        sortedData.sort((a, b) => {
          const dateA = new Date(a.date.split("-").reverse().join("-"));
          const dateB = new Date(b.date.split("-").reverse().join("-"));
          return dateA - dateB;
        });
      } else if (sortOption === "Recent") {
        sortedData.sort((a, b) => {
          const dateA = new Date(a.date.split("-").reverse().join("-"));
          const dateB = new Date(b.date.split("-").reverse().join("-"));
          return dateB - dateA;
        });
      }
      setSortedDailys(sortedData);
    }
  }, [dailys, sortOption]);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (isLoading) {
    return <Loading />;
  }
  

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredDailys = sortedDailys.filter((daily) => {
    const searchRegex = new RegExp(searchQuery, "i");
    return searchRegex.test(daily.title) || searchRegex.test(daily.description);
  });
  const currentItems = filteredDailys.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="w-full max-w-[1400px] mx-auto flex-grow min-h-[80vh] p-4 md:p-8 relative max-lg:py-10">
      <div className="md:flex justify-between bg-white-100 rounded-md">
        <p>{filteredDailys.length} results</p>

        <div className="jobs_rit">
          <div className="flex gap-4">
            <div className="inp w-72">
              <input
                type="text"
                placeholder="Search event or description"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <div >
              <select onChange={handleSortChange} value={sortOption} className="w-full px-2 md:px-8 py-2 text-left mb-10 border border-gray-300 text-sm h-9 bg-white rounded">
                <option>Sort By</option>
                <option value="Oldest">Oldest</option>
                <option value="Recent">Recent</option>
                <option value="Date">Date</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-7 max-md:hidden bg-[#f5f7fa] p-2 font-medium text-[12px] text-[#686d77] mb-1">
        <div className="text-left col-span-2">Event</div>
        <div className="text-left col-span-2">Description</div>
        <div className="text-center col-span-1">Date</div>
        <div className="text-center col-span-1">Notification</div>
        <div className="text-center col-span-1">Action</div>
      </div>
      {isError ? (
  <ErrorDet />
) : (currentItems.length > 0 &&
        currentItems.map((daily) => (
          <EventList
            key={daily.id}
            title={daily.title}
            description={daily.description}
            date={daily.date}
            days={daily.days}
            deleteEvent={() => deleteEventMutation.mutate(daily.id)}
            id={daily.id}
            status={daily.event_status}
            edit={daily.event_status === 'active'}
            incompleteds={daily.event_status === 'completed'}
            statusUpdates={() => statusUpdatesMutation.mutate(daily.id)}
            statusUpdate={() => statusUpdateMutation.mutate(daily.id)}
          />
        )))}

     {/* Pagination */}
     {isError ? (
 ""
) : (
      <div className="flex justify-center mt-4">
        <nav>
          <ul className="pagination flex gap-2">
            {filteredDailys.length > 0 &&
              Array(Math.ceil(filteredDailys.length / itemsPerPage))
                .fill()
                .map((_, index) => (
                  <li
                    key={index}
                    className={`page-item bg-[#6a2af5]  px-2 py-1 rounded-sm text-white font-semibold  ${
                      currentPage === index + 1 ? "active" : "opacity-70"
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => paginate(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
          </ul>
        </nav>
      </div>
)}
    </div>
  );
};

export default MyEvent;
