import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { toast } from "react-toastify";
import StaffNavbar from "../components/StaffNavbar";
import AdminNavbar from "../components/AdminNavbar";
import Footer from "../components/Footer";
import { getUserData } from "../utils/CommonFetches";
import {
  scoreNutritionalStatus,
  scoreSelfHarm,
  scoreEmotionalRegulation,
  scoreTrustIssues,
  scoreTherapyAttendance,
  scoreGoalProgress,
  scoreMedicationAdherence
} from "../utils/auditScoring";

function VictimProgressCharts() {
  const { victimId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [userData, setUserData] = useState(null);
  const [auditHistory, setAuditHistory] = useState([]);
  const [victimName, setVictimName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    getUserData(token, setUserData);
  }, [token]);

  useEffect(() => {
    if (!userData?.id || !victimId) return;

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:5000/admin/${victimId}/audit-history`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        const data = await res.json();
        
        if (res.ok) {
          setAuditHistory(data.audits || []);
          setVictimName(data.victimName || "");
        } else {
          toast.error(data.error || "Failed to fetch audit history");
        }
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userData?.id, victimId, token]);

  const nutritionalData = auditHistory.map((audit, idx) => ({
    audit: `Audit ${idx + 1}`,
    date: new Date(audit.timestamp).toLocaleDateString(),
    score: scoreNutritionalStatus(audit.nutritionalStatus),
    raw: audit.nutritionalStatus || "N/A"
  }));

  const selfHarmData = auditHistory.map((audit, idx) => ({
    audit: `Audit ${idx + 1}`,
    date: new Date(audit.timestamp).toLocaleDateString(),
    score: scoreSelfHarm(audit.selfHarmBehaviors),
    raw: audit.selfHarmBehaviors || "N/A"
  }));

  const emotionalData = auditHistory.map((audit, idx) => ({
    audit: `Audit ${idx + 1}`,
    date: new Date(audit.timestamp).toLocaleDateString(),
    score: scoreEmotionalRegulation(audit.emotionalRegulationChallenges),
    raw: audit.emotionalRegulationChallenges || "N/A"
  }));

  const trustData = auditHistory.map((audit, idx) => ({
    audit: `Audit ${idx + 1}`,
    date: new Date(audit.timestamp).toLocaleDateString(),
    score: scoreTrustIssues(audit.trustAndRelationshipIssues),
    raw: audit.trustAndRelationshipIssues || "N/A"
  }));

  const attendanceData = auditHistory.map((audit, idx) => ({
    audit: `Audit ${idx + 1}`,
    date: new Date(audit.timestamp).toLocaleDateString(),
    score: scoreTherapyAttendance(audit.therapyAttendanceRate),
    raw: audit.therapyAttendanceRate || "N/A"
  }));

  const goalData = auditHistory.map((audit, idx) => ({
    audit: `Audit ${idx + 1}`,
    date: new Date(audit.timestamp).toLocaleDateString(),
    score: scoreGoalProgress(audit.goalAchievementProgress),
    raw: audit.goalAchievementProgress || "N/A"
  }));

  const medicationData = auditHistory.map((audit, idx) => ({
    audit: `Audit ${idx + 1}`,
    date: new Date(audit.timestamp).toLocaleDateString(),
    score: scoreMedicationAdherence(audit.medicationAdherence),
    raw: audit.medicationAdherence || "N/A"
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-teal-600 rounded-lg shadow-lg">
          <p className="text-sm font-semibold text-teal-800">{payload[0].payload.date}</p>
          <p className="text-sm text-slate-700">Score: {payload[0].value}/5</p>
          <p className="text-xs text-slate-600 mt-1">{payload[0].payload.raw}</p>
        </div>
      );
    }
    return null;
  };

  const ChartCard = ({ title, data, color }) => (
    <div className="bg-white p-6 rounded-xl border-2 border-teal-600 shadow-lg">
      <h3 className="text-xl font-semibold text-teal-800 mb-4">{title}</h3>
      {data.length === 0 ? (
        <p className="text-slate-600 text-center py-8">No data available</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="audit" 
              stroke="#0d9488"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              domain={[0, 5]} 
              ticks={[0, 1, 2, 3, 4, 5]}
              stroke="#0d9488"
              style={{ fontSize: '12px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke={color} 
              strokeWidth={3}
              dot={{ fill: color, r: 5 }}
              activeDot={{ r: 7 }}
              name="Progress Score"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-stone-100">
      {userData?.role === "admin" && <AdminNavbar />}
      {userData?.role === "staff" && <StaffNavbar />}

      <main className="flex-1 w-full p-6 md:p-10 font-['QuickSand']">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-teal-800">Progress Tracking</h1>
              <p className="text-lg text-slate-600 mt-2">
                Victim: <span className="font-semibold text-teal-700">{victimName || victimId}</span>
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Total Audits: {auditHistory.length}
              </p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
            >
              Back
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12 text-teal-700 text-lg">
              Loading progress data...
            </div>
          ) : auditHistory.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border-2 border-teal-600 text-center">
              <p className="text-slate-600 text-lg">No audit history available for this victim.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard 
                title="Nutritional Status" 
                data={nutritionalData} 
                color="#10b981" 
              />
              <ChartCard 
                title="Self-Harm Risk Level" 
                data={selfHarmData} 
                color="#ef4444" 
              />
              <ChartCard 
                title="Emotional Regulation" 
                data={emotionalData} 
                color="#f59e0b" 
              />
              <ChartCard 
                title="Trust & Relationships" 
                data={trustData} 
                color="#8b5cf6" 
              />
              <ChartCard 
                title="Therapy Attendance" 
                data={attendanceData} 
                color="#0d9488" 
              />
              <ChartCard 
                title="Goal Achievement" 
                data={goalData} 
                color="#06b6d4" 
              />
              <ChartCard 
                title="Medication Adherence" 
                data={medicationData} 
                color="#6366f1" 
              />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default VictimProgressCharts;