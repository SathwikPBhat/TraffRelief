/*import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "../components/Footer";
import StaffNavbar from "../components/StaffNavbar";

export default function ViewReleasesByVictim() {
  const { staffId, victimId } = useParams();
  const [loading, setLoading] = useState(true);
  const [release, setRelease] = useState(null);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRelease = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/staff/${staffId}/${victimId}/view-release`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch release");
        setRelease(data.release);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error loading release");
      } finally {
        setLoading(false);
      }
    };

    fetchRelease();
  }, [staffId, victimId, token]);

  const viewResults = (hashLink) => {
    navigate(`/interview-results/${hashLink}`);
  };

  return (
    <div className="min-h-screen bg-stone-100">
      <StaffNavbar />
      <div className="p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Release Details</h2>
          <p className="text-gray-600 mb-4">Victim ID: {victimId}</p>

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : !release ? (
            <p>No release found for this victim</p>
          ) : (
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Created On</p>
                    <p className="font-medium">
                      {new Date(release.scheduledDate).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium">
                      {release.submitted ? "Submitted" : "Pending"}
                    </p>
                  </div>
                </div>

                {release.submitted && (
                  <div className="mt-4">
                    <button
                      onClick={() => viewResults(release.hashLink)}
                      className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
                    >
                      View Interview Results
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}*/

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Footer from "../components/Footer";
import StaffNavbar from "../components/StaffNavbar";

export default function ViewReleasesByVictim() {
  const { staffId, victimId } = useParams();
  const [loading, setLoading] = useState(true);
  const [releases, setReleases] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const tryUrls = [
      // preferred: staff + victim
      `http://localhost:5000/staff/${encodeURIComponent(staffId)}/${encodeURIComponent(victimId)}/view-release`,
      // alternate: staff path with victim only
      `http://localhost:5000/staff/${encodeURIComponent(victimId)}/view-release`,
      // alternate placements
      `http://localhost:5000/staff/${encodeURIComponent(staffId)}/view-release/${encodeURIComponent(victimId)}`,
      // release-by-victim fallbacks
      `http://localhost:5000/release/by-victim/${encodeURIComponent(victimId)}`,
      `http://localhost:5000/release/victim/${encodeURIComponent(victimId)}`
    ];

    const fetchReleases = async () => {
      setLoading(true);
      setError("");
      for (const url of tryUrls) {
        try {
          const res = await fetch(url, {
            method: "GET",
            headers: {
              Authorization: token ? `Bearer ${token}` : undefined,
            },
          });

          const text = await res.text();
          const contentType = (res.headers.get("content-type") || "").toLowerCase();

          // Try to parse JSON when available
          let data = null;
          if (contentType.includes("application/json")) {
            try {
              data = text ? JSON.parse(text) : null;
            } catch (e) {
              // parsing failed
              data = null;
            }
          } else {
            // attempt to parse even if content-type missing
            try {
              data = text ? JSON.parse(text) : null;
            } catch (e) {
              data = null;
            }
          }

          // If not OK, try next endpoint
          if (!res.ok) {
            continue;
          }

          // Normalize response shapes to an array of releases
          let arr = [];
          if (Array.isArray(data)) arr = data;
          else if (data && Array.isArray(data.releases)) arr = data.releases;
          else if (data && Array.isArray(data.release)) arr = data.release;
          else if (data && data.release && typeof data.release === "object" && !Array.isArray(data.release)) {
            // server returned single release object
            arr = [data.release];
          } else if (data && typeof data === "object" && Object.keys(data).length && !data.releases && !data.release) {
            // sometimes server returns release object directly
            arr = [data];
          }

          // If parsed nothing but server returned OK and raw text, expose raw
          if (arr.length === 0 && text && !data) {
            // treat as single raw response (not ideal) — show as one item
            if (!mounted) return;
            setReleases([{ raw: text }]);
            setLoading(false);
            return;
          }

          if (!mounted) return;
          setReleases(arr);
          setLoading(false);
          return;
        } catch (err) {
          // try next url
          console.warn("fetch attempt failed for", url, err);
        }
      }

      if (!mounted) return;
      setError("No releases found or backend did not respond with JSON. Check backend routes.");
      setLoading(false);
    };

    if (!victimId) {
      setError("Missing victim identifier");
      setLoading(false);
    } else {
      fetchReleases();
    }

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staffId, victimId, token]);

  const openResults = (hash) => {
    if (!hash) return;
    navigate(`/interview-results/${encodeURIComponent(hash)}`);
  };

  return (
    <div className="min-h-screen bg-stone-100">
      <StaffNavbar />
      <div className="p-8">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Releases for Victim: {victimId}</h2>

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : releases.length === 0 ? (
            <p>No releases found for this victim.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow rounded">
                <thead>
                  <tr className="bg-teal-800 text-white">
                    <th className="px-4 py-2 text-left">#</th>
                    <th className="px-4 py-2 text-left">Hash</th>
                    <th className="px-4 py-2 text-left">Created At</th>
                    <th className="px-4 py-2 text-left">Submitted</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {releases.map((r, idx) => {
                    const hash = r.hashLink || r.hash || r._id || "";
                    const created = r.createdAt || r.created || r.created_at || r.createdOn;
                    const submitted = !!r.submitted;
                    return (
                      <tr key={hash || idx} className="border-b odd:bg-white even:bg-slate-50">
                        <td className="px-4 py-2">{idx + 1}</td>
                        <td className="px-4 py-2">{hash || (r.raw ? "raw-response" : "—")}</td>
                        <td className="px-4 py-2">{created ? new Date(created).toLocaleString() : "—"}</td>
                        <td className="px-4 py-2">{submitted ? "Yes" : "No"}</td>
                        <td className="px-4 py-2">
                          {hash ? (
                            <Link
                              to={`/victim/${encodeURIComponent(hash)}`}
                              className="text-teal-700 hover:underline mr-3"
                            >
                              Open
                            </Link>
                          ) : (
                            <span className="text-slate-500 mr-3">Open</span>
                          )}
                          <button
                            disabled={!submitted}
                            onClick={() => openResults(hash)}
                            className={`px-3 py-1 rounded ${submitted ? "bg-teal-600 text-white" : "bg-slate-200 text-slate-500 cursor-not-allowed"}`}
                          >
                            See Results
                          </button>
                          {r.raw && (
                            <div className="mt-2 text-xs text-gray-600">
                              <pre className="whitespace-pre-wrap">{String(r.raw).slice(0, 100)}{String(r.raw).length > 100 ? "..." : ""}</pre>
                            </div>
                          )}
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
    </div>
  );
}