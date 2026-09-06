import crypto from "crypto";
import orderModel from "../models/orderMode.js";
import userModel from "../models/userModel.js";
import Razorpay from "razorpay";
import { sendSMS } from "../utils/sendSMS.js";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const frontend_URL = 'https://food-del-frontend-n7wi.onrender.com/';


// Placing user order for frontend
const placeOrder = async (req, res) => {
    try {
        const { items, amount, address } = req.body;
        const userId = req.userId || req.body.userId;

        // Check required data
        if (!userId || !items || items.length === 0 || !amount || !address) {
            return res.json({
                success: false,
                message: "Missing order details"
            });
        }

        // Create Razorpay order (amount in paise)
        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(amount * 100),
            currency: "INR",
            receipt: `order_${Date.now()}`
        });

        // Save order in MongoDB
        const newOrder = new orderModel({
            userId,
            items,
            amount,
            address,
            paymentMethod: "Razorpay",
            razorpayOrderId: razorpayOrder.id
        });

        await newOrder.save();

        // Clear cart
        await userModel.findByIdAndUpdate(
            userId,
            { cartData: {} }
        );

        // Send Razorpay order details to frontend
        res.json({
            success: true,
            order_id: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            dbOrderId: newOrder._id
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Placing user order with COD (Cash on Delivery)
const placeOrderCOD = async (req, res) => {
    try {
        const { items, amount, address } = req.body;
        const userId = req.userId || req.body.userId;

        if (!userId || !items || items.length === 0 || !amount || !address) {
            return res.json({
                success: false,
                message: "Missing order details"
            });
        }

        const newOrder = new orderModel({
            userId,
            items,
            amount,
            address,
            payment: false,
            paymentMethod: "COD",
            status: "Food Processing"
        });

        await newOrder.save();

        // Clear cart
        await userModel.findByIdAndUpdate(
            userId,
            { cartData: {} }
        );

        // Send SMS Notification
        const recipientPhone = address?.phone || "Mobile Number";
        const smsMessage = `Dear ${address?.firstName || 'Customer'}, your COD order #${newOrder._id.toString().slice(-6)} of ₹${amount} was placed successfully! Status: Food Processing. - Tomato`;

        sendSMS(recipientPhone, smsMessage).catch((err) => {
            console.log("SMS Send Error (non-blocking):", err);
        });

        res.json({
            success: true,
            message: "Order Placed Successfully (COD)",
            dbOrderId: newOrder._id
        });

    } catch (error) {
        console.log("COD Order Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to place COD order"
        });
    }
};

// Placing user order with Stripe (Credit/Debit Card)
const placeOrderStripe = async (req, res) => {
    try {
        const { items, amount, address } = req.body;
        const userId = req.userId || req.body.userId;

        if (!userId || !items || items.length === 0 || !amount || !address) {
            return res.json({
                success: false,
                message: "Missing order details"
            });
        }

        const newOrder = new orderModel({
            userId,
            items,
            amount,
            address,
            payment: true,
            paymentMethod: "Stripe",
            status: "Food Processing"
        });

        await newOrder.save();

        // Clear cart
        await userModel.findByIdAndUpdate(
            userId,
            { cartData: {} }
        );

        // Send SMS Notification
        const recipientPhone = address?.phone || "Mobile Number";
        const smsMessage = `Dear ${address?.firstName || 'Customer'}, your Stripe payment of ₹${amount} for Order #${newOrder._id.toString().slice(-6)} was successful! Status: Food Processing. - Tomato`;

        sendSMS(recipientPhone, smsMessage).catch((err) => {
            console.log("SMS Send Error (non-blocking):", err);
        });

        res.json({
            success: true,
            message: "Order Placed Successfully (Stripe)",
            dbOrderId: newOrder._id
        });

    } catch (error) {
        console.log("Stripe Order Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to process Stripe payment"
        });
    }
};


const verifyOrder = async (req, res) => {
    try {
        const {
            orderId,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        // Find order from MongoDB
        const order = await orderModel.findById(orderId);

        if (!order) {
            return res.json({
                success: false,
                message: "Order not found"
            });
        }

        // Create signature
        const body =
            order.razorpayOrderId +
            "|" +
            razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(body)
            .digest("hex");

        // Compare signatures
        if (expectedSignature === razorpay_signature) {
            await orderModel.findByIdAndUpdate(
                orderId,
                { payment: true }
            );

            // Send SMS notification to user's mobile number
            const recipientPhone = order.address?.phone || "Mobile Number";
            const smsMessage = `Dear ${order.address?.firstName || 'Customer'}, your payment of ₹${order.amount} for Order #${orderId.toString().slice(-6)} was successful! Status: Food Processing. Thank you for ordering from Tomato.`;
            
            sendSMS(recipientPhone, smsMessage).catch((smsErr) => {
                console.log("SMS Send Error (non-blocking):", smsErr);
            });

            return res.json({
                success: true,
                message: "Payment Verified & SMS Sent"
            });

        } else {
            return res.json({
                success: false,
                message: "Payment Verification Failed"
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Verification Error"
        });
    }
}


const deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.json({
                success: false,
                message: "Order ID is required"
            });
        }

        const deletedOrder = await orderModel.findByIdAndDelete(orderId);

        if (!deletedOrder) {
            return res.json({
                success: false,
                message: "Order not found"
            });
        }

        res.json({
            success: true,
            message: "Order deleted successfully"
        });

    } catch (error) {
        console.log("Delete Order Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete order"
        });
    }
};

// User orders for frontend
const userOrders = async (req, res) => {
    try {
        const userId = req.userId || req.body.userId;
        const orders = await orderModel.find({ userId }).sort({ date: -1 });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log("USER ORDERS ERROR:", error);
        res.json({ success: false, message: "Error fetching user orders" });
    }
};

// Listing orders for admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({}).sort({ date: -1 });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log("LIST ORDERS ERROR:", error);
        res.json({ success: false, message: "Error listing orders" });
    }
};

// Updating order status for admin panel
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await orderModel.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        console.log("UPDATE STATUS ERROR:", error);
        res.json({ success: false, message: "Error updating status" });
    }
};

export { placeOrder, placeOrderCOD, placeOrderStripe, verifyOrder, deleteOrder, userOrders, listOrders, updateStatus };
