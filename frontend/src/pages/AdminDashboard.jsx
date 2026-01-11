import React,{useState, useEffect} from 'react'
import AdminNavbar from '../components/AdminNavbar'
import { FaExternalLinkAlt } from "react-icons/fa";
import ActivityTable from '../components/ActivityTable';
import Footer from '../components/Footer';
import {toast} from "react-toastify"
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
    const navigate = useNavigate();
    const [centreData, setCentreData] = useState({
        total : 0,
        withStaff : 0
    });
    const [staffData, setStaffData] = useState({
        total: 0,
        working: 0,
    })
    const [activityData, setActivityData] = useState([]);
    const [victimData, setVictimData] = useState({
        total:0,
        active:0,
        missing:0,
        released:0,
        deceased:0
    });
    const token = localStorage.getItem("token");

    const getActivityData = async() =>{
        try{
           const res =  await fetch(`http://localhost:5000/admin/get-activity-details`,{
            method: "GET",
            headers:{
                Authorization: `Bearer ${token}`
            }
           })

           const data = await res.json();
           if(res.status == 200){
            setActivityData(data.log.splice(0,5));
            
           }
           else{
            toast.error(data.message, {toastId:"fetchLogError"});
           }
        }
        catch(err){
            toast.error(err.message, {toastId:"fetchLogError"});
        }
    }
    const getVictimDetails = async() =>{
        try{
            const res = await fetch(`http://localhost:5000/stats/victim-details`,{
                method:"GET",
                headers:{
                    'Authorization':`Bearer ${token}`
                }
            })
            const data = await res.json();

            if(res.status == 200){
                setVictimData({
                    total: data.total,
                    active: data.active,
                    missing: data.missing,
                    released: data.released,
                    deceased: data.deceased
                });
            }
            else{
                console.log(data.message);
            }
        }
        catch(err){
            console.log(err.message);
        }
}
    const getCentreDetails = async() =>{
        try{
            const res = await fetch(`http://localhost:5000/stats/centre-details`,{
                method:"GET",
                headers:{
                    'Authorization':`Bearer ${token}`,
                    'Content-Type':'application/json'
                }
            })
            const data = await res.json();
            if(res.status == 200){
                const centre = {total : data.centresUnderAdminCount, withStaff:data.centresWithStaffCount};
                setCentreData(centre);
            }
            else{
                toast.error(data.message, {toastId :"centre fetch error"});
            }
        }
        catch(err){
            toast.error(err.message);
        }
    }
    const getStaffDetails = async() =>{
        try{
            const res = await fetch(`http://localhost:5000/stats/staff-details`,{
                method:"GET",
                headers:{
                    'Authorization':`Bearer ${token}`,
                    'Content-Type':'application/json'
                }
            })
            const data = await res.json();
            if(res.status == 200){
                const staff = {total : data.total, working:data.working};
                setStaffData(staff);
            }
            else{
                toast.error(data.message, {toastId :"staff fetch error"});
            }
        }
        catch(err){
            toast.error(err.message);
        }
    }
    useEffect(()=>{
        getCentreDetails();
        getStaffDetails();
        getActivityData();
        getVictimDetails();
    },[token])

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
                    <FaExternalLinkAlt onClick={()=> navigate("/admin/victims")} className='hover:cursor-pointer hover:scale-110'/>
                </div>
                <div className='flex flex-col justify-evenly'>
                <p>Total: {victimData.total}</p>
                <p>Active: {victimData.active}</p>
                <p>Released: {victimData.released}</p>
                {victimData.missing > 0 && (<p>Missing: {victimData.missing}</p>)}
                {victimData.deceased > 0 && (<p>Deceased: {victimData.deceased}</p>)}
                </div>
                </div>

                <div className='p-2 rounded-xl border border-gray-400 shadow-[0px_4px_4px_0px_rgba(0,105,92,1.00)] flex flex-col gap-2'>
                <div className='flex justify-between items-center'>
                    <p className='font-bold text-lg'>Staff</p>
                    <FaExternalLinkAlt onClick = {()=>navigate("/admin/staff-details")} className='hover:cursor-pointer hover:scale-110'/>
                </div>
                <div className='flex flex-col justify-evenly'>
                <p>Total: {staffData.total}</p>
                <p>Working: {staffData.working}</p>
                <p>Assigned: </p>
                </div>
                </div>

                <div className='p-2 rounded-xl border border-gray-400 shadow-[0px_4px_4px_0px_rgba(0,105,92,1.00)] flex flex-col gap-2'>
                <div className='flex justify-between items-center'>
                    <p className='font-bold text-lg'>Centers</p>
                    <FaExternalLinkAlt className='hover:cursor-pointer hover:scale-110'/>
                </div>
                <div className='flex flex-col justify-evenly'>
                <p>Total: {centreData.total}</p>
                <p>Centres With Staff: {centreData.withStaff}</p>
                <p>Centres Without Staff: {centreData.total - centreData.withStaff}</p>
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

            <div className='flex flex-col gap-4 mt-4'>
                <p className='font-medium text-3xl'>Recent Activity</p>
                <ActivityTable tableHeaders={["Date", "Activity", "Details"]} tableData={activityData}/>
            </div>

        </div>
    </div>
    <Footer/>
    </main>
  )
}

export default AdminDashboard