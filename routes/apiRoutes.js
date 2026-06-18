const express = require("express");
const { getConfig, getAllConfigs, setConfig, logDeviceEvent } = require("../controllers/deviceController"); // 'import' වෙනුවට 'require' භාවිතා කර ඇත

const router = express.Router();

// Configurations සම්බන්ධ Routes
router.get("/getConfig", getConfig);
router.get("/configs", getAllConfigs);
router.post("/setConfig", setConfig);

// Logging සම්බන්ධ Routes
router.post("/logEvent", logDeviceEvent);

module.exports = router; // 'export default' වෙනුවට 'module.exports' භාවිතා කර ඇත
