const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  custom_order_id: { type: String, required: true, unique: true, index: true },
  school_name: { type: String, required: true },
  school_id: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true, index: true },
  gateway_school_id: { type: String }, // add this
  trustee_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  student_info: {
    name: String,
    id: String,
    email: String
  },
  gateway_name: { type: String },
  order_amount: { type: Number, required: true },
  collect_request_id: { type: String },
  status: { type: String, default: "initiated" }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
