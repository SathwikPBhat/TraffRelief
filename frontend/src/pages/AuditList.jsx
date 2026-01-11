import { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import AuditCard from "../components/AuditCard";
import StaffNavbar from "../components/StaffNavbar";
import { getUserData } from "../utils/CommonFetches";
import Footer from "../components/Footer";

function AuditList() {
  const token = localStorage.getItem("token");

  const [userData, setUserData] = useState({});
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        await getUserData(token, setUserData);
      } catch (err) {
        console.error("Init error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) init();
  }, [token]);

  useEffect(() => {
    if (!userData.role) return;

    const fetchAudits = async () => {
      try {
        const url =
          userData.role === "admin"
            ? "http://localhost:5000/admin/get-all-audits"
            : `http://localhost:5000/staff/${userData.id}/audits`;

        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setAudits(data.audits || []);
        }
      } catch (e) {
        console.error("Fetch audits error", e);
      }
    };

    fetchAudits();
  }, [userData.role, token]);

  return (
    <main className="min-h-screen w-full font-['QuickSand'] flex flex-col bg-stone-100">
      {userData.role === "admin" && <AdminNavbar />}
      {userData.role === "staff" && <StaffNavbar />}
      <div className="w-full flex flex-col gap-4 p-8 ">
        <div className="flex flex-col gap-4 ">
          {loading && (
            <div className="w-full border border-teal-600 rounded-lg p-4 text-teal-700">
              Loading audits...
            </div>
          )}

          {!loading && audits.length === 0 && (
            <div className="w-full border border-teal-600 rounded-lg p-4 text-slate-600">
              No audits found.
            </div>
          )}

          {!loading &&
            audits.map((a, idx) => (
              <AuditCard
                key={idx}
                data={{
                  auditId: a.auditId,
                  date: a.date || a.createdAt || a.timestamp,
                  staffName: a.staffName,
                  victimName: a.victimName,
                }}
              />
            ))}
        </div>
      </div>
      <Footer/>
    </main>
  );
}

export default AuditList;
