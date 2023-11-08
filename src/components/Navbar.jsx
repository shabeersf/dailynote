import React, { useState, useCallback,useEffect } from "react";
import axios from "axios";
import Logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { Avatar, Dropdown} from 'flowbite-react';
import { BaseUrl, apiAuth,BaseImgUrl } from "../../utils/global";

const Navbar = ({ loggedIn, handleLogout , userId}) => {
  const navigate = useNavigate();
  const [userImage, setUserImage] = useState(null);
  const [usersName, setUsersName] = useState("");
  useEffect(() => {
    // Fetch user profile using 'get-profile' API
    const fetchUserProfile = async () => {
      try {
        
        const response = await axios.post(
          `${BaseUrl}get-profile`,
          { uid:userId },
          {
            headers: {
              Authorization:
                "Basic " + btoa(`${apiAuth.username}:${apiAuth.pass}`),
              "Content-Type": "application/x-www-form-urlencoded", // Update the Content-Type to "application/json"
            },
          }
        );
        if (response.data && response.data.data)
        {
          const { name } = response.data.data;
          setUsersName(name);
        }
        
       
        if (response.data && response.data.data && response.data.data.image) {
          // Access image property and set user image
          const images = response.data.data.image;
          const imageUrl = `${BaseImgUrl}photos/medium/${images}`;
          setUserImage(imageUrl);
        }
        else
        {
          const imageUrl = `${BaseImgUrl}photos/medium/user.png`;
          setUserImage(imageUrl);
        }
        
        
      } catch (error) {
        console.error("Error fetching user profile:", error);
        
      }
    };

    fetchUserProfile();
  });
  const handleLogoutClick = () => {
    handleLogout(); // Call the handleLogout function from parent
    navigate("/sign-in"); // Navigate to the sign-in page after logout
  };
  const [openNav, setOpenNav] = useState(false);

  const handleNav = useCallback(() => {
    setOpenNav((prevOpenNav) => !prevOpenNav);
  }, []);
  return (
    <header className=" w-full bg-[#F4F9FD] z-[9999] relative">
      <div className=" w-full max-w-[1400px] py-5 px-4 mx-auto flex flex-col md:flex-row justify-between items-center ">
        <div className="flex justify-between max-md:flex-grow max-md:w-full ">
          <Link to={"/"}>
            <img src={Logo} alt="logo.png" className=" max-w-[130px] w-full"/>
          </Link>
          <div onClick={() => handleNav()} className="md:hidden">
            {openNav ? <IoMdClose size={20} /> : <FaBars size={20} />}
          </div>
        </div>
        {loggedIn ? (
  <ul className="max-md:hidden flex gap-4 navstl">
  <li className="h-full">
    
    <div className="group flex gap-5">
    <Link to={"/"}  className=" w-full h-full ">Dashboard</Link>
    <Dropdown inline label="Events" >
    
    <Dropdown.Item> <Link to={"/my-events"}  className=" w-full h-full text-left min-w-[150px]">All Events</Link></Dropdown.Item>
    <Dropdown.Item><Link to={"/completed"}  className=" w-full h-full text-left min-w-[150px]">Completed Events</Link></Dropdown.Item>
    <Dropdown.Item><Link to={"/expired"}  className=" w-full h-full text-left min-w-[150px]">Expired Events</Link></Dropdown.Item>
    
    </Dropdown>
    </div>
    
  </li>
</ul>
) : null}

        <div className=" flex  gap-3 max-md:mt-3 max-md:justify-between ">
          {loggedIn ? (
            <>
              <Link
                className=" rounded-full bg-white border text-blue-400 font-medium border-blue-400 py-2 px-3 text-sm "
                to="/add-event"
              >
                Add Event
              </Link>
               <Dropdown inline label={<Avatar alt="User settings" img={userImage} rounded ><div className="space-y-1 font-medium dark:text-white">
        <div>
          {usersName}
        </div>
        
      </div></Avatar>}>
      
      <Dropdown.Item><Link to={"/my-profile"} className="z-[999999]" ><i className="fa-solid fa-user mr-2"></i>My Profile</Link></Dropdown.Item>
      <Dropdown.Item><Link to={"/reset-password"} className="z-[999999]" ><i className="fa-solid fa-rotate mr-2"></i>Reset Password</Link></Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item onClick={handleLogoutClick} className="z-[999999]"><i className="fa-solid fa-arrow-right-to-bracket mr-2" />
                Logout</Dropdown.Item>
    </Dropdown>
              
             

            </>
          ) : (
            <Link
              className=" rounded-full bg-[#0f85eb] border text-white font-medium border-blue-400 py-2 px-3 text-sm "
              to="/sign-in"
            >
              <i className="fa-solid fa-arrow-right-to-bracket mr-2" />
              Sign In
            </Link>
          )}
        </div>
      </div>

      <ul
        className={`md:hidden flex flex-col gap-4 py-2 max-md:w-screen max-md:h-screen border   absolute z-30 ease-in-out transition-all duration-300  bg-[#f3f4f6] opacity-100 ${
          openNav ? "left-0" : " -left-full"
        } `}
      >
        <li className=" font-semibold  pl-5 border-white border-b-2">
          <Link to={"/"} onClick={() => handleNav()}>
            Dashboard
          </Link>
        </li>
        <li className=" font-semibold  pl-5 border-white border-b-2">
          <Link to={"/completed"} onClick={() => handleNav()}>
            Completed
          </Link>
        </li>
        <li className=" font-semibold  pl-5 border-white border-b-2">
          <Link to={"/my-events"} onClick={() => handleNav()}>
            My Events
          </Link>
        </li>
        <li className=" font-semibold  pl-5 border-white border-b-2">
          <Link to={"/expired"} onClick={() => handleNav()}>
            Expired
          </Link>
        </li>
        
      </ul>
    </header>
  );
};

export default Navbar;
