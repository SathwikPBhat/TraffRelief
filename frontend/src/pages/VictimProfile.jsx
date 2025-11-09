import React, { useState, useEffect } from "react";
import StaffNavbar from "../components/StaffNavbar";
import AdminNavbar from "../components/AdminNavbar";
import { useLocation, useParams } from "react-router-dom";
import Footer from "../components/Footer";
import golimaams from "../assets/golimaams.png";
import { toast } from "react-toastify";
import AuditTable from "../components/AuditTable";
import InitialDetailsModal from "../components/InitialDetailsModal";

function VictimProfile() {
  const id = localStorage.getItem("id");
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const { victimId } = useParams();
  const [victimData, setVictimData] = useState(null);
  const [auditData, setAuditData] = useState([]);
  const [showInitModal, setShowInitModal] = useState(false);

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

      if (res.ok) {
        setVictimData(data.victim);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  // const getAudits = async() =>{
  //   try{
  //     const res = await fetch(`http://localhost:5000/admin/get-audit-details/${victimId}`,{
  //       method:"GET",
  //       headers:{
  //         Authorization: `Bearer ${token}`
  //       }
  //     })
  //     const data = await res.json();
  //     if(res.ok){
  //       setAuditData(data.audits.map((a)=>({
  //         date: a.date,
  //         id: a.auditId,
  //         staffName: a.staff,
  //       })));
  //     }
  //     else{
  //       toast.error(data.message, {toastId:"fetch-audits-error"});
  //     }
  //   }
  //   catch(err){
  //     toast.error(err.message, {toastId:"fetch-audits-error"});
  //   }
  // }

  useEffect(() => {
    if (token && victimId) {
      getVictimData();
      // getAudits();
    }
  }, [token, victimId]);

  useEffect(() => {
    if (showInitModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showInitModal]);

  if (!victimData) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-stone-100">
        <p className="text-lg text-teal-700">Loading victim data...</p>
      </div>
    );
  }
  const hasInitialDetails =
    victimData.initialDetails && victimData.initialDetails.addedAt;
  return (
    <main className="w-full min-h-screen bg-stone-100 font-['QuickSand'] flex flex-col">
      {role === "admin" ? <AdminNavbar /> : <StaffNavbar />}

      <div
        className={`w-full p-8 transition-all duration-200 ${
          showInitModal ? "blur-sm pointer-events-none select-none" : ""
        }`}
      >
        <div className="w-full flex items-center justify-center text-teal-700 lg:text-3xl md:text-3xl text-xl font-semibold mb-14">
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

        {!hasInitialDetails && role !== "admin" && (
          <div className="w-full flex flex-row justify-end items-center mt-5">
            <button
              onClick={() => setShowInitModal(true)}
              className="rounded-xl bg-teal-600 text-white px-6 py-2 hover:bg-teal-700 transition-colors font-medium shadow-md"
            >
              Add Initial Data
            </button>
          </div>
        )}
        {!hasInitialDetails && role === "admin" && (
          <div className="w-full flex flex-row justify-end items-center mt-5">
            <div className="px-4 py-2 rounded-xl bg-amber-50 border border-amber-300 text-amber-700 font-medium flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Initial Details Not Added
            </div>
          </div>
        )}
        
        {/* say added already */}
        {hasInitialDetails && (
          <div className="w-full flex flex-row justify-end items-center mt-5">
            <div className="px-4 py-2 rounded-xl bg-green-50 border border-green-300 text-green-700 font-medium flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Initial Details Completed
            </div>
          </div>
        )}
        <div className="mt-14 relative">
          <div className="absolute -top-8.5 left-4 rounded-t-xl pt-1 px-6 text-center border border-teal-600 bg-stone-100 text-gray-500 text-lg">
            Audits
          </div>
          <AuditTable
            tableHeaders={["Date", "ID", "Staff", "Action"]}
            tableData={auditData}
          />
        </div>
      </div>

      {showInitModal && (
        <InitialDetailsModal
          victims={[
            {
              victimId: victimData.victimId,
              fullName: victimData.fullName,
            },
          ]}
          onClose={() => {
            setShowInitModal(false);
            //Refresh
            getVictimData();
          }}
        />
      )}

      <Footer />
    </main>
  );
}

export default VictimProfile;
