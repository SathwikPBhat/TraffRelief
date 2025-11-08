const mongoose = require('mongoose');
const { Schema } = mongoose;

const ResultSchema = new Schema({
    timestamp: { type: Date, default: Date.now },
  victim_id: { type: String, default: null },
  previous_audit_used: { type: Boolean, required: true },
  domain_evaluations: {
    medical_physical: {
      status: {
        type: String,
        enum: ["improving", "no_change", "declining"],
        required: true
      },
      score: { type: Number, required: true },
      confidence: { type: Number, required: true },
      reasons: [{ type: String, required: true }],
      evidence: [{ type: String, required: true }]
    },
    trauma_indicators: { type: Object, required: true },
    progress_tracking: { type: Object, required: true }
  },
  urgent: { type: Boolean, required: true },
  recommended_actions: [{ type: String, required: true }]
});

const AuditSchema = new Schema({
  // medical and physical
  currentPhysicalSymptoms: String,
  physicalInjuriesSustained: String,
  medicalConditionsRequiringTreatment: String,
  currentMedicationsAndNeeds: String,
  nutritionalStatus: String,
  sleepPatterns: String,

  // psychological and emotional assessment
  traumaIndicators: String,
  depressionSymptoms: String,
  anxietyIndicators: String,
  dissociativeEpisodes: String,
  selfHarmBehaviors: String,
  emotionalRegulationChallenges: String,
  trustAndRelationshipIssues: String,
  factorsAffectingMentalHealth: String,
  additionalNote: String,

  // progress tracking
  gamesActivitiesTasksPerformedConductedGiven: String,
  therapyAttendanceRate: String,
  treatmentCompliance: String,
  skillDevelopmentMilestones: String,
  behavioralImprovements: String,
  goalAchievementProgress: String,
  setbacksIndicator: String,
  medicationAdherence: String,
  additionalNoteProgress: String,

  // new result field
  result: { type: ResultSchema, required: true }
});

module.exports = mongoose.model('Audit', AuditSchema);
