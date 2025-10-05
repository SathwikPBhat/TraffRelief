import React from 'react'
import logo from '../assets/logo.png'
import {Link} from 'react-router-dom'
import { CiMail } from "react-icons/ci";
import { MdPhoneInTalk } from "react-icons/md";

function Footer() {
  return (
    <div className="w-full h-30 bg-teal-800 text-white font-['QuickSand'] p-6 flex items-center justify-between mt-5">
    <div >
    <p>&copy; 2025 TraffRelief</p>
    <div className='flex gap-1 items-center'>
        <CiMail className='text-2xl'/>
        <p>hollabhat2@gmail.com</p>
    </div>
    <div className='flex gap-1 items-center'>
        <MdPhoneInTalk/>
        +91-9658134574
    </div>
    </div>
    <div className='flex justify-center items-center'>
        <img src={logo} alt="logo" className='w-20 h-20' />
    </div>
    <div className='grid grid-cols-2 items-center gap-2'>
    <Link to='/'>Dashboard</Link>
    <Link to='/'>Centers</Link>
    <Link to='/'>Staff</Link>
    <Link to='/'>Notification</Link>
    <Link to='/'>Victims</Link>
    <Link to='/'>Setting</Link>
    </div>

    </div>
  )
}

export default Footer