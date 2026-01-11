import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from '../components/Footer';
import StaffNavbar from '../components/StaffNavbar';
import { getUserData } from "../utils/CommonFetches";

function ReleasedVictimsPage() {
  const [victims, setVictims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    getUserData(token, setUserData);
  }, [token]);

  useEffect(() => {
    if (!userData?.id) return;

    const fetchReleased = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:5000/staff/${encodeURIComponent(userData.id)}/released-victims`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load");
        setVictims(Array.isArray(data) ? data : data.victims || []);
      } catch (err) {
        setError(err.message || "Error fetching released victims");
      } finally {
        setLoading(false);
      }
    };
    fetchReleased();
  }, [userData?.id, token]);

  const createRelease = async (victimId) => {
    if (!confirm(`Create release for victim ${victimId}?`)) return;
    setActionLoading(victimId);
    setError("");

    try {
      const endpoint = `http://localhost:5000/staff/${encodeURIComponent(
        userData.id
      )}/create-release/${encodeURIComponent(victimId)}`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ victimId }),
      });

      const text = await res.text();
      let data;
      try {
        data = text ? JSON.parse(text) : null;
      } catch (parseErr) {
        data = text;
      }

      if (!res.ok) {
        const msg = (data && (data.error || data.message)) || String(data) || `Request failed (${res.status})`;
        throw new Error(msg);
      }

      alert("Release created successfully");
      window.location.reload();
    } catch (err) {
      console.error("Create release failed:", err);
      setError(err.message || "Failed to create release");
      alert("Error creating release: " + (err.message || "Unknown error"));
    } finally {
      setActionLoading(null);
    }
  };

  const viewReleases = async (victimId) => {
    navigate(`/view-releases/${userData.id}/${victimId}`);
  };

  return (
 <div className="min-h-screen flex flex-col">
      <StaffNavbar />
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
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {victims.map((v, idx) => {
                  const vid = v.victimId || v.victim_id || v._id || "";
                  return (
                    <tr key={vid || idx} className="border-b">
                      <td className="px-4 py-2">{idx + 1}</td>
                      <td className="px-4 py-2">{vid}</td>
                      <td className="px-4 py-2 space-x-2">
                        <button
                          onClick={() => createRelease(vid)}
                          className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded"
                          disabled={actionLoading === vid}
                        >
                          {actionLoading === vid ? "Processing..." : "Create Assessment"}
                        </button>
                        <button
                          onClick={() => viewReleases(vid)}
                          className="bg-teal-100 hover:bg-teal-200 text-teal-800 px-3 py-1 rounded"
                        >
                          View Assessments
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
      <Footer />
    </div>
  );
}

export default ReleasedVictimsPage;