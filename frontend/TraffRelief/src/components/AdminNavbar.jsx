import React from 'react'
import logo from '../assets/logo.png'
function AdminNavbar() {
  return (
     <div className="w-full top-0 h-16 p-4 flex justify-between items-center bg-teal-800 text-white font-medium font-['QuickSand'] text-2xl ">
        <div className='flex items-center gap-2 justify-between'>
      <img src={logo} alt="logo" className='w-8 h-8 max-w-full'/>
      <p>Admin Portal</p>
      </div>
      <p className='text-4xl'>Staff</p>
      <div className='flex gap-4 items-center'>
        <button>&#9776;</button>
        <p>Profile</p>
      </div>
      </div>
  )
}

export default AdminNavbar