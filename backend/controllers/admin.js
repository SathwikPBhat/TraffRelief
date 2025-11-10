const Staff = require("../models/staff.js");
const Admin = require("../models/admin.js");
const Centre = require("../models/centre.js");
const ActivityLog = require("../models/activityLog.js");
const centre = require("../models/centre.js");
const activityLog = require("../models/activityLog.js");
const Victim = require("../models/victim.js");
const Audit = require("../models/audit.js");

const viewStaffs = async (req, res) => {
  try {
    const { adminId } = req.params;
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
    const { id, fullName, email, phoneNumber, password, role, center } =
      req.body;
    if (!id) {
      return res.status(401).json({ message: "Forbidden" });
    }
    if (!fullName || !email || !phoneNumber || !password || !center || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (
      !fullName.trim() ||
      !email.trim() ||
      !phoneNumber.trim() ||
      !password.trim() ||
      !center.trim() ||
      !role.trim()
    ) {
      return res.status(400).json({ message: "All fields are required." });
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
    const adminDoc = await Admin.findOne({ adminId: id });

    const newStaff = {
      staffId: `S-${idNo}`,
      fullName: fullName,
      email: email,
      mobileNo: phoneNumber,
      password: password,
      centre: centerDoc._id,
      role: role,
      reportsTo: adminDoc._id,
    };

    const existingStaff = await Staff.findOne({ email: newStaff.email });
    if (existingStaff) {
      return res
        .status(409)
        .json({ message: "Staff with this email already exists." });
    }
    const createdStaff = await Staff.create(newStaff);
    const log = {
      adminId: adminDoc._id,
      staffId: createdStaff._id,
      activity: `New Staff created`,
      description: `New Staff (${createdStaff.fullName}) added to centre ${centerDoc.centreName}`,
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
    const { adminId } = req.params;
    if (!adminId) {
      return res.status(400).json({ message: "Admin ID is required" });
    }
    const foundAdmin = await Admin.findOne({ adminId: adminId });
    if (!foundAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    const log = await ActivityLog.find({ adminId: foundAdmin._id }).sort({
      timestamp: -1,
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
    const { adminId } = req.params;
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
    const { adminId } = req.params;
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
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);

    const { adminId } = req.params;
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
      centre,
      languagesSpoken,
      controlMethods,
    } = req.body;

    if (!fullName || !age || !gender || !traffickingType || !centre) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const centreDoc = await Centre.findOne({ centreName: centre });
    if (!centreDoc) {
      return res.status(404).json({ message: "Centre not found" });
    }

    let parsedLanguages = [];
    let parsedControlMethods = [];

    try {
      parsedLanguages = JSON.parse(languagesSpoken);
      parsedControlMethods = JSON.parse(controlMethods);
    } catch (err) {
      return res.status(400).json({ message: "Invalid JSON in arrays" });
    }

    // let victimImagePath = null;
    // if (req.file) {
    //   victimImagePath = `/uploads/${req.file.filename}`;
    // }

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
      centre: centreDoc._id,
      admin: admin._id,
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
      description: `Victim (${newVictim.fullName}) added to centre ${centreDoc.centreName}`,
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
    const { adminId } = req.params;
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
    const { adminId } = req.params;
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
      { $set: { staff: staff._id, status: "active" } }
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
    const { adminId } = req.params;
    const admin = await Admin.findOne({ adminId });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    return res.status(200).json(admin);
  } catch (error) {
    return res.status(500).json({ message: error.message });
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
};