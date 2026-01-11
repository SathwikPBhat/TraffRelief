const Audit = require("../models/audit");
const Staff = require("../models/staff");
const Victim = require("../models/victim");
const ActivityLog = require("../models/activityLog");


async function addAudit(req, res, next) {
  try {
    const { staffId, victimId } = req.params;
    if (!staffId || !victimId) {
      return res
        .status(400)
        .json({ error: "staffId and victimId parameters are required" });
    }
    // Generate a new sequential auditId. Sort by _id (monotonic) to get the latest document.
    let newAuditId = "AUD-101";
    const lastAudit = await Audit.findOne().sort({ _id: -1 });

    if (lastAudit && lastAudit.auditId) {
      const parts = String(lastAudit.auditId).split("-");
      const lastNum = parseInt(parts[1], 10) || 100;
      newAuditId = `AUD-${lastNum + 1}`;
    }

    const staff = await Staff.findOne({ staffId: staffId });
    if (!staff) {
      return res.status(404).json({ error: "Staff not found" });
    }

    const victim = await Victim.findOne({ victimId });
    if (!victim) {
      return res.status(404).json({ error: "Victim not found" });
    }
    req.body.submittedBy = staff._id;
    req.body.victimId = victim._id;
    req.body.auditId = newAuditId;
    req.body.result = null;
    const getAudit = req.body;

    if (!getAudit) {
      return res.status(400).json({ error: "Audit data is required" });
    }

    const allAudits = await Audit.find({ victimId: victim._id });
    if (allAudits.length === 0) {
      req.body.isFirst = true;
    } else {
      req.body.isFirst = false;
    }

    // Attempt to save; on duplicate-auditId collisions (possible in concurrent requests)
    // retry a few times by re-reading the latest auditId and incrementing.
    let attempts = 0;
    let newAudit = null;
    while (attempts < 5) {
      try {
        req.body.auditId = newAuditId;
        const candidate = new Audit(req.body);
        newAudit = await candidate.save();
        break;
      } catch (err) {
        // E11000 duplicate key on auditId -> recompute and retry
        if (
          err &&
          err.code === 11000 &&
          err.keyPattern &&
          err.keyPattern.auditId
        ) {
          const latest = await Audit.findOne().sort({ _id: -1 });
          const parts =
            latest && latest.auditId
              ? String(latest.auditId).split("-")
              : [null, "100"];
          const lastNum = parseInt(parts[1], 10) || 100;
          newAuditId = `AUD-${lastNum + 1}`;
          attempts++;
          continue;
        }
        // other error -> rethrow
        throw err;
      }
    }

    if (!newAudit) {
      console.error("Failed to create audit after retries");
      return res
        .status(500)
        .json({ error: "Could not create audit, please retry" });
    }
    await ActivityLog.create({
      staffId: staff._id,
      adminId: victim.admin || null,
      activity: "Audit Submitted",
      description: `Audit ${newAudit.auditId} submitted by ${staff.fullName} for victim ${victim.fullName} (${victim.victimId})`,
      timestamp: new Date(),
      readStatus: false,
    });
    // expose the newly created audit to the next middleware and continue the chain
    res.locals.audit = newAudit;
    return next();
  } catch (error) {
    console.error("Error adding audit:", error);
    res.status(500).json({ error: "Internal server error" });
  }

}
/*
async function addAudit(req,res){
    try{
        const {staffId,victimId} = req.params;
        if(!staffId||!victimId){
            return res.status(400).json({ error: "staffId and victimId parameters are required" });
        }
        let newAuditId = "AUD-101";
    const lastAudit = await Audit.findOne().sort({ createdAt: -1 });

    if (lastAudit && lastAudit.auditId) {
      const lastNum = parseInt(lastAudit.auditId.split("-")[1]);
      newAuditId = `AUD-${lastNum + 1}`;
    }
   
        const staff= await Staff.findOne({staffId:staffId});
        if(!staff){
            return res.status(404).json({ error: "Staff not found" });
        }

        const victim= await Victim.findOne({victimId});
        if(!victim){
            return res.status(404).json({ error: "Victim not found" });
        }

        req.body.submittedBy = staff._id;
        req.body.victimId = victim._id;
        req.body.auditId = newAuditId;
        req.body.result=null;
        const getAudit=req.body;


       if(!getAudit){
            return res.status(400).json({ error: "Audit data is required" });
       }
        
        const allAudits=await Audit.find({ victimId: victimId });
        if(allAudits.length===0){
            req.body.isFirst=true;
        }else{
            req.body.isFirst=false;
        }
        
        const newAudit = new Audit(req.body);
        await newAudit.save();
        await ActivityLog.create({
      staffId: staff._id,
      adminId: victim.admin || null,
      activity: "Audit Submitted",
      description: `Audit ${newAudit.auditId} submitted by ${staff.fullName} for victim ${victim.fullName} (${victim.victimId})`,
      timestamp: new Date(),
      readStatus: false,
    });
        res.status(201).json(newAudit);
    } catch (error) {
        console.error("Error adding audit:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

*/
async function getPendingAudits(req,res){
    try {
        const staffId = req.user.id;
        if(!staffId) return res.status(400).json({ error: "staffId parameter is required" });


        const staff = await Staff.findOne({ staffId });
        if(!staff) return res.status(404).json({ error: "Staff not found" });

        const now = new Date();

        const auditsWithField = await Audit.find({
            'result.next_audit_date': { $exists: true, $ne: null }
        }).populate('victimId', 'victimId _id status isActive');

    const pending = auditsWithField.filter((a) => {
      const raw = a.result?.next_audit_date;
      if (!raw) return false;
      const d = new Date(raw);
      if (isNaN(d) || d > now) return false;

      const v = a.victimId;
      if (!v) return false;
      const activeByFlag = v.isActive !== false;
      const activeByStatus = v.status ? v.status.toLowerCase() !== "released" : true;
      return activeByFlag && activeByStatus;
    });
       
        return res.status(200).json(pending);
    } catch (error) {
        console.error("Error retrieving pending audits:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}


async function getAuditsByVictimId(req, res) {
  try {
    const { victimId } = req.params;
    if (!victimId) return res.status(400).json({ error: "victimId parameter is required" });

    const victim = await Victim.findOne({ victimId }).select('_id');
    if (!victim) return res.status(404).json({ error: "Victim not found" });

    const audits = await Audit.find({ victimId: victim._id })
      .populate({ path: 'submittedBy', model: 'Staff', select: 'fullName staffId' })
      .sort({ _id: -1 })
      .lean();

    const list = audits.map(a => ({
      auditId: a.auditId,
      date: a.timestamp || a.createdAt || null,
      staffName: (a.submittedBy && (a.submittedBy.fullName || a.submittedBy.staffId)) || 'Unknown'
    }));

    return res.status(200).json({ audits: list });
  } catch (error) {
    console.error("Error retrieving victim audits:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getAuditDetails(req, res) {
  try {
    const { auditId } = req.params;
    if (!auditId) {
      return res.status(400).json({ error: "auditId parameter is required" });
    }

    // If auditId looks like a Mongo ObjectId use findById, else treat it as the custom auditId (AUD-###)
    let audit;
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(auditId);
    if (isObjectId) {
      audit = await Audit.findById(auditId);
    } else {
      audit = await Audit.findOne({ auditId }); // <-- custom code id lookup
    }

    if (!audit) {
      return res.status(404).json({ error: "Audit not found" });
    }

    return res.status(200).json(audit);
  } catch (error) {
    console.error("Error retrieving audit details:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
async function getAuditByStaff(req, res) {
  try {
    const { staffId } = req.params;
    if (!staffId) {
      return res.status(400).json({ error: "staffId parameter is required" });
    }
    const audits = await Audit.find({ submittedBy: staffId });
    res.status(200).json(audits);
  } catch (error) {
    console.error("Error retrieving audits by staff:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getAllAudits(req, res) {
  try {
    const audits = await Audit.find();
    res.status(200).json(audits);
  } catch (error) {
    console.error("Error retrieving all audits:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
    addAudit,
    getAuditsByVictimId,
    getAllAudits,
    getAuditDetails,
    getAuditByStaff,
    getPendingAudits,
    getAuditsByVictimId
};