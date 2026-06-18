const mongoose = require("mongoose");

const logEventSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
  },
  eventType: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// CommonJS ක්‍රමයට අපනයනය කිරීම (module.exports)
module.exports = mongoose.model("LogEvent", logEventSchema);
