import React, { useState, useEffect } from "react";
import axios from "axios";
import { BaseUrl, apiAuth,BaseImgUrl } from "../../utils/global";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const ProfileEdit = ({ userId }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [image, setImage] = useState(null);
  const [imageShow, setImageShow] = useState(null);
  const navigate = useNavigate();
  const pass = apiAuth.pass;

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
        
        const { name, email,mobile } = response.data.data; // Assuming API response contains name and email
        const images  = response.data.data.image; // Assuming API response contains name and email
        setUsername(name);
        setEmail(email);
        setMobile(mobile);
        if(images)
        {
          const imageUrl = `${BaseImgUrl}photos/medium/${images}`;
          setImage(imageUrl);
          setImageShow(imageUrl);
        }
        else
        {
          const imageUrl = `${BaseImgUrl}photos/medium/user.png`;
          setImage(imageUrl);
          setImageShow(imageUrl);
        }
        
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("An error occurred while fetching user profile.");
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleUsernameChange = (event) => {
    // console.log(event.target.value);
    setUsername(event.target.value);
  };
  const handleMobileChange = (event) => {
    // console.log(event.target.value);
    setMobile(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    const imageUrl = URL.createObjectURL(selectedImage);

  setImage(selectedImage);
  setImageShow(imageUrl);
    
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      // Update user profile (username and email) using 'update-profile' API
      
      const formData = new FormData();
      formData.append("uid", userId);
      formData.append("name", username);
      formData.append("email", email);
      formData.append("mobile", mobile);
      if (image) {
        formData.append("photo", image);
      }
      // console.log(formData.get("photo"));
      const response = await axios.post(`${BaseUrl}update-profile`, formData, {
        headers: {
          Authorization: "Basic " + btoa(`${apiAuth.username}:${apiAuth.pass}`),
          "Content-Type": "multipart/form-data",
        },
      });
  
      
      if (response.data.status === "Validation Error") {
        const validationErrors = response.data.data.err;
    
        // Handle the validation errors, e.g., show them on the form
        // console.log(response.data);
        
        // Loop through each validation error and display a toast for each
        validationErrors.forEach(errorMessage => {
            toast.error(errorMessage);
        });
    }
     else {
        // Handle successful profile update
        toast.success("Profile updated successfully!");
        navigate("/");
    }
    } catch (error) {
      // console.error("Error updating profile:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };
  

  return (
    <div className="w-full max-w-[1400px] mx-auto flex-grow min-h-[80vh] p-4 md:p-8 relative max-lg:py-10 justify-center items-center flex">
      <form
        className="w-full max-w-[500px] border border-slate-300 border-opacity-80 p-3 md:p-4 flex gap-3 flex-col"
        onSubmit={handleSubmit}
      >
        <h2 className="text-center w-full text-xl font-bold">Edit Profile</h2>
        <div class="flex flex-wrap justify-center">
  <div class="w-full flex items-center justify-center">
    <img src={imageShow} alt="..." class=" w-28 h-28 rounded-full object-cover " />
  </div>
</div>
        <div className="w-full flex gap-3 flex-col">
          <div className="w-full flex gap-0 flex-col">
            <label htmlFor="username" className="text-xs mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="text-xs border border-slate-300 border-opacity-70 outline-none px-2 py-2 pl-3"
              placeholder="Username"
              value={username}
              onChange={handleUsernameChange}
              required
            />
          </div>
          <div className="w-full flex gap-0 flex-col">
            <label htmlFor="email" className="text-xs mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="text-xs border border-slate-300 border-opacity-70 outline-none px-2 py-2 pl-3"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <div className="w-full flex gap-0 flex-col">
            <label htmlFor="mobile" className="text-xs mb-1">
              Mobile
            </label>
            <input
              type="mobile"
              id="mobile"
              className="text-xs border border-slate-300 border-opacity-70 outline-none px-2 py-2 pl-3"
              placeholder="Mobile"
              value={mobile}
              onChange={handleMobileChange}
              required
            />
          </div>
          <div className="w-full flex gap-0 flex-col">
            <label htmlFor="image" className="text-xs mb-1">
              Profile Image
            </label>
            <input
              type="file"
              id="image"
              className="text-xs outline-none"
              onChange={handleImageChange}
            />
          </div>
          <button
            className="bg-[#0f85eb] w-full p-2 text-white text-xs"
            type="submit"
          >
            Update Profile
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

export default ProfileEdit;
