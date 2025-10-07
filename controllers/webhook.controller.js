const WebhookLog = require("../models/webhookLog.model");
const Order = require("../models/order.model");
const OrderStatus = require("../models/orderStatus.model");

exports.handleWebhook = async (req, res, next) => {
  try {
    const payload = req.body;
    const headers = req.headers;

    const log = await WebhookLog.create({ payload, headers });

    const info = payload.order_info || payload;
    let collectIdentifier = info.order_id || info.collect_id || info.custom_order_id;

    if (typeof collectIdentifier === "string" && collectIdentifier.includes("/")) {
      collectIdentifier = collectIdentifier.split("/")[0];
    }

    const order = await Order.findById(collectIdentifier) ||
                  await Order.findOne({ custom_order_id: collectIdentifier });

    if (!order) {
      log.processed = false;
      log.errorMessage = "Order not found for webhook";
      await log.save();
      return res.status(404).json({ message: "Order not found" });
    }

    const update = {
      transaction_amount: info.transaction_amount || 0,
      bank_reference: info.bank_reference || "",
      status: info.status || "unknown",
      payment_mode: info.payment_mode || "",
      payment_details: info.payment_details || "",
      payment_message: info.payment_message || "",
      payment_time: info.payment_time ? new Date(info.payment_time) : undefined,
      error_message: info.error_message || ""
    };

    const orderStatus = await OrderStatus.findOneAndUpdate(
      { collect_id: order._id },
      { $set: update },
      { new: true, upsert: true }
    );

    log.processed = true;
    await log.save();

    return res.json({ message: "Webhook processed", orderStatus });
  } catch (err) {
    next(err);
  }
};
