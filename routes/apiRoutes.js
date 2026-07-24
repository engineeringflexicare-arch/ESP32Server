const express = require("express");

// Controller එකෙන් අවශ්‍ය සියලුම functions import කරගැනීම
const { getConfig, getAllConfigs, setConfig, getFirebaseToken, logDeviceEvent, getDeviceLogs, clearDeviceLogs } = require("../controllers/deviceController");

const router = express.Router();

// Configuration Routes
router.get("/getConfig", getConfig);
router.get("/configs", getAllConfigs);
router.post("/setConfig", setConfig);

// ESP32 Custom Token Authentication Route (අලුතින් එකතු කළ එක)
router.post("/getFirebaseToken", getFirebaseToken);

// Logging Routes
router.post("/logEvent", logDeviceEvent);
router.get("/logs", getDeviceLogs);
router.delete("/logs", clearDeviceLogs);

module.exports = router;
