
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");
const { convertRawToJSON_usingJSON5 } = require("../utils/utils.js");
const Audit = require('../models/audit');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
const model = genAI ? genAI.getGenerativeModel({ model: "gemini-2.0-flash" }) : null;
const systemInstruction = `You are a clinical-assessment assistant. Your task is to compare two audit records (a previousAudit and a currentAudit) for a trafficking-victim rehabilitation case and produce a single machine-readable JSON object that exactly follows the result schema described below.
Hard requirements (must follow exactly):
Output only valid JSON — nothing else (no explanatory text, no markdown, no trailing commas). The top-level object must match the result schema below exactly (field names, nested structure, types).

For each domain (medical_physical, trauma_indicators, progress_tracking) you must set:

status: one of the strings "improving", "no_change", or "declining". Choose the single best status for that domain.

reasons: an array of 3–5 concise reason strings (each 6–40 words). Each reason must clearly state why you selected the status, referencing specific changes between the previous and current audit fields.

evidence: an array of 3–6 concise evidence strings (each 6–40 words) that point to exact fields/phrases from the audits (quote or paraphrase the relevant field value) and indicate directionality (e.g., "previous: X → current: Y").

urgent: true or false. Set true if any acute safety, medical, or severe psychological risk is present in the currentAudit (examples: active suicidal ideation, ongoing self-harm, severe untreated injuries, medication suddenly stopped while required, dangerously low nutrition, major medical conditions untreated). Otherwise false.

recommended_actions: array of 1–8 short actionable items (each 6–30 words). Prioritize safety, immediate medical/psychiatric care, forensic needs, therapy, medication review, case management, and social support.

fit_for_discharge: boolean. true only if the victim demonstrates sustained improvement across domains, no urgent issues, good medication/treatment adherence, functional progress, and clinical support in place. Otherwise false.

next_audit_date: an ISO 8601 date string (YYYY-MM-DD). If immediate follow-up is required use a date 3–7 days ahead; otherwise 30 days (or specify a concrete date appropriate to severity — you must pick one exact date).

Where the schema requires String values, produce short but descriptively informative sentences (6–40 words) explaining the observation, change, or assessment — not single-word answers.

Use only the audit fields provided. Do not invent clinical tests, lab results, or external records.

Maintain confidentiality: do not include names, identifiers, or extraneous personal details in the JSON.

How you decide domain mapping & status heuristics (use these rules):
medical_physical ← compare these fields:

currentPhysicalSymptoms, physicalInjuriesSustained, medicalConditionsRequiringTreatment, currentMedicationsAndNeeds, nutritionalStatus, sleepPatterns.

If current shows fewer/newly-resolved symptoms, better medication adherence, improved nutrition/sleep → trending improving.

If little/no change across fields → no_change.

If new/worsening injuries, untreated medical conditions, poor medication adherence, worsening nutrition/sleep → declining.

trauma_indicators ← compare these fields:

traumaIndicators, depressionSymptoms, anxietyIndicators, dissociativeEpisodes, selfHarmBehaviors, emotionalRegulationChallenges, trustAndRelationshipIssues, factorsAffectingMentalHealth, additionalNote.

If symptoms and risk behaviors decrease, emotional regulation improves, and relationships/trust increase → improving.

If symptoms remain stable → no_change.

If symptoms escalate or self-harm appears/increases, or dissociation increases → declining.

progress_tracking ← compare these fields:

gamesActivitiesTasksPerformedConductedGiven, therapyAttendanceRate, treatmentCompliance, skillDevelopmentMilestones, behavioralImprovements, goalAchievementProgress, setbacksIndicator, medicationAdherence, additionalNoteProgress.

Increased attendance, compliance, milestone completion, fewer setbacks → improving; opposite → declining; otherwise no_change.

Tone & style: professional, clinically neutral, concise. Use present/past tense clearly (e.g., "previous: missed medications; current: adherent").
Validation: if any required field is missing from your output or invalid type/format, treat it as an error — do not attempt to correct with free text; instead ensure the JSON includes the required fields properly.

{
  "domain_evaluations": {
    "medical_physical": {
      "status": "improving | no_change | declining",
      "reasons": ["string", "string"],
      "evidence": ["string", "string"]
    },
    "trauma_indicators": {
      "status": "improving | no_change | declining",
      "reasons": ["string", "string"],
      "evidence": ["string", "string"]
    },
    "progress_tracking": {
      "status": "improving | no_change | declining",
      "reasons": ["string", "string"],
      "evidence": ["string", "string"]
    }
  },
  "urgent": true,
  "recommended_actions": ["string", "string"],
  "fit_for_discharge": false,
  "next_audit_date": "YYYY-MM-DD"
}


`

async function evaluateAudit(req, res) {
  try {
    if (!GEMINI_API_KEY || !genAI || !model) {
      console.error('Missing GEMINI_API_KEY or model initialization failed');
      return res.status(500).json({ error: 'AI service configuration error' });
    }

    const { victimId } = req.params;
    if (!victimId) {
      return res.status(400).json({ error: "victimId parameter is required" });
    }

    // Use the audit created by addAudit middleware
    const currentAudit = res.locals.audit;
    if (!currentAudit) {
      return res.status(400).json({ error: 'No audit available for evaluation' });
    }

    // Fetch the previous audit (most recent before current)
    const audits = await Audit.find({ victimId: currentAudit.victimId }).sort({ timestamp: -1 }).limit(2);
    if (!audits || audits.length === 0) {
      return res.status(404).json({ error: 'No audits found for victim' });
    }

    if (audits.length === 1) {
      return res.status(200).json({ message: 'First audit, no AI evaluation performed', audit: currentAudit });
    }

    const previousAudit = audits[1];

    const userPrompt = `\nTask: Compare the following audits and determine if the victim's condition is improving.\n\nvictim_id: "${victimId}"\ncurrent_audit: ${JSON.stringify(currentAudit, null, 2)}\nprevious_audit: ${JSON.stringify(previousAudit, null, 2)}\n\nReturn ONLY the JSON described above.\n`;

    const fullPrompt = `${systemInstruction}\n\n${userPrompt}`;

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: fullPrompt }]
        }
      ],
      generationConfig: {
        temperature: 0,
        maxOutputTokens: 800,
        responseMimeType: 'application/json'
      }
    });

    const raw = await result.response.text();
    console.log('Gemini raw response:\n', raw);

    const parsed = convertRawToJSON_usingJSON5(raw);
    console.log('Parsed JSON object:', parsed);

    currentAudit.result = parsed;
    currentAudit.generatedResults = true;
    await currentAudit.save();

    return res.status(200).json({ message: 'AI evaluation completed', audit: currentAudit, evaluation: parsed });

  } catch (err) {
    console.error('Gemini API or parsing error:', err);
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { evaluateAudit };