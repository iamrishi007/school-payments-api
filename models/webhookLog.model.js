const mongoose = require("mongoose");

const webhookLogSchema = new mongoose.Schema({
  payload: { type: Object },
  headers: { type: Object },
  receivedAt: { type: Date, default: Date.now },
  processed: { type: Boolean, default: false },
  errorMessage: { type: String }
});

module.exports = mongoose.model("WebhookLog", webhookLogSchema);
