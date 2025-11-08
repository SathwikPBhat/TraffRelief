import React from "react";
import Select from "react-select";
import {
  customStyles,
  physicalSymptomsOptions,
  medicalConditionsOptions,
  nutritionalStatusOptions,
  sleepPatternsOptions,
} from "../../utils/auditOptions";

function PhysicalAssessment({
  formData,
  handleMultiSelectChange,
  handleChange,
}) {
  return (
    <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-6">
      {/* Current Physical Symptoms */}
      <div className="flex flex-col gap-2">
        <label className="font-bold text-teal-800">
          Current Physical Symptoms
        </label>
        <Select
          options={physicalSymptomsOptions}
          isMulti
          placeholder="Select physical symptoms..."
          value={formData.physicalSymptoms}
          onChange={(selected) =>
            handleMultiSelectChange("physicalSymptoms", selected)
          }
          styles={customStyles}
          closeMenuOnSelect={false}
        />
        <input
          type="text"
          name="otherPhysicalSymptoms"
          value={formData.otherPhysicalSymptoms}
          onChange={handleChange}
          placeholder="Other (please specify)..."
          className="h-10 p-3 border border-teal-600 rounded-xl bg-stone-50 text-sm"
        />
      </div>

      {/* Physical Injuries Sustained */}
      <div className="flex flex-col gap-2">
        <label className="font-bold text-teal-800">
          Physical Injuries Sustained
        </label>
        <textarea
          name="physicalInjuries"
          value={formData.physicalInjuries}
          onChange={handleChange}
          placeholder="Describe any injuries (e.g., bruised left arm, minor cut on forehead)..."
          rows="4"
          className="p-3 border-2 border-teal-600 rounded-xl bg-stone-50 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* Medical Conditions Requiring Treatment */}
      <div className="flex flex-col gap-2">
        <label className="font-bold text-teal-800">
          Medical Conditions Requiring Treatment
        </label>
        <Select
          options={medicalConditionsOptions}
          isMulti
          placeholder="Select medical conditions..."
          value={formData.medicalConditions}
          onChange={(selected) =>
            handleMultiSelectChange("medicalConditions", selected)
          }
          styles={customStyles}
          closeMenuOnSelect={false}
        />
        <input
          type="text"
          name="otherMedicalConditions"
          value={formData.otherMedicalConditions}
          onChange={handleChange}
          placeholder="Other (please specify)..."
          className="h-10 p-3 border border-teal-600 rounded-xl bg-stone-50 text-sm"
        />
      </div>

      {/* Current Medications and Needs */}
      <div className="flex flex-col gap-2">
        <label className="font-bold text-teal-800">
          Current Medications and Needs
        </label>
        <textarea
          name="currentMedications"
          value={formData.currentMedications}
          onChange={handleChange}
          placeholder="List medications and dosages (e.g., Paracetamol 500mg, Thyroxine 50mcg daily)..."
          rows="4"
          className="p-3 border-2 border-teal-600 rounded-xl bg-stone-50 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* Nutritional Status */}
      <div className="flex flex-col gap-2">
        <label className="font-bold text-teal-800">Nutritional Status</label>
        <select
          name="nutritionalStatus"
          value={formData.nutritionalStatus}
          onChange={handleChange}
          className="h-12 px-4 border-2 border-teal-600 rounded-xl bg-stone-50"
        >
          <option value="">-- Select Nutritional Status --</option>
          {nutritionalStatusOptions.map((opt, idx) => (
            <option key={idx} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Sleep Patterns */}
      <div className="flex flex-col gap-2">
        <label className="font-bold text-teal-800">Sleep Pattern</label>
        <select
          name="sleepPattern"
          value={formData.sleepPattern}
          onChange={handleChange}
          className="h-12 px-4 border-2 border-teal-600 rounded-xl bg-stone-50"
        >
          <option value="">-- Select Sleep Pattern --</option>
          {sleepPatternsOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="otherSleepPatterns"
          value={formData.otherSleepPatterns}
          onChange={handleChange}
          placeholder="Other (please specify)..."
          className="h-10 p-3 border border-teal-600 rounded-xl bg-stone-50 text-sm"
        />
      </div>

      {/* Additional Notes - Full Width */}
      <div className="flex flex-col gap-2 col-span-full">
        <label className="font-bold text-teal-800">
          Additional Physical Health Notes
        </label>
        <textarea
          name="physicalAdditionalNotes"
          value={formData.physicalAdditionalNotes}
          onChange={handleChange}
          placeholder="Enter any additional physical health observations..."
          rows="5"
          className="p-3 border-2 border-teal-600 rounded-xl bg-stone-50 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>
    </div>
  );
}

export default PhysicalAssessment;
