export const scoreNutritionalStatus = (value) => {
  const map = {
    "Well-nourished": 5,
    "Mild Malnutrition": 4,
    "Moderate Malnutrition": 3,
    "Severe Malnutrition": 2,
    "Unknown": 1
  };
  return map[value] || 0;
};

export const scoreSelfHarm = (value) => {
  const map = {
    "No Self-Harm Behavior Observed": 5,
    "Self-Harm Thoughts Reported": 4,
    "Past Self-Harm Behavior (No Current Intent)": 3,
    "Current Mild Self-Harm Risk": 2,
    "Current High Self-Harm Risk (Requires Intervention)": 1
  };
  return map[value] || 0;
};

export const scoreEmotionalRegulation = (value) => {
  if (!value) return 0;
  const items = value.split(',').map(s => s.trim());
  
  const scores = {
    "Handles Emotions Well": 5,
    "Mild Difficulty Managing Stress": 4,
    "Becomes Easily Overwhelmed": 3,
    "Frequent Emotional Outbursts or Withdrawals": 2,
    "Requires Support to Calm / Stabilize": 1
  };
  
  const vals = items.map(i => scores[i] || 0).filter(v => v > 0);
  return vals.length ? Math.min(...vals) : 0;
};

export const scoreTrustIssues = (value) => {
  if (!value) return 5;
  const items = value.split(',').map(s => s.trim());
  
  const negativeIndicators = [
    "Limited Trust with New People",
    "General Difficulty Trusting Adults",
    "Fearful of Authority Figures",
    "Strong Avoidance of Close Relationships"
  ];
  
  const count = items.filter(i => negativeIndicators.includes(i)).length;
  return Math.max(1, 5 - count);
};

export const scoreTherapyAttendance = (value) => {
  const map = {
    "Regular (90–100% sessions attended)": 5,
    "Moderate (60–89% sessions attended)": 4,
    "Irregular (30–59% sessions attended)": 3,
    "Rare Attendance (<30% sessions attended)": 2,
    "No Attendance": 1
  };
  return map[value] || 0;
};

export const scoreGoalProgress = (value) => {
  const map = {
    "Not Started": 1,
    "In Progress": 2,
    "Partially Achieved": 3,
    "Significantly Achieved": 4,
    "Fully Achieved": 5
  };
  return map[value] || 0;
};

export const scoreMedicationAdherence = (value) => {
  const map = {
    "Fully Adherent": 5,
    "Mostly Adherent": 4,
    "Partially Adherent": 3,
    "Rarely Adherent": 2,
    "Non-Adherent": 1,
    "Not Applicable (No Medication Prescribed)": 0
  };
  return map[value] || 0;
};