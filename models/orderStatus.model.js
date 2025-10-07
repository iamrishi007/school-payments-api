const mongoose = require("mongoose");

const orderStatusSchema = new mongoose.Schema({
  collect_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true, index: true },
  order_amount: { type: Number },
  transaction_amount: { type: Number },
  payment_mode: { type: String },
  payment_details: { type: String },
  bank_reference: { type: String },
  payment_message: { type: String },
  status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
  error_message: { type: String },
  payment_time: { type: Date },
  transaction_id: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("OrderStatus", orderStatusSchema);
