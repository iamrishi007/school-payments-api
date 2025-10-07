const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  school_id: { type: mongoose.Schema.Types.ObjectId, ref: "School" }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
