import React from 'react'
import AdminNavbar from '../components/AdminNavbar'
import { HiOutlineFaceSmile } from "react-icons/hi2";

function AdminProfile() {
  return (
    <div>
        <AdminNavbar/>
        Admin profile page
        <p>Waiting for Shreehari's design
            <HiOutlineFaceSmile className='inline-block ml-2 text-2xl'/>
        </p>
    </div>
  )
}

export default AdminProfile