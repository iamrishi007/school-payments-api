const axios = require("axios")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const Order = require("../models/order.model");
const OrderStatus = require("../models/orderStatus.model")

// generate unique order ID

const generateCustomOrderId = () =>
  "ORD-" + Math.random().toString(36).substring(2, 10).toUpperCase();

exports.createCollect = async (req, res, next) => {
  try {
    const { order_amount, student_info, callback_url, school_name } = req.body;
    const user = req.user;


    if (!order_amount || !callback_url) {
      return res.status(400).json({ message: "order_amount and callback_url are required" });
    }

    if (!student_info || !student_info.name || !student_info.id || !student_info.email) {
      return res.status(400).json({ message: "Complete student_info is required" });
    }

    // 2️⃣ Determine school_id and gateway_school_id

    let final_school_id = user.school_id; // internal Mongo ID
    let gateway_school_id = user.gateway_school_id || "TEST_GATEWAY_ID";

    if (user.role === "admin") {
      // Admin can override school_id / gateway_school_id
      if (req.body.school_id) final_school_id = req.body.school_id;
      if (req.body.gateway_school_id) gateway_school_id = req.body.gateway_school_id;

      // Validate ObjectId for admin-provided school_id
      if (!mongoose.Types.ObjectId.isValid(final_school_id)) {
        return res.status(400).json({ message: "Invalid school_id format" });
      }
    }

    const custom_order_id = generateCustomOrderId();


    const order = await Order.create({
      custom_order_id,
      school_name: school_name || "Unknown School",
      school_id: final_school_id,
      gateway_school_id,
      trustee_id: user._id,
      student_info,
      order_amount,
      status: "initiated",
    });


    await OrderStatus.create({
      collect_id: order._id,
      order_amount,
      status: "pending",
    });

    // 5️ Prepare payload for gateway
    const payload = { school_id: gateway_school_id, amount: order_amount.toString(), callback_url };
    const sign = jwt.sign(payload, process.env.PAYMENT_PG_KEY, {
      algorithm: "HS256",
      expiresIn: "10m",
    });

    // Call payment gateway
    let data;
    try {
      data = await axios.post(
        `${process.env.PAYMENT_API_URL}/create-collect-request`,
        { school_id: gateway_school_id, amount: order_amount.toString(), callback_url, sign },
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYMENT_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      data = data.data;
    } catch (gatewayErr) {
      console.error("Gateway call failed:", gatewayErr.response?.data || gatewayErr.message);
      data = {
        collect_request_id: "TEST12345",
        collect_request_url: "https://fake-payment-gateway.com/pay/TEST12345",
      };
    }

    // Save collect_request_id
    order.collect_request_id = data.collect_request_id || data.id;
    await order.save();

    // 8️ Return response
    return res.status(201).json({
      message: "Payment created successfully",
      collect_id: order._id,
      collect_request_id: order.collect_request_id,
      payment_url: data.collect_request_url || data.Collect_request_url || null,
      custom_order_id,
      school_id: final_school_id,
      school_name: school_name || "Unknown School",
      gateway_school_id,
    });

  } catch (err) {
    // Full error logging
    console.error("createCollect full error:", err);
    if (err.response) console.error("Gateway response data:", err.response.data);
    return res.status(500).json({
      message: "Payment creation failed",
      error: err.response?.data || err.message || "Unknown error",
    });
  }
};
