import React, {useState, useEffect} from 'react'
import Table from '../components/Table'
import Footer from '../components/Footer'
import StaffNavbar from '../components/StaffNavbar'
import { FaExternalLinkAlt } from "react-icons/fa";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function StaffDashboard() {
    const [victimData, setVictimData] = useState([]);

    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const getVictims = async() =>{
      try{
        const res = await fetch(`http://localhost:5000/staff/get-victims/${id}`,{
          method:"GET",
          headers:{
            Authorization: `Bearer ${token}`
          }
        })
        const data = await res.json();

        if(res.ok){
          setVictimData(data.victims.map((v)=>  ({
            name: v.fullName,
            id: v.victimId,
            status: v.status
          })));
        }
        else{
          toast.error(data.message, {toastId: "fetch-victims-error"});
        }
      }
      catch(err){
        toast.error(err.message, {toastId: "fetch-victims-error"});
      }
    }
    const StaffData = [
    { name: "Alice", id: "C-101",status: "Active" },
    { name: "Bob", id: "C-102", status: "Inactive" },
    { name: "Charlie", id: "C-103",status: "Active" },
    { name: "David", id: "C-104", status: "Active" },
  ];
  useEffect(()=>{
    getVictims();
  },[token,id]);

  return (
    <main className="w-full min-h-screen bg-stone-100 font-['QuickSand']flex flex-col">
    <StaffNavbar/>
    <div className='w-full p-8 flex flex-col justify-between gap-6'>
    <div className='flex flex-col justify-between gap-2 mb-4'>
        <div className='flex items-center justify-between'>
            <p className="font-medium text-3xl font-['QuickSand']">Assigned Victims</p>
            <FaExternalLinkAlt onClick={()=>navigate("/staff/victim-details")} className='hover:cursor-pointer hover:scale-110'/>
        </div>
        <Table tableHeaders={["Name","ID","Status","Action"]} tableData = {victimData} about = "victim"/>
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