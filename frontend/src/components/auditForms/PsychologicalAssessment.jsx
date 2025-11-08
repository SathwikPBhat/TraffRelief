import React from 'react';
import Select from 'react-select';
import { customStyles, traumaOptions, depressionOptions, anxietyOptions, dissociativeOptions, selfHarmOptions, emotionalRegulationOptions, trustOptions, mentalHealthFactorsOptions } from '../../utils/auditOptions';

function PsychologicalAssessment({ formData, handleMultiSelectChange, handleChange }) {
  return (
    <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-6">

      <div className="flex flex-col gap-2">
        <label className="font-bold text-teal-800">Trauma Indicators</label>
        <Select
          options={traumaOptions}
          isMulti
          placeholder="Select trauma indicators..."
          value={formData.traumaIndicators}
          onChange={(selected) => handleMultiSelectChange("traumaIndicators", selected)}
          styles={customStyles}
          closeMenuOnSelect={false}
        />
        <input
          type="text"
          name="otherTrauma"
          value={formData.otherTrauma}
          onChange={handleChange}
          placeholder="Other (please specify)..."
          className="h-10 p-3 border border-teal-600 rounded-xl bg-stone-50 text-sm"
        />
      </div>

    {/* Depression Symptoms */}
              <div className="flex flex-col gap-2">
                <label className="font-bold text-teal-800">
                  Depression Symptoms
                </label>
                <Select
                  options={depressionOptions}
                  isMulti
                  placeholder="Select depression symptoms..."
                  value={formData.depressionSymptoms}
                  onChange={(selected) =>
                    handleMultiSelectChange("depressionSymptoms", selected)
                  }
                  styles={customStyles}
                  closeMenuOnSelect={false}
                />
                <input
                  type="text"
                  name="otherDepression"
                  value={formData.otherDepression}
                  onChange={handleChange}
                  placeholder="Other (please specify)..."
                  className="h-10 p-3 border border-teal-600 rounded-xl bg-stone-50 text-sm"
                />
              </div>

              {/* Anxiety Indicators */}
              <div className="flex flex-col gap-2">
                <label className="font-bold text-teal-800">
                  Anxiety Indicators
                </label>
                <Select
                  options={anxietyOptions}
                  isMulti
                  placeholder="Select anxiety indicators..."
                  value={formData.anxietyIndicators}
                  onChange={(selected) =>
                    handleMultiSelectChange("anxietyIndicators", selected)
                  }
                  styles={customStyles}
                  closeMenuOnSelect={false}
                />
                <input
                  type="text"
                  name="otherAnxiety"
                  value={formData.otherAnxiety}
                  onChange={handleChange}
                  placeholder="Other (please specify)..."
                  className="h-10 p-3 border border-teal-600 rounded-xl bg-stone-50 text-sm"
                />
              </div>

              {/* Dissociative Episodes */}
              <div className="flex flex-col gap-2">
                <label className="font-bold text-teal-800">
                  Dissociative Episodes
                </label>
                <Select
                  options={dissociativeOptions}
                  isMulti
                  placeholder="Select dissociative episodes..."
                  value={formData.dissociativeEpisodes}
                  onChange={(selected) =>
                    handleMultiSelectChange("dissociativeEpisodes", selected)
                  }
                  styles={customStyles}
                  closeMenuOnSelect={false}
                />
                <input
                  type="text"
                  name="otherDissociative"
                  value={formData.otherDissociative}
                  onChange={handleChange}
                  placeholder="Other (please specify)..."
                  className="h-10 p-3 border border-teal-600 rounded-xl bg-stone-50 text-sm"
                />
              </div>

              {/* Self-Harm Behaviors */}
              <div className="flex flex-col gap-2">
                <label className="font-bold text-teal-800">
                  Self-Harm Behaviors
                </label>
                <select
                  name="selfHarmBehavior"
                  value={formData.selfHarmBehavior}
                  onChange={handleChange}
                  className="h-12 px-4 border-2 border-teal-600 rounded-xl bg-stone-50"
                >
                  <option value="">-- Select Self-Harm Risk Level --</option>
                  {selfHarmOptions.map((opt, idx) => (
                    <option key={idx} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Emotional Regulation Challenges */}
              <div className="flex flex-col gap-2">
                <label className="font-bold text-teal-800">
                  Emotional Regulation Challenges
                </label>
                <Select
                  options={emotionalRegulationOptions}
                  isMulti
                  placeholder="Select emotional regulation challenges..."
                  value={formData.emotionalRegulation}
                  onChange={(selected) =>
                    handleMultiSelectChange("emotionalRegulation", selected)
                  }
                  styles={customStyles}
                  closeMenuOnSelect={false}
                />
                <input
                  type="text"
                  name="otherEmotional"
                  value={formData.otherEmotional}
                  onChange={handleChange}
                  placeholder="Other (please specify)..."
                  className="h-10 p-3 border border-teal-600 rounded-xl bg-stone-50 text-sm"
                />
              </div>

              {/* Trust and Relationship Issues */}
              <div className="flex flex-col gap-2">
                <label className="font-bold text-teal-800">
                  Trust and Relationship Issues
                </label>
                <Select
                  options={trustOptions}
                  isMulti
                  placeholder="Select trust/relationship issues..."
                  value={formData.trustIssues}
                  onChange={(selected) =>
                    handleMultiSelectChange("trustIssues", selected)
                  }
                  styles={customStyles}
                  closeMenuOnSelect={false}
                />
                <input
                  type="text"
                  name="otherTrust"
                  value={formData.otherTrust}
                  onChange={handleChange}
                  placeholder="Other (please specify)..."
                  className="h-10 p-3 border border-teal-600 rounded-xl bg-stone-50 text-sm"
                />
              </div>

              {/* Factors Affecting Mental Health */}
              <div className="flex flex-col gap-2">
                <label className="font-bold text-teal-800">
                  Factors Affecting Mental Health
                </label>
                <Select
                  options={mentalHealthFactorsOptions}
                  isMulti
                  placeholder="Select affecting factors..."
                  value={formData.mentalHealthFactors}
                  onChange={(selected) =>
                    handleMultiSelectChange("mentalHealthFactors", selected)
                  }
                  styles={customStyles}
                  closeMenuOnSelect={false}
                />
                <input
                  type="text"
                  name="otherMentalHealth"
                  value={formData.otherMentalHealth}
                  onChange={handleChange}
                  placeholder="Other (please specify)..."
                  className="h-10 p-3 border border-teal-600 rounded-xl bg-stone-50 text-sm"
                />
              
            </div>

            {/* Additional Notes - Full Width */}
            <div className="flex flex-col gap-2 mt-6">
              <label className="font-bold text-teal-800">
                Additional Notes
              </label>
              <textarea
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleChange}
                placeholder="Enter any additional observations or notes..."
                rows="5"
                className="p-3 border-2 border-teal-600 rounded-xl bg-stone-50 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
    </div>
  );
}

export default PsychologicalAssessment;