import { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import AuditCard from "../components/AuditCard";
import StaffNavbar from "../components/StaffNavbar";
import { getUserData } from "../utils/CommonFetches";
import Footer from "../components/Footer";
import Pagination from "../components/Pagination";

function AuditList() {
  const token = localStorage.getItem("token");

  const [userData, setUserData] = useState({});
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filteredAudits, setFilteredAudits] = useState([]);
  const [currPage, setCurrPage] = useState(1);

  const handlePageChange = (pageNo) => {
    if (pageNo >= 1 && pageNo <= totalPages) setCurrPage(pageNo);
  };

  const handleSearch = (e) =>{
    const value = e.target.value.toLowerCase();
      setQuery(value);
      
      if(value === ""){
        setFilteredAudits(audits);
        return;
      }

      let filtered = audits.filter((audit)=>{
          return audit.auditId.toLowerCase().includes(value) || audit.staffName.toLowerCase().includes(value) || audit.victimName.toLowerCase().includes(value)      
      })
      setFilteredAudits(filtered)
  }

  const totalPages = Math.max(1, Math.ceil(filteredAudits.length / 6));
  const startIdx = (currPage - 1) * 6;
  const endIdx = startIdx + 6;
  const visibleAudits = filteredAudits.slice(startIdx, endIdx);

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

  useEffect(()=>{
    setFilteredAudits(audits);
  },[audits])

  useEffect(() => {
  setFilteredAudits(audits);
  setCurrPage(1);
}, [audits]);

useEffect(() => {
  setCurrPage(1);
}, [query]);

  return (
    <main className="min-h-screen w-full font-['QuickSand'] flex flex-col bg-stone-100">
      {userData.role === "admin" && <AdminNavbar />}
      {userData.role === "staff" && <StaffNavbar />}
      <div className="w-full flex flex-col gap-4 p-8 ">
        <div className="flex w-full items-center gap-4 justify-end">
          <div className="flex flex-col gap-2">
            <label htmlFor="search">Search Audit:</label>
            <input type="search" placeholder="id, name.." onChange={handleSearch} value = {query} className="p-2 border border-teal-700 rounded-xl bg-stone-200"/>
          </div>
        </div>
        <div className="flex flex-col gap-4 ">
          {loading && (
            <div className="w-full border border-teal-600 rounded-lg p-4 text-teal-700">
              Loading audits...
            </div>
          )}

          {!loading && filteredAudits.length === 0 && (
            <div className="w-full border border-teal-600 rounded-lg p-4 text-slate-600">
              No audits found.
            </div>
          )}

          {!loading &&
            visibleAudits.map((a, idx) => (
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
            {filteredAudits.length > 6 && (
              <Pagination curr = {currPage} total = {totalPages} onPageChange = {handlePageChange}/>)
            }
        </div>
      </div>
      <Footer/>
    </main>
  );
}

export default AuditList;
