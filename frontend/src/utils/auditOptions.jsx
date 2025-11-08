export const customStyles = {
  control: (provided, state) => ({
    ...provided,
    minHeight: "2.5rem",
    borderRadius: "0.75rem",
    borderColor: state.isFocused ? "#047857" : "#0d9488",
    boxShadow: state.isFocused ? "0 0 0 1px #047857" : "none",
    "&:hover": { borderColor: "#047857" },
    backgroundColor: "#F5F5F4",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#0f766e"
      : state.isFocused
      ? "#ccfbf1"
      : "white",
    color: state.isSelected ? "white" : "black",
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "#ccfbf1",
    borderRadius: "0.5rem",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "#0f766e",
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: "#0f766e",
    "&:hover": { backgroundColor: "#99f6e4", color: "#134e4a" },
  }),
};

export const traumaOptions = [
  {
    value: "Startle Response / Easily Frightened",
    label: "Startle Response / Easily Frightened",
  },
  {
    value: "Avoidance of Reminders / Situations",
    label: "Avoidance of Reminders / Situations",
  },
  {
    value: "Recurrent Nightmares / Flashbacks",
    label: "Recurrent Nightmares / Flashbacks",
  },
  {
    value: "Hypervigilance (Always Alert / Guarded)",
    label: "Hypervigilance (Always Alert / Guarded)",
  },
  {
    value: "Emotional Numbness / Shutdown",
    label: "Emotional Numbness / Shutdown",
  },
];

export const depressionOptions = [
  {
    value: "Persistent Sadness / Tearfulness",
    label: "Persistent Sadness / Tearfulness",
  },
  {
    value: "Loss of Interest in Activities",
    label: "Loss of Interest in Activities",
  },
  {
    value: "Feelings of Worthlessness / Shame",
    label: "Feelings of Worthlessness / Shame",
  },
  { value: "Fatigue / Low Energy", label: "Fatigue / Low Energy" },
  { value: "Appetite or Sleep Changes", label: "Appetite or Sleep Changes" },
];

export const anxietyOptions = [
  {
    value: "Restlessness / Unable to Relax",
    label: "Restlessness / Unable to Relax",
  },
  { value: "Excessive Worry / Fear", label: "Excessive Worry / Fear" },
  {
    value: "Physical Tension or Shaking",
    label: "Physical Tension or Shaking",
  },
  { value: "Panic Episodes", label: "Panic Episodes" },
  {
    value: "Difficulty Focusing / Brain Fog",
    label: "Difficulty Focusing / Brain Fog",
  },
];

export const dissociativeOptions = [
  {
    value: "Spacing Out / Blank Staring",
    label: "Spacing Out / Blank Staring",
  },
  {
    value: "Feeling Detached from Self / Body",
    label: "Feeling Detached from Self / Body",
  },
  { value: "Memory Gaps / Lost Time", label: "Memory Gaps / Lost Time" },
  {
    value: 'Feeling "Unreal" or Dreamlike',
    label: 'Feeling "Unreal" or Dreamlike',
  },
  {
    value: "Sudden Emotional Shut-Down",
    label: "Sudden Emotional Shut-Down",
  },
];

export const selfHarmOptions = [
  "No Self-Harm Behavior Observed",
  "Self-Harm Thoughts Reported",
  "Past Self-Harm Behavior (No Current Intent)",
  "Current Mild Self-Harm Risk",
  "Current High Self-Harm Risk (Requires Intervention)",
];

export const emotionalRegulationOptions = [
  { value: "Handles Emotions Well", label: "Handles Emotions Well" },
  {
    value: "Mild Difficulty Managing Stress",
    label: "Mild Difficulty Managing Stress",
  },
  {
    value: "Becomes Easily Overwhelmed",
    label: "Becomes Easily Overwhelmed",
  },
  {
    value: "Frequent Emotional Outbursts or Withdrawals",
    label: "Frequent Emotional Outbursts or Withdrawals",
  },
  {
    value: "Requires Support to Calm / Stabilize",
    label: "Requires Support to Calm / Stabilize",
  },
];

export const trustOptions = [
  { value: "Trusts Caregivers Easily", label: "Trusts Caregivers Easily" },
  {
    value: "Limited Trust with New People",
    label: "Limited Trust with New People",
  },
  {
    value: "General Difficulty Trusting Adults",
    label: "General Difficulty Trusting Adults",
  },
  {
    value: "Fearful of Authority Figures",
    label: "Fearful of Authority Figures",
  },
  {
    value: "Strong Avoidance of Close Relationships",
    label: "Strong Avoidance of Close Relationships",
  },
];

export const mentalHealthFactorsOptions = [
  {
    value: "Separation from Family / Loved Ones",
    label: "Separation from Family / Loved Ones",
  },
  { value: "Court / Legal Stress", label: "Court / Legal Stress" },
  {
    value: "Traumatic Reminders in Environment",
    label: "Traumatic Reminders in Environment",
  },
  {
    value: "Bullying or Interpersonal Conflict",
    label: "Bullying or Interpersonal Conflict",
  },
  {
    value: "Uncertainty About Future / Reintegration",
    label: "Uncertainty About Future / Reintegration",
  },
];

// ...existing code...

export const activitiesOptions = [
  { value: "Art Therapy", label: "Art Therapy" },
  { value: "Music Sessions", label: "Music Sessions" },
  { value: "Group Counseling", label: "Group Counseling" },
  { value: "Yoga / Meditation", label: "Yoga / Meditation" },
  { value: "Outdoor Recreational Activities", label: "Outdoor Recreational Activities" },
  { value: "Vocational Skill Training", label: "Vocational Skill Training" },
  { value: "Life Skills Workshops", label: "Life Skills Workshops" },
  { value: "Reading / Literacy Activities", label: "Reading / Literacy Activities" },
  { value: "Play Therapy", label: "Play Therapy" },
  { value: "Role-Play Social Exercises", label: "Role-Play Social Exercises" },
];

export const therapyAttendanceOptions = [
  "Regular (90–100% sessions attended)",
  "Moderate (60–89% sessions attended)",
  "Irregular (30–59% sessions attended)",
  "Rare Attendance (<30% sessions attended)",
  "No Attendance"
];

export const treatmentComplianceOptions = [
  "Fully Compliant",
  "Mostly Compliant",
  "Partially Compliant",
  "Rarely Compliant",
  "Non-Compliant"
];

export const skillDevelopmentOptions = [
  { value: "Basic Communication Skills", label: "Basic Communication Skills" },
  { value: "Emotional Self-Regulation Skills", label: "Emotional Self-Regulation Skills" },
  { value: "Personal Hygiene & Self-Care Skills", label: "Personal Hygiene & Self-Care Skills" },
  { value: "Vocational / Work Skills Learned", label: "Vocational / Work Skills Learned" },
  { value: "Social Interaction Improvement", label: "Social Interaction Improvement" },
  { value: "Problem-Solving Skills Growth", label: "Problem-Solving Skills Growth" },
];

export const behavioralImprovementsOptions = [
  { value: "Reduced Aggression", label: "Reduced Aggression" },
  { value: "Improved Social Interaction", label: "Improved Social Interaction" },
  { value: "More Cooperative Behavior", label: "More Cooperative Behavior" },
  { value: "Increased Confidence", label: "Increased Confidence" },
  { value: "Improved Emotional Expression", label: "Improved Emotional Expression" },
  { value: "Stable Mood Patterns", label: "Stable Mood Patterns" },
];

export const goalProgressOptions = [
  "Not Started",
  "In Progress",
  "Partially Achieved",
  "Significantly Achieved",
  "Fully Achieved"
];

export const setbacksOptions = [
  "No Setbacks Observed",
  "Mild Setbacks (manageable)",
  "Moderate Setbacks (needs attention)",
  "Severe Setbacks (intervention required)",
  "Critical Regression (immediate response needed)"
];

export const medicationAdherenceOptions = [
  "Fully Adherent",
  "Mostly Adherent",
  "Partially Adherent",
  "Rarely Adherent",
  "Non-Adherent",
  "Not Applicable (No Medication Prescribed)"
];

export const physicalSymptomsOptions = [
  { value: "Fever", label: "Fever" },
  { value: "Pain", label: "Pain" },
  { value: "Fatigue", label: "Fatigue" },
  { value: "Dizziness", label: "Dizziness" },
  { value: "Nausea", label: "Nausea" },
  { value: "Shortness of Breath", label: "Shortness of Breath" },
];

export const medicalConditionsOptions = [
  { value: "Asthma", label: "Asthma" },
  { value: "Diabetes", label: "Diabetes" },
  { value: "Hypertension", label: "Hypertension" },
  { value: "Heart Condition", label: "Heart Condition" },
  { value: "Epilepsy", label: "Epilepsy" },
  { value: "None", label: "None" },
];

export const nutritionalStatusOptions = [
  "Well-nourished",
  "Mild Malnutrition",
  "Moderate Malnutrition",
  "Severe Malnutrition",
  "Unknown"
];

export const sleepPatternsOptions = [
  { value: "Normal (6–8 hrs)", label: "Normal (6–8 hrs)" },
  { value: "Insomnia", label: "Insomnia" },
  { value: "Hypersomnia", label: "Hypersomnia" },
  { value: "Interrupted Sleep", label: "Interrupted Sleep" },
  { value: "Irregular Sleep Schedule", label: "Irregular Sleep Schedule" },
];