"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllOrderServices = exports.newOrder = void 0;
const catchAsyncErrors_1 = require("./../middleware/catchAsyncErrors");
const order_model_1 = __importDefault(require("../models/order.model"));
// create order
exports.newOrder = (0, catchAsyncErrors_1.CatchAsyncError)(async (data, res, next) => {
    const order = await order_model_1.default.create(data);
    res.status(201).json({
        success: true,
        order
    });
});
// get all order
const getAllOrderServices = async (res) => {
    const orders = await order_model_1.default.find().sort({ createdAt: -1 });
    res.status(201).json({
        success: true,
        orders
    });
};
exports.getAllOrderServices = getAllOrderServices;