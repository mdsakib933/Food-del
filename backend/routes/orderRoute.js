import express from "express";
import authMiddleware from "../middleware/auth.js";
import { placeOrder, placeOrderCOD, placeOrderStripe, verifyOrder, deleteOrder, userOrders, listOrders, updateStatus } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/place-cod", authMiddleware, placeOrderCOD);
orderRouter.post("/place-stripe", authMiddleware, placeOrderStripe);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/delete", deleteOrder);
orderRouter.post("/userOrders", authMiddleware, userOrders);
orderRouter.get("/list", listOrders);
orderRouter.post("/status", updateStatus);

export default orderRouter;
