import React, { useState, useEffect, use } from "react";
import StaffNavbar from "../components/StaffNavbar";
import { useLocation, useParams } from "react-router-dom";
import Footer from "../components/Footer";
import golimaams from "../assets/golimaams.png";
import { toast } from "react-toastify";
import Table from "../components/Table";

function VictimProfile() {
  const id = localStorage.getItem("id");
  const token = localStorage.getItem("token");
  const { victimId } = useParams();
  const [victimData, setVictimData] = useState(null);
  const auditData = [
    { name: "Alice", id: "C-101",status: "Active" },
    { name: "Bob", id: "C-102", status: "Inactive" },
    { name: "Charlie", id: "C-103",status: "Active" },
    { name: "David", id: "C-104", status: "Active" },
  ];
  const getVictimData = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/staff/get-victim/${victimId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      console.log("Response:", data);
      if (res.ok) {
        setVictimData(data.victim);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };
  useEffect(() => {
    if (token && victimId) {
      getVictimData();
    }
  }, [token, victimId]);

  if (!victimData) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-stone-100">
        <p className="text-lg text-teal-700">Loading victim data...</p>
      </div>
    );
  }

  return (
    <main className="w-full min-h-screen bg-stone-100 font-['QuickSand'] flex flex-col">
      <StaffNavbar />
      <div className="w-full p-8 ">
        <div className="w-full flex items-center justify-center text-teal-700 lg:text-3xl md:text-3xl text-xl font-semibold mb-10">
         {victimData.fullName}
        </div>
        <div className="w-full grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 lg:gap-4 md:gap-4 gap-12 ">
          <div className="p-4  rounded-lg border shadow-[0px_2px_20px_0px_rgba(96,125,139,0.50)] border-teal-600 flex items-center gap-4 relative">
            <div className="absolute -top-8.5  rounded-t-xl pt-1 px-6 text-center border border-teal-600 bg-stone-100 text-gray-500 text-lg">
              Personal info
            </div>
            <div className="rounded-lg flex">
              <img
                src={golimaams}
                alt="no image found"
                className="lg:size-25 md:size-25 sm:size-15 size-10"
              />
            </div>
            <div className="flex flex-col gap-1 overflow-ellipsis">
              <p>Full Name: {victimData.fullName}</p>
              <p>Age: {victimData.age}</p>
              <p>
                Gender:{" "}
                {victimData.gender === "M"
                  ? "Male"
                  : victimData.gender === "F"
                  ? "Female"
                  : "Other"}
              </p>
            </div>
            <div>
              Centre:{" "}
              <span className="text-teal-700 font-medium">
                {victimData.centre?.centreName || "N/A"}
              </span>
            </div>
          </div>

          <div className="p-4  rounded-lg border shadow-[0px_2px_20px_0px_rgba(96,125,139,0.50)] border-teal-600 flex items-center gap-4 relative">
            <div className="absolute -top-8.5  rounded-t-xl pt-1 px-6 text-center border border-teal-600 bg-stone-100 text-gray-500 text-lg">
              Case info
            </div>
            <div className="flex flex-col gap-1 overflow-ellipsis">
              <p>
                Trafficking Type:{" "}
                <span className="text-teal-700 font-medium">
                  {victimData.caseDetailsForAdmin?.traffickingType || "N/A"}
                </span>
              </p>
              <p>
                Methods Of Controlling:{" "}
                <span className="text-teal-700 font-medium">
                  {victimData.caseDetailsForAdmin?.controlMethods?.join(", ") ||
                    "N/A"}
                </span>
              </p>
              <p>
                Geographic Locations:{" "}
                <span className="text-teal-700 font-medium">
                  {victimData.caseDetailsForAdmin?.traffickingLocations?.join(
                    ", "
                  ) || "N/A"}
                </span>
              </p>
              <p>
                Duration of Control:{" "}
                <span className="text-teal-700 font-medium">
                  {victimData.caseDetailsForAdmin?.traffickingDuration || "N/A"}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 relative">
            <div className="absolute -top-8.5 left-4 rounded-t-xl pt-1 px-6 text-center border border-teal-600 bg-stone-100 text-gray-500 text-lg">
             Audits
            </div>
        <Table tableHeaders={["Name","ID","Status","Action"]} tableData = {auditData} />
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default VictimProfile;
