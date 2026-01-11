import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import StaffNavbar from "../components/StaffNavbar";
import VictimCard from "../components/VictimCard";


function VictimManagementForStaff() {
  const [victimData, setVictimData] = useState([]);

  const token = localStorage.getItem("token");

  const getStaffVictims = async() =>{
    try{
      const res = await fetch(`http://localhost:5000/staff/get-my-victims`,{
        headers:{
          Authorization: `Bearer ${token}`
        }
      })
      const data = await res.json();
      setVictimData(data.victims);
    }
    catch(err){
      console.log(err.message);
    }
  }

  useEffect(()=>{
    getStaffVictims();
  },[token]);

  return (
    <main className="w-full bg-stone-100 font-['QuickSand'] flex flex-col min-h-screen">
      <StaffNavbar />
      <div className="flex flex-col mt-2 gap-4 p-6">
        <p className="text-2xl font-semibold">Victim List</p>
        <div className="flex flex-col gap-4 mb-4">
        {
          victimData.length > 0 ? (
            victimData.map((v, idx )=> (<VictimCard key={idx} victimData={v}/>))
          ):(
            <p className="text-red-600 ">No data found</p>
          )
        }
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default VictimManagementForStaff;