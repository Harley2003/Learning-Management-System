"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCourseServices = exports.createCourse = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const course_model_1 = __importDefault(require("../models/course.model"));
// create course
exports.createCourse = (0, catchAsyncErrors_1.CatchAsyncError)(async (data, res) => {
    const course = await course_model_1.default.create(data);
    res.status(201).json({
        success: true,
        message: "Course created successfully",
        course
    });
});
// get all course
const getAllCourseServices = async (res) => {
    const courses = await course_model_1.default.find().sort({ createdAt: -1 });
    res.status(201).json({
        success: true,
        courses
    });
};
exports.getAllCourseServices = getAllCourseServices;
