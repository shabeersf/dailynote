import React from "react";
import { Link } from "react-router-dom";
import {AiFillMail} from "react-icons/ai"
import {BsFacebook,BsTwitter,BsLinkedin} from "react-icons/bs"
const Footer = () => {
  return (
    <div className=" w-full border-t border-slate-300 pt-3 ">
      <div className=" w-full max-w-[1400px] py-5 px-4 mx-auto flex max-md:flex-col justify-between items-center gap-3 ">
        
        <div className="flex gap-2 items-center">
          <div className=" text-xs font-extralight opacity-80">
            © {new Date().getFullYear()} Dailynotedairy All Rights Reserved.
          </div>
          <div className=" text-xs font-extralight opacity-80">
           <Link to={"/about-us"} className=" underline">About Us</Link> |
           <Link to={"/terms-and-conditions"} className="ml-2 underline">Terms & Conditions</Link> |
           <Link to={"/privacy-policy"} className="ml-2 underline">Privacy Policy</Link> 
          </div>
        </div>
        <div className="flex justify-between items-center gap-2">
          <div className="flex gap-2 items-center"><AiFillMail size={18} className="text-red-500" /><a className="text-xs font-extralight opacity-80" href="mailto:info@dailnotedairy.com">info@dailnotedairy.com.</a></div>
       
        <div className=" text-xs font-extralight opacity-80 flex items-center gap-2">
        <a  href="https://www.facebook.com/" target="_blank"><BsFacebook size={18}/></a>
        <a  href="https://www.instagram.com/" target="_blank"><BsTwitter size={18}/></a>
        <a  href="https://www.linkedin.com/" target="_blank"><BsLinkedin size={18}/></a>
          </div>
          </div>
      </div>
    </div>
  );
};

export default Footer;
