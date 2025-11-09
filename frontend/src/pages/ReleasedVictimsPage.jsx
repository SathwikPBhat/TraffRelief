// ...existing code...
import { useEffect, useState } from "react";

function ReleasedVictimsPage() {
  const [victims, setVictims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // victimId being processed
  const [error, setError] = useState("");
  const staffId = localStorage.getItem("staffId") || localStorage.getItem("id");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!staffId) {
      setError("Staff ID not found in localStorage");
      setLoading(false);
      return;
    }
    const fetchReleased = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:5000/staff/${encodeURIComponent(staffId)}/released-victims`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : undefined,
            },
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load");
        // if backend returns object with victims key handle it
        setVictims(Array.isArray(data) ? data : data.victims || []);
      } catch (err) {
        setError(err.message || "Error fetching released victims");
      } finally {
        setLoading(false);
      }
    };
    fetchReleased();
  }, [staffId, token]);

  const createRelease = async (victimId) => {
    if (!confirm(`Create release for victim ${victimId}?`)) return;
    setActionLoading(victimId);
    setError("");
    try {
      // Adjust this endpoint if your backend expects a different path
      const endpoint = `http://localhost:5000/staff/${encodeURIComponent(
        staffId
      )}/create-release/${encodeURIComponent(victimId)}`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ victimId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create release");
      // Optionally refresh list or remove released victim from UI
      setVictims((prev) => prev.filter((v) => (v.victimId || v.victim_id || v._id) !== victimId));
      alert("Release created successfully");
    } catch (err) {
      setError(err.message || "Error creating release");
    } finally {
      setActionLoading(null);
    }
  };

  const getVictimId = (v) => v.victimId || v.victim_id || v._id || "";

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Released Victims</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : victims.length === 0 ? (
        <p>No released victims found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded">
            <thead>
              <tr className="bg-teal-800 text-white">
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Victim ID</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {victims.map((v, idx) => {
                const vid = getVictimId(v);
                return (
                  <tr key={vid || idx} className="border-b">
                    <td className="px-4 py-2">{idx + 1}</td>
                    <td className="px-4 py-2">{vid}</td>
                    <td className="px-4 py-2">
                      <button
                        disabled={actionLoading !== null}
                        onClick={() => createRelease(vid)}
                        className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded disabled:opacity-60"
                      >
                        {actionLoading === vid ? "Processing..." : "Create Release"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ReleasedVictimsPage;
