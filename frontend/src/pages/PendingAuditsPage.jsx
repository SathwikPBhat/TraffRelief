import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../components/Footer";
import StaffNavbar from "../components/StaffNavbar";

function formatDate(d) {
  if (!d) return "-";
  const dt = new Date(d);
  if (isNaN(dt)) return String(d);
  return dt.toLocaleString();
}

export default function PendingAuditsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const staffId = localStorage.getItem("id") ;
  const token = localStorage.getItem("token");

  useEffect(() => {
    let mounted = true;

    const fetchPending = async () => {
      if (!staffId) {
        const msg = "Staff id not found in localStorage";
        setError(msg);
        toast.error(msg);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const url = `http://localhost:5000/staff/${encodeURIComponent(staffId)}/pending-audits`;
        const res = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        const text = await res.text();
        let data = null;
        try {
          data = text ? JSON.parse(text) : null;
        } catch (err) {
          console.error("Failed to parse JSON:", text, err);
          throw new Error("Invalid JSON response from server");
        }

        console.log("GET pending-audits", res.status, data);

        if (!res.ok) {
          const msg = (data && (data.error || data.message)) || `Request failed (${res.status})`;
          throw new Error(msg);
        }

        // normalize possible shapes: array, { audits: [...] }, { pending: [...] }, {data: [...]} etc.
        let list = [];
        if (Array.isArray(data)) list = data;
        else if (Array.isArray(data.audits)) list = data.audits;
        else if (Array.isArray(data.pending)) list = data.pending;
        else if (Array.isArray(data.data)) list = data.data;
        else if (Array.isArray(data.rows)) list = data.rows;
        else list = [];

        if (mounted) setRows(list);
      } catch (err) {
        console.error("Error fetching pending audits:", err);
        const msg = err.message || "Failed to fetch pending audits";
        setError(msg);
        toast.error(msg);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPending();
    return () => {
      mounted = false;
    };
  }, [staffId, token]);

  return (
    <main className="w-full min-h-screen bg-stone-100 font-['QuickSand'] flex flex-col">
      <StaffNavbar />

      <div className="w-full p-8">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl p-6 shadow">
          <h2 className="text-2xl font-semibold mb-4">Pending Audits</h2>

          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : rows.length === 0 ? (
            <p className="text-gray-600">No pending audits found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse border border-slate-200">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-4 py-3 border-b">#</th>
                    <th className="px-4 py-3 border-b">Victim ID</th>
                    <th className="px-4 py-3 border-b">Next Audit Date</th>
                    <th className="px-4 py-3 border-b">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, idx) => {
                    const victim = r.victimId || {};
                    const victimIdentifier = victim.victimId || victim._id || r.victimId || "-";
                    const nextDate =
                      (r.result && r.result.next_audit_date) ||
                      r.next_audit_date ||
                      (r.result && r.result.next_date) ||
                      null;
                    return (
                      <tr
                        key={r._id || idx}
                        className="odd:bg-white even:bg-slate-50 hover:bg-slate-100"
                      >
                        <td className="px-4 py-3 border-t">{idx + 1}</td>
                        <td className="px-4 py-3 border-t">{victimIdentifier}</td>
                        <td className="px-4 py-3 border-t">{formatDate(nextDate)}</td>
                        <td className="px-4 py-3 border-t">
                          <Link
                            to={`/audit?victimId=${encodeURIComponent(victimIdentifier)}`}
                            className="text-teal-700 font-medium hover:underline"
                          >
                            Open Audit
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
