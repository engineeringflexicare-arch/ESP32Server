const express = require("express");

// clearDeviceLogs එක අලුතින් import කරගන්න
const { getConfig, getAllConfigs, setConfig, logDeviceEvent, getDeviceLogs, clearDeviceLogs } = require("../controllers/deviceController");

const router = express.Router();

router.get("/getConfig", getConfig);
router.get("/configs", getAllConfigs);

router.post("/setConfig", setConfig);

router.post("/logEvent", logDeviceEvent);
router.get("/logs", getDeviceLogs);

// අලුත් Delete Route එක
router.delete("/logs", clearDeviceLogs);

module.exports = router;
