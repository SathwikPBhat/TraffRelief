import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import StaffNavbar from "../components/StaffNavbar";
import PhysicalAssessment from "../components/auditForms/PhysicalAssessment";
import ProgressTracking from "../components/auditForms/ProgressTracking";
import PsychologicalAssessment from "../components/auditForms/PsychologicalAssessment";
import { getUserData } from "../utils/CommonFetches";

function Audit() {
  const tabs = [
    { id: "physical", label: "Physical & Medical Assessment" },
    { id: "psychological", label: "Psychological & Emotional Assessment" },
    { id: "progress", label: "Progress Tracking" },
  ];
  const { victimId } = useParams();
  const token = localStorage.getItem("token");
  const [userData, setUserData] = useState(null);
  const [victimData, setVictimData] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const currentTab = tabs[tabIndex].id;
  const currentLabel = tabs[tabIndex].label;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    physicalSymptoms: [],
    otherPhysicalSymptoms: "",
    physicalInjuries: "",
    medicalConditions: [],
    otherMedicalConditions: "",
    currentMedications: "",
    nutritionalStatus: "",
    sleepPatterns: "",
    otherSleepPatterns: "",
    physicalAdditionalNotes: "",
    traumaIndicators: [],
    otherTrauma: "",
    depressionSymptoms: [],
    otherDepression: "",
    anxietyIndicators: [],
    otherAnxiety: "",
    dissociativeEpisodes: [],
    otherDissociative: "",
    selfHarmBehavior: "",
    emotionalRegulation: [],
    otherEmotional: "",
    trustIssues: [],
    otherTrust: "",
    mentalHealthFactors: [],
    otherMentalHealth: "",
    activitiesPerformed: [],
    otherActivities: "",
    therapyAttendance: "",
    otherTherapyAttendance: "",
    treatmentCompliance: "",
    otherTreatmentCompliance: "",
    skillDevelopment: [],
    otherSkillDevelopment: "",
    behavioralImprovements: [],
    otherBehavioralImprovements: "",
    goalProgress: "",
    otherGoalProgress: "",
    setbacksIndicator: "",
    otherSetbacks: "",
    medicationAdherence: "",
    otherMedicationAdherence: "",
    progressAdditionalNotes: "",
    socialNotes: "",
    additionalNotes: "",
  });

  const handleMultiSelectChange = (field, selected) => {
    setFormData((prev) => ({ ...prev, [field]: selected || [] }));
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const nextTab = () => {
    if (tabIndex < tabs.length - 1) setTabIndex((i) => i + 1);
  };

  const prevTab = () => {
    if (tabIndex > 0) setTabIndex((i) => i - 1);
  };

  useEffect(() => {
    if (!token) return;
    getUserData(token, setUserData);
  }, [token]);

  useEffect(() => {
    if (!userData?.id || !victimId) return;

    const getVictimData = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/staff/get-victim/${victimId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (res.ok) {
          setVictimData(data.victim);
        } else {
          toast.error(data.message);
        }
      } catch (err) {
        toast.error(err.message);
      }
    };

    getVictimData();
  }, [userData?.id, victimId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userData?.id) {
      toast.error("User data not loaded");
      return;
    }

    const pick = (arr) =>
      Array.isArray(arr) && arr.length
        ? arr.map((o) => (typeof o === "string" ? o : o.value)).join(", ")
        : "";

    const auditPayload = {
      currentPhysicalSymptoms:
        pick(formData.physicalSymptoms) +
        (formData.otherPhysicalSymptoms
          ? `, ${formData.otherPhysicalSymptoms}`
          : ""),
      physicalInjuriesSustained: formData.physicalInjuries || "",
      medicalConditionsRequiringTreatment:
        pick(formData.medicalConditions) +
        (formData.otherMedicalConditions
          ? `, ${formData.otherMedicalConditions}`
          : ""),
      currentMedicationsAndNeeds: formData.currentMedications || "",
      nutritionalStatus: formData.nutritionalStatus || "",
      sleepPatterns:
        pick(formData.sleepPatterns) +
        (formData.otherSleepPatterns ? `, ${formData.otherSleepPatterns}` : ""),
      traumaIndicators:
        pick(formData.traumaIndicators) +
        (formData.otherTrauma ? `, ${formData.otherTrauma}` : ""),
      depressionSymptoms:
        pick(formData.depressionSymptoms) +
        (formData.otherDepression ? `, ${formData.otherDepression}` : ""),
      anxietyIndicators:
        pick(formData.anxietyIndicators) +
        (formData.otherAnxiety ? `, ${formData.otherAnxiety}` : ""),
      dissociativeEpisodes:
        pick(formData.dissociativeEpisodes) +
        (formData.otherDissociative ? `, ${formData.otherDissociative}` : ""),
      selfHarmBehaviors: formData.selfHarmBehavior || "",
      emotionalRegulationChallenges:
        pick(formData.emotionalRegulation) +
        (formData.otherEmotional ? `, ${formData.otherEmotional}` : ""),
      trustAndRelationshipIssues:
        pick(formData.trustIssues) +
        (formData.otherTrust ? `, ${formData.otherTrust}` : ""),
      factorsAffectingMentalHealth:
        pick(formData.mentalHealthFactors) +
        (formData.otherMentalHealth ? `, ${formData.otherMentalHealth}` : ""),
      additionalNote: [
        formData.physicalAdditionalNotes,
        formData.additionalNotes,
      ]
        .filter(Boolean)
        .join(" ")
        .trim(),
      gamesActivitiesTasksPerformedConductedGiven:
        pick(formData.activitiesPerformed) +
        (formData.otherActivities ? `, ${formData.otherActivities}` : ""),
      therapyAttendanceRate:
        formData.therapyAttendance || formData.otherTherapyAttendance || "",
      treatmentCompliance:
        formData.treatmentCompliance || formData.otherTreatmentCompliance || "",
      skillDevelopmentMilestones:
        pick(formData.skillDevelopment) +
        (formData.otherSkillDevelopment
          ? `, ${formData.otherSkillDevelopment}`
          : ""),
      behavioralImprovements:
        pick(formData.behavioralImprovements) +
        (formData.otherBehavioralImprovements
          ? `, ${formData.otherBehavioralImprovements}`
          : ""),
      goalAchievementProgress:
        formData.goalProgress || formData.otherGoalProgress || "",
      setbacksIndicator:
        formData.setbacksIndicator || formData.otherSetbacks || "",
      medicationAdherence:
        formData.medicationAdherence || formData.otherMedicationAdherence || "",
      additionalNoteProgress: formData.progressAdditionalNotes || "",
    };

    try {
      const res = await fetch(
        `http://localhost:5000/staff/${userData.id}/${victimId}/add-audit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(auditPayload),
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("Audit submitted successfully");
        navigate(-1);
      } else {
        toast.error(data.error || data.message || "Audit submission failed");
      }
    } catch (err) {
      toast.error("Error submitting audit: " + err.message);
    }
  };

  return (
    <main className="w-full min-h-screen bg-stone-100 font-['QuickSand'] flex flex-col">
      <StaffNavbar />
      <div className="w-full p-10 flex flex-col gap-10">
        <div className="w-full text-3xl font-semibold text-black flex items-center justify-center">
          {currentLabel}
        </div>
        <div className="w-full text-xl font-semibold text-teal-700 flex items-center justify-center">
          Date: {new Date().toLocaleDateString()}
        </div>
        <div className="w-full text-xl font-semibold text-teal-700 flex items-center justify-center">
          Victim Name : {victimData ? victimData.fullName : "Loading..."}
        </div>
        <form
          onSubmit={handleSubmit}
          className="w-full flex items-start justify-center"
        >
          <div className="bg-white p-8 pt-12 rounded-xl border-2 border-teal-600 shadow-lg lg:w-3/4 w-full flex flex-col">
            {currentTab === "physical" && (
              <PhysicalAssessment
                formData={formData}
                handleMultiSelectChange={handleMultiSelectChange}
                handleChange={handleChange}
              />
            )}
            {currentTab === "psychological" && (
              <PsychologicalAssessment
                formData={formData}
                handleMultiSelectChange={handleMultiSelectChange}
                handleChange={handleChange}
              />
            )}
            {currentTab === "progress" && (
              <ProgressTracking
                formData={formData}
                handleMultiSelectChange={handleMultiSelectChange}
                handleChange={handleChange}
              />
            )}

            <div className="flex justify-between items-center mt-10">
              <button
                type="button"
                onClick={prevTab}
                disabled={tabIndex === 0}
                className={`px-6 py-2 rounded-xl font-medium border-2 transition
                    ${
                      tabIndex === 0
                        ? "opacity-0 pointer-events-none"
                        : "border-teal-600 text-teal-700 bg-white hover:bg-teal-50"
                    }
                  `}
              >
                Prev
              </button>

              {tabIndex < tabs.length - 1 && (
                <button
                  type="button"
                  onClick={nextTab}
                  className="px-8 py-2 rounded-xl font-semibold bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-md"
                >
                  Next
                </button>
              )}

              {tabIndex === tabs.length - 1 && (
                <button
                  type="submit"
                  className="px-8 py-2 rounded-xl font-semibold bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-md"
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Audit;