import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import AuditTable from "../components/AuditTable";
import Footer from "../components/Footer";
import StaffNavbar from "../components/StaffNavbar";
import { FaExternalLinkAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function StaffDashboard() {
  const [victimData, setVictimData] = useState([]);
  const [pendingAudits, setPendingAudits] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const getVictims = async () => {
    try {
      const res = await fetch(`http://localhost:5000/staff/get-my-victims`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (res.ok) {
        setVictimData(
          data.victims.map((v) => ({
            name: v.fullName,
            id: v.victimId,
            status: v.status,
          }))
        );
      } else {
        toast.error(data.message, { toastId: "fetch-victims-error" });
      }
    } catch (err) {
      toast.error(err.message, { toastId: "fetch-victims-error" });
    }
  };

  const getPendingAudits = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/staff/pending-audits`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();

      if (res.ok) {
        setPendingAudits(
          data.map((audit) => ({
            date: audit.result?.next_audit_date
              ? new Date(audit.result.next_audit_date).toLocaleDateString()
              : "N/A",
            id: audit.auditId,
            staffName: "Staff Name",
            victimId: audit.victimId?.victimId || "N/A",
          }))
        );
      } else {
        toast.error(data.error || "Failed to fetch pending audits", {
          toastId: "fetch-pending-audits-error",
        });
      }
    } catch (err) {
      toast.error(err.message, { toastId: "fetch-pending-audits-error" });
    }
  };

  useEffect(() => {
    getVictims();
    getPendingAudits();
  }, [token]);

  return (
    <main className="w-full min-h-screen bg-stone-100 font-['QuickSand'] flex flex-col">
      <StaffNavbar />
      <div className="w-full p-8 flex flex-col justify-between gap-6">
        <div className="flex flex-col justify-between gap-2 mb-4">
          <div className="flex items-center justify-between">
            <p className="font-medium text-3xl font-['QuickSand']">
              Assigned Victims
            </p>
            <FaExternalLinkAlt
              onClick={() => navigate("/staff/victim-details")}
              className="hover:cursor-pointer hover:scale-110"
            />
          </div>
          <Table
            tableHeaders={["Name", "ID", "Status", "Action"]}
            tableData={victimData}
            about="victim"
          />
        </div>
        <div className="flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between">
            <p className="font-medium text-3xl font-['QuickSand']">
              Pending Audits
            </p>
            <FaExternalLinkAlt className="hover:cursor-pointer hover:scale-110" />
          </div>
          <AuditTable
            tableHeaders={["Due Date", "Audit ID", "Victim ID", "Action"]}
            tableData={pendingAudits}
            onView={(row) => navigate(`/audit/${row.victimId}`)}
          />
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default StaffDashboard;
