const express = require("express");

const { getConfig, getAllConfigs, setConfig, logDeviceEvent, getDeviceLogs } = require("../controllers/deviceController");

const router = express.Router();

router.get("/getConfig", getConfig);
router.get("/configs", getAllConfigs);

router.post("/setConfig", setConfig);

router.post("/logEvent", logDeviceEvent);
router.get("/logs", getDeviceLogs);

module.exports = router;
