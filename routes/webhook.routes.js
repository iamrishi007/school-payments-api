const router = require("express").Router();
const webhookCtrl = require("../controllers/webhook.controller");

router.post("/", webhookCtrl.handleWebhook);

module.exports = router;
