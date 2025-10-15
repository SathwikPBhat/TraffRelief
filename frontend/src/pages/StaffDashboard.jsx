import React from 'react'
import Table from '../components/Table'
import Footer from '../components/Footer'
import StaffNavbar from '../components/StaffNavbar'
import { FaExternalLinkAlt } from "react-icons/fa";

function StaffDashboard() {
     const StaffData = [
    { name: "Alice", id: "C-101",status: "Active" },
    { name: "Bob", id: "C-102", status: "Inactive" },
    { name: "Charlie", id: "C-103",status: "Active" },
    { name: "David", id: "C-104", status: "Active" },
  ];

  return (
    <main className="w-full min-h-screen bg-stone-100 font-['QuickSand']flex flex-col">
    <StaffNavbar/>
    <div className='w-full p-8 flex flex-col justify-between gap-6'>
    <div className='flex flex-col justify-between gap-2 mb-4'>
        <div className='flex items-center justify-between'>
            <p className="font-medium text-3xl font-['QuickSand']">Assigned Victims</p>
            <FaExternalLinkAlt className='hover:cursor-pointer hover:scale-110'/>
        </div>
        <Table tableHeaders={["Name","ID","Status","Action"]} tableData = {StaffData} />
    </div>
    <div className='flex flex-col justify-between gap-2'>
        <div className='flex items-center justify-between'>
            <p className="font-medium text-3xl font-['QuickSand']">Pending Audits</p>
            <FaExternalLinkAlt className='hover:cursor-pointer hover:scale-110'/>
        </div>
        <Table tableHeaders={["Name","ID","Status","Action"]} tableData = {StaffData} />
    </div>
    </div>
    <Footer/>
    </main>
  )
}

export default StaffDashboard