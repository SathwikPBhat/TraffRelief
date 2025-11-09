
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");
const { convertRawToJSON_usingJSON5 } = require("../utils/utils.js");
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
const systemInstruction=process.env.SYSTEM_INSTRUCTION_PROMPT;


async function evaluateAudit(req,res) {
  try {
    const {victimId}= req.params;
    if(!victimId){
      return res.json({ error: "victimId parameter is required", status: 400 });
    }

    let getAuditList;
    try {
      getAuditList = await Audit.find({ victimId: victimId }).sort({timestamps: 1});
    } catch (err) {
      console.error("Database error:", err);
      return res.json({ error: "Database error", status: 500 });
    }

    if (getAuditList.length === 0) {
      return res.json({ error: "No audits found for the given victimId", status: 404 });
    }

    if(getAuditList.length==1){
        return res.json({ message: "First audit in the list, no AI evaluation", status: 200 });
    }
    
    const previousAudit = getAuditList[getAuditList.length - 2];
    const currentAudit = getAuditList[getAuditList.length - 1];


    
    const userPrompt = `
Task: Compare the following audits and determine if the victim's condition is improving.

victim_id: "V0001"
current_audit: ${JSON.stringify(currentAudit, null, 2)}
previous_audit: ${JSON.stringify(previousAudit, null, 2)}

Return ONLY the JSON described above.
`;

    
    const fullPrompt = `${systemInstruction}\n\n${userPrompt}`;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: fullPrompt }]
        }
      ],
      generationConfig: {
        temperature: 0,
        maxOutputTokens: 800,
        responseMimeType: "application/json"
      }
    });

    const raw = await result.response.text();
    console.log("Gemini raw response:\n", raw);

    const parsed = convertRawToJSON_usingJSON5(raw);

    console.log("Parsed JSON object:", parsed);

    currentAudit.result=parsed;
    currentAudit.generatedResults=true;
    await currentAudit.save(); 
    // Return parsed JSON as response
    return res.json({ parsed, status: 200 });

  } catch (err) {
    console.error("Gemini API or parsing error:", err);
    return res.json({ error: err.message, status: 500 });
  }
}

module.exports={evaluateAudit}