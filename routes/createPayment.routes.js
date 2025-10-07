const express = require("express");
const router = express.Router();

const { createCollect } = require("../controllers/payment.controller");
const authenticate = require("../middlewares/auth.middleware"); // ✅ fixed import

router.post("/create", authenticate, createCollect);

module.exports = router;
