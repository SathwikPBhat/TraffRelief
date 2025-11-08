import React from 'react';
import Select from 'react-select';
import { 
  customStyles, 
  activitiesOptions, 
  therapyAttendanceOptions, 
  treatmentComplianceOptions,
  skillDevelopmentOptions,
  behavioralImprovementsOptions,
  goalProgressOptions,
  setbacksOptions,
  medicationAdherenceOptions
} from '../../utils/auditOptions';

function ProgressTracking({ formData, handleMultiSelectChange, handleChange }) {
  return (
    <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-6">
      
      {/* Games/Activities/Tasks */}
      <div className="flex flex-col gap-2">
        <label className="font-bold text-teal-800">
          Games/Activities/Tasks Performed
        </label>
        <Select
          options={activitiesOptions}
          isMulti
          placeholder="Select activities..."
          value={formData.activitiesPerformed}
          onChange={(selected) => handleMultiSelectChange("activitiesPerformed", selected)}
          styles={customStyles}
          closeMenuOnSelect={false}
        />
        <input
          type="text"
          name="otherActivities"
          value={formData.otherActivities}
          onChange={handleChange}
          placeholder="Other (please specify)..."
          className="h-10 p-3 border border-teal-600 rounded-xl bg-stone-50 text-sm"
        />
      </div>

      {/* Therapy Attendance Rate */}
      <div className="flex flex-col gap-2">
        <label className="font-bold text-teal-800">
          Therapy Attendance Rate
        </label>
        <select
          name="therapyAttendance"
          value={formData.therapyAttendance}
          onChange={handleChange}
          className="h-12 px-4 border-2 border-teal-600 rounded-xl bg-stone-50"
        >
          <option value="">-- Select Attendance Rate --</option>
          {therapyAttendanceOptions.map((opt, idx) => (
            <option key={idx} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="otherTherapyAttendance"
          value={formData.otherTherapyAttendance}
          onChange={handleChange}
          placeholder="Other (please specify)..."
          className="h-10 p-3 border border-teal-600 rounded-xl bg-stone-50 text-sm"
        />
      </div>

      {/* Treatment Compliance */}
      <div className="flex flex-col gap-2">
        <label className="font-bold text-teal-800">
          Treatment Compliance
        </label>
        <select
          name="treatmentCompliance"
          value={formData.treatmentCompliance}
          onChange={handleChange}
          className="h-12 px-4 border-2 border-teal-600 rounded-xl bg-stone-50"
        >
          <option value="">-- Select Compliance Level --</option>
          {treatmentComplianceOptions.map((opt, idx) => (
            <option key={idx} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="otherTreatmentCompliance"
          value={formData.otherTreatmentCompliance}
          onChange={handleChange}
          placeholder="Other (please specify)..."
          className="h-10 p-3 border border-teal-600 rounded-xl bg-stone-50 text-sm"
        />
      </div>

      {/* Skill Development Milestones */}
      <div className="flex flex-col gap-2">
        <label className="font-bold text-teal-800">
          Skill Development Milestones
        </label>
        <Select
          options={skillDevelopmentOptions}
          isMulti
          placeholder="Select skill milestones..."
          value={formData.skillDevelopment}
          onChange={(selected) => handleMultiSelectChange("skillDevelopment", selected)}
          styles={customStyles}
          closeMenuOnSelect={false}
        />
        <input
          type="text"
          name="otherSkillDevelopment"
          value={formData.otherSkillDevelopment}
          onChange={handleChange}
          placeholder="Other (please specify)..."
          className="h-10 p-3 border border-teal-600 rounded-xl bg-stone-50 text-sm"
        />
      </div>

      {/* Behavioral Improvements */}
      <div className="flex flex-col gap-2">
        <label className="font-bold text-teal-800">
          Behavioral Improvements
        </label>
        <Select
          options={behavioralImprovementsOptions}
          isMulti
          placeholder="Select behavioral improvements..."
          value={formData.behavioralImprovements}
          onChange={(selected) => handleMultiSelectChange("behavioralImprovements", selected)}
          styles={customStyles}
          closeMenuOnSelect={false}
        />
        <input
          type="text"
          name="otherBehavioralImprovements"
          value={formData.otherBehavioralImprovements}
          onChange={handleChange}
          placeholder="Other (please specify)..."
          className="h-10 p-3 border border-teal-600 rounded-xl bg-stone-50 text-sm"
        />
      </div>

      {/* Goal Achievement Progress */}
      <div className="flex flex-col gap-2">
        <label className="font-bold text-teal-800">
          Goal Achievement Progress
        </label>
        <select
          name="goalProgress"
          value={formData.goalProgress}
          onChange={handleChange}
          className="h-12 px-4 border-2 border-teal-600 rounded-xl bg-stone-50"
        >
          <option value="">-- Select Progress Level --</option>
          {goalProgressOptions.map((opt, idx) => (
            <option key={idx} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="otherGoalProgress"
          value={formData.otherGoalProgress}
          onChange={handleChange}
          placeholder="Other (please specify)..."
          className="h-10 p-3 border border-teal-600 rounded-xl bg-stone-50 text-sm"
        />
      </div>

      {/* Setbacks Indicator */}
      <div className="flex flex-col gap-2">
        <label className="font-bold text-teal-800">
          Setbacks Indicator
        </label>
        <select
          name="setbacksIndicator"
          value={formData.setbacksIndicator}
          onChange={handleChange}
          className="h-12 px-4 border-2 border-teal-600 rounded-xl bg-stone-50"
        >
          <option value="">-- Select Setback Level --</option>
          {setbacksOptions.map((opt, idx) => (
            <option key={idx} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="otherSetbacks"
          value={formData.otherSetbacks}
          onChange={handleChange}
          placeholder="Other (please specify)..."
          className="h-10 p-3 border border-teal-600 rounded-xl bg-stone-50 text-sm"
        />
      </div>

      {/* Medication Adherence */}
      <div className="flex flex-col gap-2">
        <label className="font-bold text-teal-800">
          Medication Adherence
        </label>
        <select
          name="medicationAdherence"
          value={formData.medicationAdherence}
          onChange={handleChange}
          className="h-12 px-4 border-2 border-teal-600 rounded-xl bg-stone-50"
        >
          <option value="">-- Select Adherence Level --</option>
          {medicationAdherenceOptions.map((opt, idx) => (
            <option key={idx} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="otherMedicationAdherence"
          value={formData.otherMedicationAdherence}
          onChange={handleChange}
          placeholder="Other (please specify)..."
          className="h-10 p-3 border border-teal-600 rounded-xl bg-stone-50 text-sm"
        />
      </div>

      {/* Additional Notes - Full Width */}
      <div className="flex flex-col gap-2 col-span-full">
        <label className="font-bold text-teal-800">
          Additional Notes
        </label>
        <textarea
          name="progressAdditionalNotes"
          value={formData.progressAdditionalNotes}
          onChange={handleChange}
          placeholder="Enter any additional observations or notes..."
          rows="5"
          className="p-3 border-2 border-teal-600 rounded-xl bg-stone-50 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>
    </div>
  );
}

export default ProgressTracking;