const Audit = require('../models/audit');
const Staff = require('../models/staff');
const Victim = require('../models/victim');

async function addAudit(req,res,next){
    try{
        const {staffId,victimId} = req.params;
        if(!staffId||!victimId){
            return res.status(400).json({ error: "staffId and victimId parameters are required" });
        }
                // Generate a new sequential auditId. Sort by _id (monotonic) to get the latest document.
                let newAuditId = "AUD-101";
                const lastAudit = await Audit.findOne().sort({ _id: -1 });

                if (lastAudit && lastAudit.auditId) {
                        const parts = String(lastAudit.auditId).split("-");
                        const lastNum = parseInt(parts[1], 10) || 100;
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
        
        const allAudits=await Audit.find({ victimId: victim._id });
        if(allAudits.length===0){
            req.body.isFirst=true;
        }else{
            req.body.isFirst=false;
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
                if (err && err.code === 11000 && err.keyPattern && err.keyPattern.auditId) {
                    const latest = await Audit.findOne().sort({ _id: -1 });
                    const parts = latest && latest.auditId ? String(latest.auditId).split('-') : [null, '100'];
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
            console.error('Failed to create audit after retries');
            return res.status(500).json({ error: 'Could not create audit, please retry' });
        }

        // expose the newly created audit to the next middleware and continue the chain
        res.locals.audit = newAudit;
        return next();
    } catch (error) {
        console.error("Error adding audit:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

async function getAuditsByVictimId(req,res){
    try {
    const { victimId } = req.params;
    if(!victimId){
        return res.status(400).json({ error: "victimId parameter is required" });
    }
        const audits = await Audit.find({ 'result.victim_id': victimId });
        res.status(200).json(audits);
    } catch (error) {
        console.error("Error retrieving audits:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
async function getAuditDetails(req,res){
    try {
        const { auditId } = req.params;
        if(!auditId){
            return res.status(400).json({ error: "auditId parameter is required" });
        }
        const audit = await Audit.findById(auditId);
        if(!audit){
            return res.status(404).json({ error: "Audit not found" });
        }
        
        res.status(200).json(audit);
    } catch (error) {
        console.error("Error retrieving audit details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

async function getAuditByStaff(req,res){
    try {
        const { staffId } = req.params;
        if(!staffId){
            return res.status(400).json({ error: "staffId parameter is required" });
        }
        const audits = await Audit.find({ submittedBy: staffId });
        res.status(200).json(audits);
    } catch (error) {
        console.error("Error retrieving audits by staff:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}


async function getAllAudits(req,res){
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
    getAuditByStaff
};