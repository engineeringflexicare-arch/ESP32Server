const LogEvent = require("../models/LogEvent");
const ConfigurationModel = require("../models/Configuration");

// ==========================================
// Get Single Config
// ==========================================

const getConfig = async (req, res) => {
  try {
    const machineId = req.query.machine;

    const config = await ConfigurationModel.findOne({
      device_id: machineId,
    });

    if (!config) {
      return res.status(404).json({
        success: false,
        message: "Device not found",
      });
    }

    res.status(200).json({
      success: true,
      data: config,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// ==========================================
// Get All Configs
// ==========================================

const getAllConfigs = async (req, res) => {
  try {
    const configs = await ConfigurationModel.find();

    res.status(200).json({
      success: true,
      data: configs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Create / Update Config
// ==========================================
// deviceController.js හි setConfig function එක
const setConfig = async (req, res) => {
  try {
    // අලුත් fields ටික req.body එකෙන් ගන්න
    const { device_id, firebase_api_key, firebase_url, ip_address, gateway, subnet } = req.body;

    const config = await ConfigurationModel.findOneAndUpdate(
      { device_id },
      {
        device_id,
        firebase_api_key,
        firebase_url,
        ip_address, // අලුතින් එකතු කළා
        gateway, // අලුතින් එකතු කළා
        subnet, // අලුතින් එකතු කළා
        updatedAt: new Date(),
      },
      {
        new: true,
        upsert: true,
      },
    );

    res.status(200).json({
      success: true,
      data: config,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ==========================================
// Save Log Event
// ==========================================

const logDeviceEvent = async (req, res) => {
  try {
    const { device_id, event_type, message } = req.body;

    if (!device_id || !event_type || !message) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields (device_id, event_type, message)",
      });
    }

    const newLog = new LogEvent({
      deviceId: device_id,
      eventType: event_type,
      message,
    });

    await newLog.save();

    console.log(`[LOG SAVED] Device: ${device_id} | Event: ${event_type}`);

    return res.status(200).json({
      success: true,
      message: "Log event saved successfully",
    });
  } catch (error) {
    console.error("Error saving log event:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ==========================================
// Get Device Logs
// ==========================================

const getDeviceLogs = async (req, res) => {
  try {
    const deviceId = req.query.device_id;

    let query = {};

    if (deviceId) {
      query.deviceId = deviceId;
    }

    const logs = await LogEvent.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    console.error("Error fetching logs:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// ==========================================
// Clear Device Logs
// ==========================================

const clearDeviceLogs = async (req, res) => {
  try {
    const deviceId = req.query.device_id;
    let query = {};

    // Specific device ID එකක් තියෙනවා නම්, ඒ අදාළ device එකේ logs පමණක් delete කරයි.
    // නැත්නම් database එකේ තියෙන සියලුම logs delete කරයි.
    if (deviceId) {
      query.deviceId = deviceId;
    }

    const result = await LogEvent.deleteMany(query);

    res.status(200).json({
      success: true,
      message: "Logs cleared successfully",
      deletedCount: result.deletedCount, // Delete වුණු ප්‍රමාණය
    });
  } catch (error) {
    console.error("Error clearing logs:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// ==========================================
// Exports
// ==========================================
module.exports = {
  getConfig,
  getAllConfigs,
  setConfig,
  logDeviceEvent,
  getDeviceLogs,
  clearDeviceLogs, // <--- අලුතින් එකතු කළ function එක
};
const LogEvent = require("../models/LogEvent");
const ConfigurationModel = require("../models/Configuration");

// ==========================================
// Get Single Config
// ==========================================

const getConfig = async (req, res) => {
  try {
    const machineId = req.query.machine;

    const config = await ConfigurationModel.findOne({
      device_id: machineId,
    });

    if (!config) {
      return res.status(404).json({
        success: false,
        message: "Device not found",
      });
    }

    res.status(200).json({
      success: true,
      data: config,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// ==========================================
// Get All Configs
// ==========================================

const getAllConfigs = async (req, res) => {
  try {
    const configs = await ConfigurationModel.find();

    res.status(200).json({
      success: true,
      data: configs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Create / Update Config
// ==========================================
// deviceController.js හි setConfig function එක
const setConfig = async (req, res) => {
  try {
    // අලුත් fields ටික req.body එකෙන් ගන්න
    const { device_id, firebase_api_key, firebase_url, ip_address, gateway, subnet } = req.body;

    const config = await ConfigurationModel.findOneAndUpdate(
      { device_id },
      {
        device_id,
        firebase_api_key,
        firebase_url,
        ip_address, // අලුතින් එකතු කළා
        gateway, // අලුතින් එකතු කළා
        subnet, // අලුතින් එකතු කළා
        updatedAt: new Date(),
      },
      {
        new: true,
        upsert: true,
      },
    );

    res.status(200).json({
      success: true,
      data: config,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Save Log Event
// ==========================================

const logDeviceEvent = async (req, res) => {
  try {
    const { device_id, event_type, message } = req.body;

    if (!device_id || !event_type || !message) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields (device_id, event_type, message)",
      });
    }

    const newLog = new LogEvent({
      deviceId: device_id,
      eventType: event_type,
      message,
    });

    await newLog.save();

    console.log(`[LOG SAVED] Device: ${device_id} | Event: ${event_type}`);

    return res.status(200).json({
      success: true,
      message: "Log event saved successfully",
    });
  } catch (error) {
    console.error("Error saving log event:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ==========================================
// Get Device Logs (Optimized with Date Filters & Pagination)
// ==========================================

const getDeviceLogs = async (req, res) => {
  try {
    // req.query වලින් අවශ්‍ය සියලුම parameters ලබා ගැනීම
    const { device_id, date, from, to, limit } = req.query;

    let query = {};

    // 1. Device ID Filter එක
    if (device_id) {
      query.deviceId = device_id;
    }

    // 2. Date Filters (Date Range හෝ Single Date)
    if (from && to) {
      // 'from' සහ 'to' දෙකම තිබේ නම් Date Range එකක් ලෙස filter කරයි
      query.createdAt = {
        $gte: new Date(from),
        $lte: new Date(to),
      };
    } else if (date) {
      // 'date' එකක් පමණක් තිබේ නම් අදාළ දවසේ ආරම්භය සහ අවසානය අතර logs ගනී
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);

      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      query.createdAt = {
        $gte: start,
        $lte: end,
      };
    }

    // 3. Limit එක ලබා ගැනීම (Frontend එකෙන් limit එකක් නෑවුවොත් default 100 ලෙස ගනී)
    const limitNumber = parseInt(limit) || 100;

    // 4. Database Query එක (sort, limit සහ lean සමඟ)
    const logs = await LogEvent.find(query).sort({ createdAt: -1 }).limit(limitNumber).lean();

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    console.error("Error fetching logs:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// ==========================================
// Clear Device Logs
// ==========================================

const clearDeviceLogs = async (req, res) => {
  try {
    const deviceId = req.query.device_id;
    let query = {};

    // Specific device ID එකක් තියෙනවා නම්, ඒ අදාළ device එකේ logs පමණක් delete කරයි.
    // නැත්නම් database එකේ තියෙන සියලුම logs delete කරයි.
    if (deviceId) {
      query.deviceId = deviceId;
    }

    const result = await LogEvent.deleteMany(query);

    res.status(200).json({
      success: true,
      message: "Logs cleared successfully",
      deletedCount: result.deletedCount, // Delete වුණු ප්‍රමාණය
    });
  } catch (error) {
    console.error("Error clearing logs:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// ==========================================
// Exports
// ==========================================
module.exports = {
  getConfig,
  getAllConfigs,
  setConfig,
  logDeviceEvent,
  getDeviceLogs,
  clearDeviceLogs,
};
