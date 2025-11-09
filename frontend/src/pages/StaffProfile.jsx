import React, { useState, useEffect } from "react";
import AdminNavbar from "../components/AdminNavbar";
import StaffNavbar from "../components/StaffNavbar";
import golimaams from "../assets/golimaams.png";
import { getVictims } from "../utils/CommonFetches";
import VictimCard from "../components/VictimCard";
import Table from "../components/Table";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

function StaffProfile() {
  const token = localStorage.getItem("token");
  const {staffId} = useParams();
  const role = localStorage.getItem("role");
  const isAdmin = role === "admin" ? true : false;
  const isStaff = role === "staff" ? true : false;
  const [victimData, setVictimData] = useState([]);
  const [staffData, setStaffData] = useState({});

  const auditData = [
    { name: "Alice", id: "C-101", status: "Active" },
    { name: "Bob", id: "C-102", status: "Inactive" },
    { name: "Charlie", id: "C-103", status: "Active" },
    { name: "David", id: "C-104", status: "Active" },
  ];

  const getStaffData  = async () => {
    try {
      const res = await fetch(`http://localhost:5000/staff/get-staff/${staffId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setStaffData(data.staff);
        console.log(data.staff);
      } else {
        toast.error(data.message, { toastId: "fetchStaffError" });
      }
    } catch (err) {
      toast.error(err.message, { toastId: "fetchStaffError" });
    }
  };

  useEffect(() => {
    getVictims(staffId, token, setVictimData);
    getStaffData();
  }, [token, staffId]);

  return (
    <main className="w-full min-h-screen bg-stone-100 flex flex-col font-['QuickSand']">
      {isAdmin && <AdminNavbar />}
      {isStaff && <StaffNavbar />}

      <div className="w-full p-10 flex flex-col">
        <div className="w-full flex items-center justify-center lg:text-3xl md:text-3xl font-bold text-xl text-teal-700 ">
          {staffData.fullName}
        </div>

        <div className="p-4 sm:p-6 rounded-lg border shadow-[0px_2px_20px_0px_rgba(96,125,139,0.50)] border-teal-600 bg-white relative w-full mt-14">
          <div className="absolute -top-8.5 left-4 sm:left-6 rounded-t-xl pt-1 px-4 sm:px-6 text-center border border-teal-600 bg-stone-100 text-gray-500 text-base sm:text-lg ">
            Personal info
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 items-start text-sm sm:text-base mt-2 w-full">
            <div className="flex items-start gap-4 sm:gap-5">
              <img
                src={golimaams}
                alt="staff_img"
                className="size-16 sm:size-20 md:size-24 lg:size-28 rounded-lg shrink-0"
              />
              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <p className="break-words">
                  Name:{" "}
                  <span className="text-teal-700 font-medium">
                    {staffData.fullName}
                  </span>
                </p>
                <p className="break-words">
                  Email:{" "}
                  <span className="text-teal-700 font-medium">
                    {staffData.email}
                  </span>
                </p>
                <p>
                  Gender:{" "}
                  <span className="text-teal-700 font-medium">Male</span>
                </p>
                <p>
                  Contact:{" "}
                  <span className="text-teal-700 font-medium">
                    {staffData.mobileNo}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-center items-start lg:items-end text-left lg:text-right gap-2">
              <p className="font-medium">Role</p>
              <p>
                <span className="text-teal-700 font-medium text-center">
                  {staffData.role}
                </span>
              </p>
            </div>

            <div className="flex flex-col justify-center items-start lg:items-end text-left lg:text-right gap-2">
              <p className="font-medium">Centre</p>
              <p className="text-teal-700 font-medium text-sm sm:text-base text-center">
                {staffData.centre ? staffData.centre.centreName : "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-teal-600 rounded-lg p-4 flex flex-col gap-4 mt-20 relative shadow-[0px_2px_20px_0px_rgba(96,125,139,0.50)]">
          <div className="absolute -top-8.5 -z-0 left-4 sm:left-6 rounded-t-xl pt-1 px-4 sm:px-6 text-center border border-teal-600 bg-stone-100 text-gray-500 text-base sm:text-lg">
            Assigned Victims
          </div>

          {victimData.length > 0 ? (
            victimData.map((v, idx) => <VictimCard key ={idx} victimData={v} />)
          ) : (
            <p className="text-red-600 ">No data found</p>
          )}
        </div>

        <div className="mt-20 relative">
          <div className="absolute -top-8.5 left-4 rounded-t-xl pt-1 px-6 text-center border border-teal-600 bg-stone-100 text-gray-500 text-lg">
            Audits
          </div>
          <Table
            tableHeaders={["Name", "ID", "Status", "Action"]}
            tableData={auditData}
          />
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default StaffProfile;
