const mongoose = require("mongoose");

const configurationSchema = new mongoose.Schema({
  device_id: {
    type: String,
    required: true,
    unique: true,
  },
  firebase_api_key: {
    type: String,
    required: true,
  },
  firebase_url: {
    type: String,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// CommonJS ක්‍රමයට අපනයනය කිරීම (module.exports)
module.exports = mongoose.model("Configuration", configurationSchema);
