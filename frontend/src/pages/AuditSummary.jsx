import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import StaffNavbar from "../components/StaffNavbar";
import { getUserData } from "../utils/CommonFetches";

function AuditSummary() {
  const token = localStorage.getItem("token");
  const { auditId } = useParams();
  const navigate = useNavigate();

  const codeId = auditId;
  const [userData, setUserData] = useState(null);
  const [audit, setAudit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!token) {
      setErr("Missing auth token");
      setLoading(false);
      return;
    }

    getUserData(token, setUserData);
  }, [token]);

  useEffect(() => {
    if (!auditId || !token || !userData) {
      return;
    }

    (async () => {
      try {
        setLoading(true);
        const url =`http://localhost:5000/admin/audit-summary/${auditId}`;

        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok)
          throw new Error(
            data.message || data.error || "Failed to fetch audit"
          );
        setAudit(data);
        setErr("");
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [auditId, token, userData]);

  const fieldMap = useMemo(
    () => [
      ["Current Physical Symptoms", "currentPhysicalSymptoms"],
      ["Physical Injuries Sustained", "physicalInjuriesSustained"],
      [
        "Medical Conditions Requiring Treatment",
        "medicalConditionsRequiringTreatment",
      ],
      ["Current Medications And Needs", "currentMedicationsAndNeeds"],
      ["Nutritional Status", "nutritionalStatus"],
      ["Sleep Patterns", "sleepPatterns"],
      ["Trauma Indicators", "traumaIndicators"],
      ["Depression Symptoms", "depressionSymptoms"],
      ["Anxiety Indicators", "anxietyIndicators"],
      ["Dissociative Episodes", "dissociativeEpisodes"],
      ["Self-harm Behaviors", "selfHarmBehaviors"],
      ["Emotional Regulation Challenges", "emotionalRegulationChallenges"],
      ["Trust And Relationship Issues", "trustAndRelationshipIssues"],
      ["Factors Affecting Mental Health", "factorsAffectingMentalHealth"],
      ["Additional Note", "additionalNote"],
      ["Games/Activities/Tasks", "gamesActivitiesTasksPerformedConductedGiven"],
      ["Therapy Attendance Rate", "therapyAttendanceRate"],
      ["Treatment Compliance", "treatmentCompliance"],
      ["Skill Development Milestones", "skillDevelopmentMilestones"],
      ["Behavioral Improvements", "behavioralImprovements"],
      ["Goal Achievement Progress", "goalAchievementProgress"],
      ["Setbacks Indicator", "setbacksIndicator"],
      ["Medication Adherence", "medicationAdherence"],
      ["Additional Note (Progress)", "additionalNoteProgress"],
    ],
    []
  );

  const nonEmpty = useMemo(() => {
    if (!audit) return [];
    return fieldMap.filter(([_, key]) => {
      const v = audit[key];
      return typeof v === "string" ? v.trim().length > 0 : !!v;
    });
  }, [audit, fieldMap]);

  const displayDate = (d) => (d ? new Date(d).toLocaleDateString() : "N/A");

  const resultBlock = () => {
    const r = audit?.result;
    if (!r) {
      return (
        <div className="w-full rounded-xl border border-slate-300 bg-slate-50 text-slate-700 p-4">
          No AI result generated yet.
        </div>
      );
    }
    const de = r.domain_evaluations || {};
    const rows = [
      ["Medical/Physical", de.medical_physical?.status],
      ["Trauma Indicators", de.trauma_indicators?.status],
      ["Progress Tracking", de.progress_tracking?.status],
    ].filter(([, v]) => !!v);

    return (
      <div className="w-full rounded-xl border border-green-600 bg-green-50 text-green-800 p-4">
        <div className="font-semibold mb-2">Result Summary</div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {rows.map(([label, status]) => (
            <div
              key={label}
              className="rounded-lg border border-green-300 bg-white text-green-700 px-3 py-2"
            >
              <div className="text-xs uppercase tracking-wide text-green-600">
                {label}
              </div>
              <div className="font-semibold">{status}</div>
            </div>
          ))}
        </div>

        <div className="mt-3 text-sm">
          Urgent: <span className="font-semibold">{String(r.urgent)}</span>
          {r.next_audit_date && (
            <span className="ml-4">
              Next Audit:{" "}
              <span className="font-semibold">
                {displayDate(r.next_audit_date)}
              </span>
            </span>
          )}
        </div>

        {Array.isArray(r.recommended_actions) &&
          r.recommended_actions.length > 0 && (
            <div className="mt-4">
              <div className="text-sm font-semibold mb-2">
                Recommended Actions
              </div>
              <div className="flex flex-wrap gap-2">
                {r.recommended_actions.map((act, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 rounded-md border border-green-300 bg-white text-green-700"
                  >
                    {act}
                  </span>
                ))}
              </div>
            </div>
          )}
      </div>
    );
  };

  return (
    <main className="min-h-screen w-full font-['QuickSand'] flex flex-col bg-stone-100">
      {userData?.role === "admin" && <AdminNavbar />}
      {userData?.role === "staff" && <StaffNavbar />}

      <div className="w-full p-6 md:p-10">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="text-teal-700 text-2xl font-semibold">
              Audit Summary
            </div>
            <div className="mt-1 text-slate-600 text-sm">
              {codeId && (
                <span className="mr-3">
                  Code:{" "}
                  <span className="font-medium text-slate-800">{codeId}</span>
                </span>
              )}
              {audit?.timestamp && (
                <span className="mr-3">
                  Date:{" "}
                  <span className="font-medium text-slate-800">
                    {displayDate(audit.timestamp)}
                  </span>
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-lg border border-teal-500 text-teal-700 hover:bg-teal-50 transition"
          >
            Back
          </button>
        </div>

        {loading && (
          <div className="w-full rounded-xl border border-teal-600 bg-white p-4 text-teal-700">
            Loading audit details...
          </div>
        )}

        {!loading && err && (
          <div className="w-full rounded-xl border border-rose-400 bg-rose-50 p-4 text-rose-700">
            {err}
          </div>
        )}

        {!loading && audit && !err && (
          <div className="grid grid-cols-1 gap-6">
            <div className="w-full rounded-xl border border-teal-600 bg-white p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nonEmpty.map(([label, key]) => (
                  <div key={key} className="flex flex-col">
                    <div className="text-xs uppercase tracking-wide text-slate-500">
                      {label}
                    </div>
                    <div className="text-slate-800">{audit[key]}</div>
                  </div>
                ))}
                {nonEmpty.length === 0 && (
                  <div className="text-slate-600">No fields to display.</div>
                )}
              </div>
            </div>
            {resultBlock()}
          </div>
        )}
      </div>
    </main>
  );
}

export default AuditSummary;