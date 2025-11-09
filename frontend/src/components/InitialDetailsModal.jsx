import React, { useState, useEffect } from "react";
import Select from "react-select";
import { customStyles } from "../utils/auditOptions";
import { toast } from "react-toastify";

const injuriesOptions = [
  { value: "Bruises", label: "Bruises" },
  { value: "Cuts", label: "Cuts" },
  { value: "Burns", label: "Burns" },
  { value: "Fractures", label: "Fractures" },
  { value: "Head Injury", label: "Head Injury" },
];

const physicalDisabilitiesOptions = [
  { value: "Vision Impairment", label: "Vision Impairment" },
  { value: "Hearing Impairment", label: "Hearing Impairment" },
  { value: "Speech Difficulty", label: "Speech Difficulty" },
  { value: "Mobility Impairment", label: "Mobility Impairment" },
  {
    value: "Cognitive/Developmental Disability",
    label: "Cognitive/Developmental Disability",
  },
];

const pregnancyStatusOptions = [
  "Not Applicable",
  "Not Pregnant",
  "Pregnant - 1st Trimester",
  "Pregnant - 2nd Trimester",
  "Pregnant - 3rd Trimester",
  "Recently Delivered",
  "Unknown",
];

const stiStatusOptions = [
  "Unknown",
  "Not Tested",
  "Tested - Negative",
  "Tested - Positive (Treated)",
  "Tested - Positive (Ongoing Treatment)",
  "Declined to Disclose",
];

const substanceAbuseOptions = [
  { value: "Alcohol", label: "Alcohol" },
  { value: "Tobacco", label: "Tobacco" },
  { value: "Prescription Drugs", label: "Prescription Drugs" },
  { value: "Opioids", label: "Opioids" },
  { value: "Inhalants", label: "Inhalants" },
  { value: "Cannabis", label: "Cannabis" },
];

const rescueAttemptsOptions = ["None", "Once", "Multiple"];

const legalStatusOptions = [
  "No Legal Cases",
  "Under Investigation",
  "On Probation",
  "Awaiting Court Hearing",
  "Convicted",
  "Parole",
  "Unknown",
];

function InitialDetailsModal({ victims = [], onClose }) {
  const [idx, setIdx] = useState(0);
  const currentVictim = victims[idx];
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    injuriesSustained: [],
    otherInjuries: "",
    physicalDisabilities: [],
    otherDisabilities: "",
    pregnancyStatus: "",
    stiStatus: "",
    substanceAbuse: [],
    otherSubstanceAbuse: "",
    rescueAttempts: "",
    rescueDetails: "",
    legalStatus: "",
    photo: null,
  });

  useEffect(() => {
    // Reset form when victim changes
    setFormData({
      injuriesSustained: [],
      otherInjuries: "",
      physicalDisabilities: [],
      otherDisabilities: "",
      pregnancyStatus: "",
      stiStatus: "",
      substanceAbuse: [],
      otherSubstanceAbuse: "",
      rescueAttempts: "",
      rescueDetails: "",
      legalStatus: "",
      photo: null,
    });
  }, [idx]);

  const handleMultiSelectChange = (field, selected) => {
    setFormData((prev) => ({ ...prev, [field]: selected || [] }));
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    if (!currentVictim) return;

    const data = new FormData();
    data.append("victimId", currentVictim.victimId);
    data.append(
      "injuriesSustained",
      JSON.stringify(formData.injuriesSustained.map((i) => i.value))
    );
    data.append("otherInjuries", formData.otherInjuries);
    data.append(
      "physicalDisabilities",
      JSON.stringify(formData.physicalDisabilities.map((d) => d.value))
    );
    data.append("otherDisabilities", formData.otherDisabilities);
    data.append("pregnancyStatus", formData.pregnancyStatus);
    data.append("stiStatus", formData.stiStatus);
    data.append(
      "substanceAbuse",
      JSON.stringify(formData.substanceAbuse.map((s) => s.value))
    );
    data.append("otherSubstanceAbuse", formData.otherSubstanceAbuse);
    data.append("rescueAttempts", formData.rescueAttempts);
    data.append("rescueDetails", formData.rescueDetails);
    data.append("legalStatus", formData.legalStatus);
    if (formData.photo) {
      data.append("photo", formData.photo);
    }

    try {
      const res = await fetch(
        `http://localhost:5000/staff/add-initial-details`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        }
      );
      const result = await res.json();

      if (res.ok) {
        toast.success(`Initial details saved for ${currentVictim.fullName}`, {
          toastId: "initial-details-success",
        });
        
      } else {
        toast.error(result.message || "Failed to save initial details", {
          toastId: "initial-details-error",
        });
      }
    } catch (err) {
      toast.error(err.message, { toastId: "initial-details-error" });
    }
  };

  if (!currentVictim) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto py-8">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 bg-white w-full max-w-4xl rounded-2xl border-2 border-teal-600 p-8 m-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-teal-200">
          <div>
            <p className="text-2xl font-bold text-teal-800">
              Initial Intake Details
            </p>
            <p className="text-sm text-slate-600 mt-1">
              Victim {idx + 1} of {victims.length}: {currentVictim.fullName} (
              {currentVictim.victimId})
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-2xl text-slate-500 hover:text-slate-700"
          >
            ×
          </button>
        </div>

        {/* Form Grid */}
        <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-6">
          {/* Injuries Sustained */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-teal-800">
              Injuries Sustained
            </label>
            <Select
              options={injuriesOptions}
              isMulti
              placeholder="Select injuries..."
              value={formData.injuriesSustained}
              onChange={(selected) =>
                handleMultiSelectChange("injuriesSustained", selected)
              }
              styles={customStyles}
              closeMenuOnSelect={false}
            />
            <input
              type="text"
              name="otherInjuries"
              value={formData.otherInjuries}
              onChange={handleChange}
              placeholder="Other (please specify)..."
              className="h-10 p-3 border border-teal-600 rounded-xl bg-stone-50 text-sm"
            />
          </div>

          {/* Physical Disabilities */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-teal-800">
              Physical Disabilities
            </label>
            <Select
              options={physicalDisabilitiesOptions}
              isMulti
              placeholder="Select disabilities..."
              value={formData.physicalDisabilities}
              onChange={(selected) =>
                handleMultiSelectChange("physicalDisabilities", selected)
              }
              styles={customStyles}
              closeMenuOnSelect={false}
            />
            <input
              type="text"
              name="otherDisabilities"
              value={formData.otherDisabilities}
              onChange={handleChange}
              placeholder="Other (please specify)..."
              className="h-10 p-3 border border-teal-600 rounded-xl bg-stone-50 text-sm"
            />
          </div>

          {/* Pregnancy Status */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-teal-800">Pregnancy Status</label>
            <select
              name="pregnancyStatus"
              value={formData.pregnancyStatus}
              onChange={handleChange}
              className="h-12 px-4 border-2 border-teal-600 rounded-xl bg-stone-50"
            >
              <option value="">-- Select Pregnancy Status --</option>
              {pregnancyStatusOptions.map((opt, idx) => (
                <option key={idx} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* STI Status */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-teal-800">STI Status</label>
            <select
              name="stiStatus"
              value={formData.stiStatus}
              onChange={handleChange}
              className="h-12 px-4 border-2 border-teal-600 rounded-xl bg-stone-50"
            >
              <option value="">-- Select STI Status --</option>
              {stiStatusOptions.map((opt, idx) => (
                <option key={idx} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Substance Abuse History */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-teal-800">
              History of Substance Abuse
            </label>
            <Select
              options={substanceAbuseOptions}
              isMulti
              placeholder="Select substances..."
              value={formData.substanceAbuse}
              onChange={(selected) =>
                handleMultiSelectChange("substanceAbuse", selected)
              }
              styles={customStyles}
              closeMenuOnSelect={false}
            />
            <input
              type="text"
              name="otherSubstanceAbuse"
              value={formData.otherSubstanceAbuse}
              onChange={handleChange}
              placeholder="Other (please specify)..."
              className="h-10 p-3 border border-teal-600 rounded-xl bg-stone-50 text-sm"
            />
          </div>

          {/* Previous Rescue Attempts */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-teal-800">
              Previous Rescue Attempts
            </label>
            <select
              name="rescueAttempts"
              value={formData.rescueAttempts}
              onChange={handleChange}
              className="h-12 px-4 border-2 border-teal-600 rounded-xl bg-stone-50"
            >
              <option value="">-- Select --</option>
              {rescueAttemptsOptions.map((opt, idx) => (
                <option key={idx} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Legal Status */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-teal-800">Legal Status</label>
            <select
              name="legalStatus"
              value={formData.legalStatus}
              onChange={handleChange}
              className="h-12 px-4 border-2 border-teal-600 rounded-xl bg-stone-50"
            >
              <option value="">-- Select Legal Status --</option>
              {legalStatusOptions.map((opt, idx) => (
                <option key={idx} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Photo Upload */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-teal-800">Upload Photo</label>
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleChange}
              className="h-12 px-4 border-2 border-teal-600 rounded-xl bg-stone-50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
            />
          </div>

          {/* Rescue Details (conditional - full width) */}
          {(formData.rescueAttempts === "Once" ||
            formData.rescueAttempts === "Multiple") && (
            <div className="flex flex-col gap-2 col-span-full">
              <label className="font-bold text-teal-800">
                Rescue Details (When and by whom?)
              </label>
              <textarea
                name="rescueDetails"
                value={formData.rescueDetails}
                onChange={handleChange}
                placeholder="Describe previous rescue attempts..."
                rows="3"
                className="p-3 border-2 border-teal-600 rounded-xl bg-stone-50 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-between items-center pt-6 border-t border-teal-200">

          <button
            onClick={handleSubmit}
            className="px-8 py-2 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition shadow-md"
          >
            {idx < victims.length - 1 ? "Save & Next" : "Save & Finish"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default InitialDetailsModal;