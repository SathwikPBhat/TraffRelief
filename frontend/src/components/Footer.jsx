import React from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { CiMail } from "react-icons/ci";
import { MdPhoneInTalk } from "react-icons/md";

function Footer() {
  return (
    <div className="w-full  bg-teal-800 text-white font-['QuickSand'] p-6 flex items-center justify-between mt-5 gap-3 shadow-[0px_-4px_20px_0px_rgba(96,125,139,1.00)] ">
      <div>
        <p>&copy; 2025 TraffRelief</p>
        <div className="flex gap-1 items-center">
          <CiMail className="text-2xl" />
          <p>hollabhat2@gmail.com</p>
        </div>
        <div className="flex gap-1 items-center">
          <MdPhoneInTalk />
          +91-9658134574
        </div>
      </div>
      <div className="flex justify-center items-center">
        <img
          src={logo}
          alt="logo"
          className="lg:w-20 lg:h-20 md:h-15 md:w-10 h-0 w-0"
        />
      </div>
      <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 items-center gap-2">
        <Link to="/">Dashboard</Link>
        <Link to="/">Centers</Link>
        <Link to="/">Staff</Link>
        <Link to="/">Notification</Link>
        <Link to="/">Victims</Link>
        <Link to="/">Setting</Link>
      </div>
    </div>
  );
}

export default Footer;
