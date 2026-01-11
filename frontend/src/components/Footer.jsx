import React from "react";
import logo from "../assets/logo.png";
import { CiMail } from "react-icons/ci";
import { MdPhoneInTalk } from "react-icons/md";

function Footer() {
  return (
    <footer className="w-full bg-teal-800 text-white font-['QuickSand'] p-6 mt-auto shadow-[0px_-4px_20px_0px_rgba(96,125,139,1.00)]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <p className="font-semibold text-lg">&copy; 2025 TraffRelief</p>
          <div className="flex gap-2 items-center justify-center md:justify-start mt-2">
            <CiMail className="text-xl" />
            <p className="text-sm">hollabhat2@gmail.com</p>
          </div>
          <div className="flex gap-2 items-center justify-center md:justify-start mt-1">
            <MdPhoneInTalk className="text-lg" />
            <p className="text-sm">+91-9658134574</p>
          </div>
        </div>
        
        <div className="flex justify-center items-center">
          <img
            src={logo}
            alt="TraffRelief Logo"
            className="w-16 h-16 md:w-20 md:h-20"
          />
        </div>
        
        <div className="text-center md:text-right">
          <p className="text-sm opacity-90">
            Empowering rehabilitation and recovery
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;