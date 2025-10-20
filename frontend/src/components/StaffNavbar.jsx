import React from 'react'
import logo from '../assets/logo.png'
function StaffNavbar() {
  return (
     <div className="w-full top-0 h-16 p-4 flex justify-between items-center bg-teal-800 text-white font-medium font-['QuickSand'] lg:text-2xl md:text-lg  ">
        <div className='flex items-center gap-2 justify-between'>
      <img src={logo} alt="logo" className='w-8 h-8 max-w-full'/>
      <p>Staff Portal</p>
      </div>
      <p className='lg:text-4xl md:text-2xl '>Staff</p>
      <div className='flex gap-4 items-center'>
        <button>&#9776;</button>
        <p>Profile</p>
      </div>
      </div>
  )
}

export default StaffNavbar