const Staff = require("../models/staff.js");
const Admin = require("../models/admin.js");
const Centre = require("../models/centre.js");
const ActivityLog = require("../models/activityLog.js");
const centre = require("../models/centre.js");
const activityLog = require("../models/activityLog.js");
const Victim = require("../models/victim.js");
const Audit = require("../models/audit.js");
const { cloudinary } = require("../utils/cloudinary");

const viewStaffs = async (req, res) => {
  try {
    const adminId = req.user.id;
    if (!adminId) {
      return res.status(400).json({ message: "Admin ID is required" });
    }
    const foundAdmin = await Admin.findOne({ adminId: adminId });
    if (!foundAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    const staffs = await Staff.find({ reportsTo: foundAdmin._id }).populate(
      "centre"
    );
    return res
      .status(200)
      .json({ message: "Data retrieval succesful", staffs: staffs });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const handleAddStaff = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, center, role } = req.body;
    const adminId = req.user.id;
    const photoUrl = req.file ? req.file.path : null;
    if (!fullName || !email || !phoneNumber || !password || !center || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const admin = await Admin.findOne({ adminId });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    const existingStaff = await Staff.findOne({ email });
    if (existingStaff) {
      return res.status(409).json({ message: "Staff with this email already exists" });
    }
    const lastStaff = await Staff.findOne().sort({ staffId: -1 });
    let idNo = 101;
    if (lastStaff) {
      // console.log(lastStaff.staffId);
      const lastId = lastStaff.staffId.substring(2);
      idNo = parseInt(lastId) + 1;
    }
    const centerDoc = await Centre.findOne({ centreId: center });
    if (!centerDoc) {
      return res.status(404).json({ message: "Centre not found" });
    }
    const adminDoc = await Admin.findOne({ adminId });

    const newStaff = {
      staffId: `S-${idNo}`,
      fullName,
      email,
      mobileNo: phoneNumber,
      password: password,
      centre: centerDoc._id,
      role: role,
      photo: photoUrl,
      reportsTo: adminDoc._id,
    };

    const createdStaff = await Staff.create(newStaff);
    const log = {
      adminId: adminDoc._id,
      staffId: createdStaff._id,
      activity: `New Staff created`,
      description: `New Staff (${createdStaff.fullName}) added to centre ${centerDoc.centreName}`,
      readStatus: false,
    };
    const createdLog = await activityLog.create(log);
    res.status(201).json({
      message: `Staff created successfully with id: ${createdStaff.staffId}`,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

const getActivityLogs = async (req, res) => {
  try {
    const adminId = req.user.id;
    if (!adminId) {
      return res.status(400).json({ message: "Admin ID is required" });
    }
    const foundAdmin = await Admin.findOne({ adminId: adminId });
    if (!foundAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    const log = await ActivityLog.find({ adminId: foundAdmin._id }).sort({
      createdAt: -1,
    });
    return res
      .status(200)
      .json({ log: log, message: "Log details retrieval successful" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const markAllNotificationsRead = async (req, res) => {
  try {
    const adminId = req.user.id;
    if (!adminId)
      return res.status(400).json({ message: "Admin id is required" });

    const admin = await Admin.findOne({ adminId });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const result = await ActivityLog.updateMany(
      {},
      { $set: { readStatus: true } }
    );
    return res.status(200).json({ message: "Marked as read" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getVictimDetails = async (req, res) => {
  try {
    const adminId = req.user.id;
    if (!adminId) {
      return res.status(400).json({ message: "Admin ID is required" });
    }
    const foundAdmin = await Admin.findOne({ adminId: adminId });
    if (!foundAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    const victims = await Victim.find({ admin: foundAdmin._id })
      .populate("centre")
      .populate("staff");
    return res
      .status(200)
      .json({ message: "Data retrieval succesful", victims: victims });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Optional: if you upload images
// const cloudinary = require('../config/cloudinary');

const parseToArray = (v) => {
  if (v == null) return [];
  if (Array.isArray(v)) return v.filter(Boolean);
  if (typeof v === "string") {
    try {
      const j = JSON.parse(v);
      if (Array.isArray(j)) return j;
    } catch {}
    return v
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
};

const addVictim = async (req, res) => {
  try {
    const photoUrl = req.file ? req.file.path : null;

    const adminId = req.user.id;
    const admin = await Admin.findOne({ adminId });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const {
      fullName,
      age,
      gender,
      traffickingType,
      locations,
      duration,
      languagesSpoken,
      controlMethods,
    } = req.body;

    if (!fullName || !age || !gender || !traffickingType) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    let parsedLanguages = [];
    let parsedControlMethods = [];

    try {
      parsedLanguages = JSON.parse(languagesSpoken);
      parsedControlMethods = JSON.parse(controlMethods);
    } catch (err) {
      return res.status(400).json({ message: "Invalid JSON in arrays" });
    }

    let newVictimId = "V-101";
    const lastVictim = await Victim.findOne().sort({ createdAt: -1 });

    if (lastVictim && lastVictim.victimId) {
      const lastNum = parseInt(lastVictim.victimId.split("-")[1]);
      newVictimId = `V-${lastNum + 1}`;
    }

    const newVictim = await Victim.create({
      victimId: newVictimId,
      fullName,
      age,
      gender,
      languagesSpoken: parsedLanguages,
      admin: admin._id,
      photo: photoUrl,
      caseDetailsForAdmin: {
        traffickingType,
        traffickingLocations: locations ? [locations] : [],
        traffickingDuration: duration,
        controlMethods: parsedControlMethods,
      },
    });

    await ActivityLog.create({
      adminId: admin._id,
      victimId: newVictim._id,
      activity: "New Victim created",
      description: `Victim (${newVictim.fullName}) added `,
      readStatus: false,
    });

    res.status(201).json({
      message: "Victim added successfully",
      victimId: newVictim.victimId,
      victim: newVictim,
    });
  } catch (err) {
    console.error("Error adding victim:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUnassignedVictims = async (req, res) => {
  try {
    const adminId = req.user.id;
    if (!adminId) {
      return res.status(400).json({ message: "Admin ID is required" });
    }
    const foundAdmin = await Admin.findOne({ adminId: adminId });
    if (!foundAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    const victims = await Victim.find({
      admin: foundAdmin._id,
      status: "unassigned",
    })
      .populate("centre")
      .populate("staff");
    return res
      .status(200)
      .json({ message: "Data retrieval succesful", victims: victims });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const assignVictims = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { staffId, victimIds } = req.body;
    if (!staffId || !Array.isArray(victimIds) || victimIds.length === 0)
      return res.status(400).json({ message: "staffId & victimIds required" });
    const staff = await Staff.findOne({ staffId });
    if (!staff) return res.status(404).json({ message: "Staff not found" });
    const victimsToAssign = await Victim.find({ victimId: { $in: victimIds } });

    if (victimsToAssign.length !== victimIds.length) {
      return res.status(404).json({
        message: "One or more victims not found",
      });
    }

    const alreadyAssigned = victimsToAssign.filter(
      (v) => v.status !== "unassigned" || v.staff != null
    );

    if (alreadyAssigned.length > 0) {
      const assignedNames = alreadyAssigned
        .map((v) => `${v.fullName} (${v.victimId})`)
        .join(", ");
      return res.status(400).json({
        message: `The following victims are already assigned: ${assignedNames}`,
      });
    }
    const result = await Victim.updateMany(
      { victimId: { $in: victimIds } },
      { $set: { staff: staff._id, status: "active" , centre: staff.centre} }
    );
    await ActivityLog.create({
      adminId: (await Admin.findOne({ adminId }))._id,
      staffId: staff._id,
      activity: "Victim assignment",
      description: `Assigned ${victimIds.length} victims to ${staff.fullName}`,
      readStatus: false,
    });
    return res
      .status(200)
      .json({ message: "Assigned", modified: result.modifiedCount });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

async function getAllAudits(req, res) {
  try {
    
    const audits = await Audit.find()
      .populate({ path: 'submittedBy', select: 'fullName staffId' })
      .populate({ path: 'victimId', select: 'fullName victimId' })
      .sort({ _id: -1 });

    const mapped = audits.map(a => ({
      auditId: a.auditId,
      date: a.createdAt || a.timestamp || null,
      staffName: a.submittedBy?.fullName || 'Unknown',
      victimName: a.victimId?.fullName || 'Unknown'
    }));

    return res.status(200).json({ audits: mapped });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function getAdminDetails(req, res) {
  try {
    const adminId = req.user.id;
    const admin = await Admin.findOne({ adminId });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    return res.status(200).json(admin);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getStaffAudits(req, res) {
  try {
    const {staffId} = req.params;
    if (!staffId) return res.status(400).json({ message: "staffId required" });

    const staff = await Staff.findOne({ staffId });
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    // Fetch audits submitted by this staff
    const audits = await Audit.find({ submittedBy: staff._id })
      .populate({ path: "victimId", select: "fullName victimId" })
      .sort({ _id: -1 });

    const mapped = audits.map((a) => ({
      auditId: a.auditId,
      date: a.timestamp || a.createdAt,
      staffName: staff.fullName,
      victimName: a.victimId?.fullName || "Unknown",
    }));

    return res.status(200).json({ audits: mapped });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function releaseVictim(req, res){
  try{
    const {victimId} = req.params;
    const adminId = req.user.id;
    if(!adminId){
      return res.status(400).json({message: "AdminId is required"});
    }
    const admin = await Admin.findOne({adminId});
    if(!admin){
      return res.status(404).json({message: "Admin not found"})
    }
    const victim = await Victim.findOne({victimId});
    if(!victim){
      return res.status(404).json({message: "Victim not found"})
    }
    if (victim.admin.toString() !== admin._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to release this victim" });
    }
    if (victim.status === "released") {
      return res.status(400).json({ message: "Victim is already released" });
    }
    victim.status = "released";
    await victim.save();

    await ActivityLog.create({
      adminId: admin._id,
      victimId: victim._id,
      activity: "Victim Released",
      description: `Victim ${victim.fullName} (${victim.victimId}) has been released`,
      readStatus: false,
    });

    return res.status(200).json({ 
      message: "Victim released successfully",
      victim 
    });
  } 

  catch(err){
    return res.status(500).json({ message: err.message });
  }
}


async function verifyInitialDetails(req, res) {
  try {
    const { victimId } = req.params;
    const adminId = req.user.id;

    if (!victimId) {
      return res.status(400).json({ message: "victimId is required" });
    }

    const admin = await Admin.findOne({ adminId });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const victim = await Victim.findOne({ victimId });
    if (!victim) {
      return res.status(404).json({ message: "Victim not found" });
    }

    if (victim.admin.toString() !== admin._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to verify this victim" });
    }

    if (!victim.initialDetails || !victim.initialDetails.photo) {
      return res.status(400).json({ message: "No initial details to verify" });
    }

    victim.initialDetails.verificationStatus = "verified";
    victim.initialDetails.verifiedBy = admin._id;
    victim.initialDetails.verifiedAt = new Date();
    await victim.save();

    await activityLog.create({
      adminId: admin._id,
      staffId: victim.staff._id,
      victimId: victim._id,
      activity: "Initial Details Verified",
      description: `Admin ${admin.fullName} verified initial details for victim ${victim.fullName} (${victim.victimId})`,
      readStatus: false,
    });

    return res.status(200).json({
      message: "Initial details verified successfully",
      victim,
    });
  } catch (err) {
    console.error("Error verifying initial details:", err);
    return res.status(500).json({ message: err.message });
  }
}

async function discardInitialDetails(req, res) {
  try {
    const { victimId } = req.params;
    const { reason } = req.body;
    const adminId = req.user.id;

    if (!victimId) {
      return res.status(400).json({ message: "victimId is required" });
    }

    const admin = await Admin.findOne({ adminId });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const victim = await Victim.findOne({ victimId });
    if (!victim) {
      return res.status(404).json({ message: "Victim not found" });
    }

    if (victim.admin.toString() !== admin._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to discard this victim's data" });
    }

    if (!victim.initialDetails || !victim.initialDetails.photo) {
      return res.status(400).json({ message: "No initial details to discard" });
    }

    if (victim.initialDetails.photo) {
      try {
        const photoUrl = victim.initialDetails.photo;
        const publicId = photoUrl.split('/').slice(-2).join('/').split('.')[0];
        await cloudinary.uploader.destroy(publicId);
        console.log("Deleted image from Cloudinary:", publicId);
      } catch (cloudinaryErr) {
        console.error("Error deleting from Cloudinary:", cloudinaryErr);
      }
    }

    victim.initialDetails = {
      verificationStatus: "rejected",
      rejectionReason: reason || "Photo verification failed",
      verifiedBy: admin._id,
      verifiedAt: new Date(),
    };
    await victim.save();

    if (victim.staff) {
      await activityLog.create({
        staffId: victim.staff._id,
        victimId: victim._id,
        activity: "Initial Details Rejected",
        description: `Admin ${admin.fullName} rejected initial details for victim ${victim.fullName} (${victim.victimId}). Reason: ${reason || "Photo verification failed"}. Please re-submit.`,
        readStatus: false,
      });
    }

    return res.status(200).json({
      message: "Initial details discarded successfully",
      victim,
    });
  } catch (err) {
    console.error("Error discarding initial details:", err);
    return res.status(500).json({ message: err.message });
  }
}

module.exports = {
  handleAddStaff,
  viewStaffs,
  getActivityLogs,
  markAllNotificationsRead,
  getVictimDetails,
  addVictim,
  getUnassignedVictims,
  assignVictims,
  getAllAudits,
  getAdminDetails,
  getStaffAudits,
  releaseVictim,
  verifyInitialDetails,
  discardInitialDetails,
};