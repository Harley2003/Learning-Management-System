import { Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import CourseModel from "../models/course.model";

// create course
export const createCourse = CatchAsyncError(
  async (data: any, res: Response) => {
    const course = await CourseModel.create(data);
    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course
    });
  }
);

// get all course
export const getAllCourseServices = async (res: Response) => {
  const courses = await CourseModel.find().sort({ createdAt: -1 });

  res.status(201).json({
    success: true,
    courses
  });
};
