const LogEvent = require("../models/LogEvent");
const ConfigurationModel = require("../models/Configuration");

const getConfig = async (req, res) => {
  try {
    const machineId = req.query.machine;
    const config = await ConfigurationModel.findOne({ device_id: machineId });

    if (!config) {
      return res.status(404).json({ success: false, message: "Device not found" });
    }

    res.status(200).json({ success: true, data: config });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

const getAllConfigs = async (req, res) => {
  try {
    const configs = await ConfigurationModel.find();
    res.status(200).json({ success: true, data: configs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const setConfig = async (req, res) => {
  try {
    const { device_id, firebase_api_key, firebase_url } = req.body;

    const config = await ConfigurationModel.findOneAndUpdate({ device_id }, { device_id, firebase_api_key, firebase_url, updatedAt: new Date() }, { new: true, upsert: true });

    res.status(200).json({ success: true, data: config });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

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
      message: message,
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

// සියලුම functions එකවර export කිරීම (CommonJS ක්‍රමය)
module.exports = {
  getConfig,
  getAllConfigs,
  setConfig,
  logDeviceEvent,
};
