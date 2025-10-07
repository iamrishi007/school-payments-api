const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const roleCheck = require("../middlewares/role.middleware");
const asyncHandler = require("../middlewares/asyncHandler");
const ownSchool = require("../middlewares/ownSchool.middleware");
const txCtrl = require("../controllers/transactions.controller");

// Admin only
router.get(
  "/",
  auth,
  roleCheck("admin"),
  asyncHandler(txCtrl.getAllTransactions)
);

// Admin or user by school
router.get(
  "/school/:schoolId",
  auth,
  roleCheck(["admin", "user"]),
  ownSchool,
  asyncHandler(txCtrl.getTransactionsBySchool)
);

// Admin or user single transaction status
router.get(
  "/status/:custom_order_id",
  auth,
  roleCheck(["admin", "user"]),
  asyncHandler(txCtrl.getTransactionStatus)
);

module.exports = router;
