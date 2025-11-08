import React, { useState } from "react";
import StaffNavbar from "../components/StaffNavbar";
import PsychologicalAssessment from "../components/auditForms/PsychologicalAssessment";
import ProgressTracking from "../components/auditForms/ProgressTracking";
import PhysicalAssessment from "../components/auditForms/PhysicalAssessment";

function Audit() {
  const tabs = [
    { id: "physical", label: "Physical & Medical Assessment" },
    { id: "psychological", label: "Psychological & Emotional Assessment" },
    { id: "progress", label: "Progress Tracking" },
    { id: "social", label: "Social Integration" },
  ];

  const [tabIndex, setTabIndex] = useState(0);
  const currentTab = tabs[tabIndex].id;
  const currentLabel = tabs[tabIndex].label;

  const [formData, setFormData] = useState({
    // Physical & Medical
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

    // Psychological & Emotional
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

    // Progress Tracking
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

    // Social
    socialNotes: "",

    // Final notes (last tab)
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Audit Data:", formData);
    // submit logic- not done yet
  };

  return (
    <main className="w-full min-h-screen bg-stone-100 font-['QuickSand'] flex flex-col">
      <StaffNavbar />
      <div className="w-full p-10 flex flex-col gap-10">
        <div className="w-full text-3xl font-semibold text-black flex items-center justify-center">
          {currentLabel}
        </div>
        <div className="w-full text-xl font-semibold text-teal-700 flex items-center justify-center">
          Date: 8/11/2025
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
            {currentTab === "social" && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-teal-800">
                    Social Integration Notes
                  </label>
                  <textarea
                    name="socialNotes"
                    value={formData.socialNotes}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Enter observations on peer interaction, engagement, social confidence..."
                    className="p-3 border-2 border-teal-600 rounded-xl bg-stone-50 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  />
                </div>
              </div>
            )}

            {/* Additional Notes only on last tab */}
            {tabIndex === tabs.length - 1 && (
              <div className="flex flex-col gap-2 mt-8">
                <label className="font-semibold text-teal-800">
                  Additional Notes
                </label>
                <textarea
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  placeholder="Enter any final observations or notes..."
                  rows="6"
                  className="p-3 border-2 border-teal-600 rounded-xl bg-stone-50 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            )}

            {/* Navigation / Submit */}
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
