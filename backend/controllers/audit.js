const Audit = require('../models/audit');

async function addAudit(req,res){
    try{
        const {staffId,victimId} = req.params;
        if(!staffId&&!victimId){
            return res.status(400).json({ error: "staffId and victimId parameters are required" });
        }
        req.body.submittedBy = staffId;
        req.body.victimId = victimId;

        const getAudit=req.body;
        if(!getAudit.result || typeof getAudit.result !== 'object'){
            return res.status(400).json({ error: "Invalid or missing result field" });
        }

        const newAudit = new Audit(req.body);
        await newAudit.save();
        res.status(201).json(newAudit);
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