import React, { useState, useEffect, use } from "react";
import StaffNavbar from "../components/StaffNavbar";
import VictimCard from "../components/VictimCard";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import { getVictims } from "../utils/CommonFetches";

function VictimManagementForStaff() {
  const [victimData, setVictimData] = useState([]);

  const id = localStorage.getItem("id");
  const token = localStorage.getItem("token");


  useEffect(()=>{
    getVictims(id, token, setVictimData);
  },[token,id]);

  return (
    <main className="w-full bg-stone-100 font-['QuickSand'] flex flex-col min-h-screen">
      <StaffNavbar />
      <div className="flex flex-col mt-2 gap-4 p-6">
        <p className="text-2xl font-semibold">Victim List</p>
        <div className="flex flex-col gap-4 mb-4">
        {
          victimData.length > 0 ? (
            victimData.map((v)=> (<VictimCard victimData={v}/>))
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
