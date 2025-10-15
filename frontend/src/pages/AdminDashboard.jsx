import React from 'react'
import AdminNavbar from '../components/AdminNavbar'
import { FaExternalLinkAlt } from "react-icons/fa";
import ActivityTable from '../components/ActivityTable';
import Footer from '../components/Footer';

function AdminDashboard() {

    const ActivityData = [
        { date: "12-10-2025", activity: "Victim Assigned",details: "Victim name: Shreehari V Bhat"},
        { date: "10-10-2025", activity: "Victim Assigned",details: "Victim name: Abhishek Holla"},
        { date: "1-10-2025", activity: "Victim Assigned",details: "Victim name: Monish Malpe"},
        { date: "4-10-2025", activity: "Victim Assigned",details: "Victim name: Arnav Shetty"}
    ];

  return (
    <main className="w-full min-h-screen font-['QuickSand'] bg-stone-100">
    <AdminNavbar/>
    <div className='flex flex-col justify-evenly p-8 '>
        <div className='flex flex-col justify-evenly gap-4'>
            <p className='text-3xl font-medium'>Overview</p>
            <div className='grid grid-rows-2 gap-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 xs:grid-cols-1'>

                <div className='p-2 rounded-xl border border-gray-400 shadow-[0px_4px_4px_0px_rgba(0,105,92,1.00)] flex flex-col gap-2'>
                <div className='flex justify-between items-center'>
                    <p className='font-bold text-lg'>Victims</p>
                    <FaExternalLinkAlt className='hover:cursor-pointer hover:scale-110'/>
                </div>
                <div className='flex flex-col justify-evenly'>
                <p>Total: </p>
                <p>Released: </p>
                <p>Progressed: </p>
                </div>
                </div>

                <div className='p-2 rounded-xl border border-gray-400 shadow-[0px_4px_4px_0px_rgba(0,105,92,1.00)] flex flex-col gap-2'>
                <div className='flex justify-between items-center'>
                    <p className='font-bold text-lg'>Staff</p>
                    <FaExternalLinkAlt className='hover:cursor-pointer hover:scale-110'/>
                </div>
                <div className='flex flex-col justify-evenly'>
                <p>Total: </p>
                <p>Working: </p>
                <p>Assigned: </p>
                </div>
                </div>

                <div className='p-2 rounded-xl border border-gray-400 shadow-[0px_4px_4px_0px_rgba(0,105,92,1.00)] flex flex-col gap-2'>
                <div className='flex justify-between items-center'>
                    <p className='font-bold text-lg'>Centers</p>
                    <FaExternalLinkAlt className='hover:cursor-pointer hover:scale-110'/>
                </div>
                <div className='flex flex-col justify-evenly'>
                <p>Total: </p>
                <p>Active: </p>
                <p>Under Construction: </p>
                </div>
                </div>

                <div className='p-2 rounded-xl border border-gray-400 shadow-[0px_4px_4px_0px_rgba(0,105,92,1.00)] flex flex-col  gap-2 lg:col-start-1 lg:col-end-3'>
                <div className='flex justify-between items-center'>
                    <p className='font-bold text-lg'>Alerts</p>
                    <FaExternalLinkAlt className='hover:cursor-pointer hover:scale-110'/>
                </div>
                <div className='flex flex-col justify-evenly'>
                <p>Total: </p>
                </div>
                </div>

                <div className='p-2 rounded-xl border border-gray-400 shadow-[0px_4px_4px_0px_rgba(0,105,92,1.00)] flex flex-col gap-2  lg:col-start-3 lg:col-end-5'>
                <div className='flex justify-between items-center'>
                    <p className='font-bold text-lg'>Hotspots</p>
                    <FaExternalLinkAlt className='hover:cursor-pointer hover:scale-110'/>
                </div>
                <div className='flex flex-col justify-evenly'>
                <p>Total: </p>
                </div>
                </div>
                
            </div>

             <div className='flex flex-col gap-4 mt-4 '>
                <p className='font-medium text-3xl'>Some Data</p>
                <div></div>
            </div>

            <div className='flex flex-col gap-4 mt-4'>
                <p className='font-medium text-3xl'>Recent Activity</p>
                <ActivityTable tableHeaders={["Date", "Activity", "Details"]} tableData={ActivityData}/>
            </div>

        </div>
    </div>
    <Footer/>
    </main>
  )
}

export default AdminDashboard