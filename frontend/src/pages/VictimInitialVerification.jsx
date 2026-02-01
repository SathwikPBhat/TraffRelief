import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import AdminNavbar from "../components/AdminNavbar";
import Footer from "../components/Footer";
import golimaams from "../assets/golimaams.png";

function VictimInitialVerification() {
  const token = localStorage.getItem("token");
  const { victimId } = useParams();
  const navigate = useNavigate();

  const [victimData, setVictimData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const getVictimData = async () => {
    try {
      const res = await fetch(`http://localhost:5000/staff/get-victim/${victimId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setVictimData(data.victim);
      } else {
        toast.error(data.message || "Failed to load victim");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && victimId) getVictimData();
  }, [token, victimId]);

  const handleVerify = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/admin/verify-initial-details/${victimId}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("Initial details verified");
        navigate(`/admin/dashboard`);
      } else {
        toast.error(data.message || "Verification failed");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    const reason = window.prompt("Enter rejection reason:");
    if (!reason) return;

    setActionLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/admin/discard-initial-details/${victimId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reason }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("Initial details rejected");
        navigate("/admin/dashboard", { replace: true });
      } else {
        toast.error(data.message || "Rejection failed");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-stone-100">
        <p className="text-lg text-teal-700">Loading...</p>
      </div>
    );
  }

  if (!victimData) return null;

  const originalPhoto = victimData.photo || golimaams;
  const initialPhoto = victimData.initialDetails?.photo || golimaams;

  return (
    <main className="w-full min-h-screen bg-stone-100 font-['QuickSand'] flex flex-col">
      <AdminNavbar />

      <div className="w-full p-8">
        <div className="w-full flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-semibold text-teal-800">
              Verify Initial Details
            </h1>
            <p className="text-slate-600">
              Victim: <span className="text-teal-700 font-medium">{victimData.fullName}</span> ({victimData.victimId})
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="rounded-xl border border-teal-600 px-6 py-2 text-teal-700 hover:bg-teal-50"
          >
            Back
          </button>
        </div>

        <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-6">
          <div className="p-4 rounded-lg border border-teal-600 bg-white shadow-[0px_2px_20px_0px_rgba(96,125,139,0.20)]">
            <div className="text-lg font-semibold text-teal-700 mb-3">
              Original Victim Photo
            </div>
            <img
              src={originalPhoto}
              alt="Original"
              className="w-full h-72 object-cover rounded-lg border border-teal-600"
            />
          </div>

          <div className="p-4 rounded-lg border border-teal-600 bg-white shadow-[0px_2px_20px_0px_rgba(96,125,139,0.20)]">
            <div className="text-lg font-semibold text-teal-700 mb-3">
              Photo captured by Staff
            </div>
            <img
              src={initialPhoto}
              alt="Initial Details"
              className="w-full h-72 object-cover rounded-lg border border-teal-600"
            />
          </div>
        </div>

        <div className="mt-8 p-4 rounded-lg border border-teal-600 bg-white shadow-[0px_2px_20px_0px_rgba(96,125,139,0.20)]">
          <div className="text-lg font-semibold text-teal-700 mb-4">Initial Details Summary</div>
          <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-4 text-slate-700">
            <p>Injuries: {victimData.initialDetails?.injuriesSustained?.join(", ") || "N/A"}</p>
            <p>Disabilities: {victimData.initialDetails?.physicalDisabilities?.join(", ") || "N/A"}</p>
            <p>Pregnancy: {victimData.initialDetails?.pregnancyStatus || "N/A"}</p>
            <p>STI Status: {victimData.initialDetails?.stiStatus || "N/A"}</p>
            <p>Substance Abuse: {victimData.initialDetails?.substanceAbuse?.join(", ") || "N/A"}</p>
            <p>Legal Status: {victimData.initialDetails?.legalStatus || "N/A"}</p>
            <p>Rescue Attempts: {victimData.initialDetails?.rescueAttempts || "N/A"}</p>
            <p>Rescue Details: {victimData.initialDetails?.rescueDetails || "N/A"}</p>
          </div>
        </div>

        <div className="w-full flex justify-end gap-3 mt-8">
          <button
            onClick={handleReject}
            disabled={actionLoading}
            className="rounded-xl bg-red-600 text-white px-6 py-2 hover:bg-red-700 transition-colors font-medium shadow-md disabled:opacity-50"
          >
            Reject
          </button>
          <button
            onClick={handleVerify}
            disabled={actionLoading}
            className="rounded-xl bg-green-600 text-white px-6 py-2 hover:bg-green-700 transition-colors font-medium shadow-md disabled:opacity-50"
          >
            Verify
          </button>
        </div>
      </div>

      <Footer />
    </main>
  );
}

export default VictimInitialVerification;