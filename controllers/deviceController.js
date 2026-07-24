const admin = require("firebase-admin");
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// Firebase Admin SDK එක Initialize කිරීම
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://esp-project-ebe94-default-rtdb.firebaseio.com",
  });
  console.log("Firebase Admin SDK initialized successfully!");
}

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

const setConfig = async (req, res) => {
  try {
    const { device_id, firebase_api_key, firebase_url, ip_address, gateway, subnet, device_secret, firebase_uid } = req.body;

    const config = await ConfigurationModel.findOneAndUpdate(
      { device_id },
      {
        device_id,
        firebase_api_key,
        firebase_url,
        ip_address,
        gateway,
        subnet,
        device_secret, // ESP32 එකෙන් verify කිරීමට අවශ්‍ය secret එක
        firebase_uid, // Firebase custom token එකට අවශ්‍ය uid එක
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
// Get Firebase Custom Token for ESP32 Devices
// ==========================================

const getFirebaseToken = async (req, res) => {
  try {
    const { deviceId, deviceSecret } = req.body;

    if (!deviceId || !deviceSecret) {
      return res.status(400).json({
        success: false,
        message: "Missing deviceId or deviceSecret",
      });
    }

    // MongoDB එකෙන් අදාළ ඩිවයිස් එකේ configuration එක ලබා ගැනීම
    const config = await ConfigurationModel.findOne({ device_id: deviceId });

    if (!config) {
      return res.status(404).json({
        success: false,
        message: "Device configuration not found",
      });
    }

    // ඩිවයිස් එකේ secret එක සමාන දැයි පරීක්ෂා කිරීම
    if (config.device_secret !== deviceSecret) {
      return res.status(401).json({
        success: false,
        message: "Invalid device credentials",
      });
    }

    // Firebase Custom Token එකක් නිර්මාණය කිරීම
    const uid = config.firebase_uid || `device-${deviceId.toLowerCase()}`;
    const customToken = await admin.auth().createCustomToken(uid, {
      deviceId: deviceId,
    });

    return res.status(200).json({
      success: true,
      token: customToken,
      expiresIn: "3600s",
    });
  } catch (error) {
    console.error("Error generating custom token:", error);
    return res.status(500).json({
      success: false,
      message: "Token mint failed",
      error: error.message,
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
    const { device_id, date, from, to, limit } = req.query;

    let query = {};

    if (device_id) {
      query.deviceId = device_id;
    }

    if (from && to) {
      query.createdAt = {
        $gte: new Date(from),
        $lte: new Date(to),
      };
    } else if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);

      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      query.createdAt = {
        $gte: start,
        $lte: end,
      };
    }

    const limitNumber = parseInt(limit) || 100;

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

    if (deviceId) {
      query.deviceId = deviceId;
    }

    const result = await LogEvent.deleteMany(query);

    res.status(200).json({
      success: true,
      message: "Logs cleared successfully",
      deletedCount: result.deletedCount,
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
  getFirebaseToken,
  logDeviceEvent,
  getDeviceLogs,
  clearDeviceLogs,
};
