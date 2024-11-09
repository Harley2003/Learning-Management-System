  import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import { redis } from "../utils/redis";
import cloudinary from "cloudinary";
import { createCourse, getAllCourseServices } from "../services/course.service";
import CourseModel from "./../models/course.model";
import mongoose from "mongoose";
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notification.model";
import axios from "axios";

/*
* - Các chức năng của khóa học phía Admin
*
* + Upload Course (Create Course)
* + Edit Course
* + Get All Courses
* + Delete Course
* + Get Course Content
*/

  /**
   * Tải lên một khóa học mới.
   *
   * @param req - Đối tượng yêu cầu từ client.
   * @param res - Đối tượng phản hồi của Express.
   * @param next - Hàm gọi tiếp theo để xử lý lỗi.
   */
  export const uploadCourse = CatchAsyncError(
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const data = req.body;
          const thumbnail = data.thumbnail;

          // Kiểm tra xem có thumbnail không
          if (thumbnail) {
            // Tải lên thumbnail lên Cloudinary
            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
              folder: "courses"
            });

            // Lưu thông tin thumbnail vào dữ liệu khóa học
            data.thumbnail = {
              public_id: myCloud.public_id,
              url: myCloud.secure_url
            };
          }

          // Tạo khóa học mới
          createCourse(data, res, next);
        } catch (error: any) {
          // Xử lý lỗi và gọi hàm tiếp theo với thông báo lỗi
          return next(new ErrorHandler(error.message, 500));
        }
      }
  );

  /**
   * Chỉnh sửa một khóa học hiện có.
   *
   * @param req - Đối tượng yêu cầu từ client.
   * @param res - Đối tượng phản hồi của Express.
   * @param next - Hàm gọi tiếp theo để xử lý lỗi.
   */
  export const editCourse = CatchAsyncError(
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const data = req.body;
          const thumbnail = data.thumbnail;
          const courseId = req.params.id;

          // Lấy dữ liệu khóa học hiện tại
          const courseData = (await CourseModel.findById(courseId)) as any;

          // Nếu có thumbnail mới và nó không phải là URL hợp lệ
          if (thumbnail && !thumbnail.startsWith("https")) {
            // Xóa thumbnail cũ khỏi Cloudinary
            await cloudinary.v2.uploader.destroy(courseData.thumbnail.public_id);

            // Tải lên thumbnail mới lên Cloudinary
            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
              folder: "courses"
            });

            // Cập nhật thông tin thumbnail
            data.thumbnail = {
              public_id: myCloud.public_id,
              url: myCloud.secure_url
            };
          }

          // Nếu thumbnail là URL hợp lệ
          if (thumbnail.startsWith("https")) {
            data.thumbnail = {
              public_id: courseData?.thumbnail.public_id,
              url: courseData?.thumbnail.url
            };
          }

          // Cập nhật khóa học với dữ liệu mới
          const course = await CourseModel.findByIdAndUpdate(
              courseId,
              {
                $set: data
              },
              { new: true }
          );

          // Cập nhật bộ nhớ cache Redis
          await redis.del("allCourses");
          await redis.set(courseId, JSON.stringify(course), "EX", 604800);

          // Trả về phản hồi thành công với khóa học đã cập nhật
          res.status(201).json({
            success: true,
            course
          });
        } catch (error: any) {
          // Xử lý lỗi và gọi hàm tiếp theo với thông báo lỗi
          return next(new ErrorHandler(error.message, 500));
        }
      }
  );

  /**
   * Lấy tất cả khóa học dành cho quản trị viên.
   *
   * @param req - Đối tượng yêu cầu từ client.
   * @param res - Đối tượng phản hồi của Express.
   * @param next - Hàm gọi tiếp theo để xử lý lỗi.
   */
  export const getAllCoursesAdmin = CatchAsyncError(
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          // Gọi dịch vụ để lấy tất cả khóa học
          getAllCourseServices(req, res, next);
        } catch (error: any) {
          // Xử lý lỗi và gọi hàm tiếp theo với thông báo lỗi
          return next(new ErrorHandler(error.message, 400));
        }
      }
  );

  /**
   * Xóa một khóa học theo ID.
   *
   * @param req - Đối tượng yêu cầu từ client, bao gồm ID của khóa học.
   * @param res - Đối tượng phản hồi của Express.
   * @param next - Hàm gọi tiếp theo để xử lý lỗi.
   */
  export const deleteCourse = CatchAsyncError(
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const { id } = req.params; // Lấy ID từ tham số URL

          // Tìm khóa học theo ID
          const course = await CourseModel.findById(id);

          // Kiểm tra xem khóa học có tồn tại hay không
          if (!course) {
            return next(new ErrorHandler("Course not found", 404));
          }

          // Xóa khóa học
          await course.deleteOne({ id });

          // Xóa thông tin khóa học khỏi bộ nhớ cache Redis
          await redis.del(id);
          await redis.del("allCourses");

          // Trả về phản hồi thành công
          res.status(200).json({
            success: true,
            message: "Course deleted successfully"
          });
        } catch (error: any) {
          // Xử lý lỗi và gọi hàm tiếp theo với thông báo lỗi
          return next(new ErrorHandler(error.message, 400));
        }
      }
  );

/*
* - Các chức năng chung của khóa học
*
* + Get Course Content
* + Generate Video URL
*/

  /**
   * Lấy nội dung khóa học theo người dùng.
   *
   * @param req - Đối tượng yêu cầu từ client.
   * @param res - Đối tượng phản hồi của Express.
   * @param next - Hàm gọi tiếp theo để xử lý lỗi.
   */
  export const getCourseByUser = CatchAsyncError(
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const userCourseList = req.user?.courses; // Lấy danh sách khóa học của người dùng
          const courseId = req.params.id; // Lấy ID khóa học từ tham số URL

          // Cho phép truy cập nếu người dùng là quản trị viên
          if (req.user?.role === "admin") {
            const course = await CourseModel.findById(courseId); // Tìm khóa học theo ID
            const content = course?.courseData; // Lấy dữ liệu khóa học

            return res.status(200).json({
              success: true,
              message: "Course content fetched successfully",
              content
            });
          }

          // Kiểm tra xem khóa học có tồn tại trong danh sách khóa học của người dùng
          const courseExists = userCourseList?.find(
              (course: any) => course._id.toString() === courseId
          );

          if (!courseExists) {
            // Nếu khóa học không tồn tại, trả về lỗi
            return next(
                new ErrorHandler("You are not eligible to access this course", 404)
            );
          }

          // Tìm khóa học và lấy dữ liệu khóa học
          const course = await CourseModel.findById(courseId);
          const content = course?.courseData;

          res.status(200).json({
            success: true,
            message: "Course content fetched successfully",
            content
          });
        } catch (error: any) {
          // Xử lý lỗi và gọi hàm tiếp theo với thông báo lỗi
          return next(new ErrorHandler(error.message, 500));
        }
      }
  );

  /**
   * Tạo URL video từ Vimeo.
   *
   * @param req - Đối tượng yêu cầu từ client, bao gồm URL video.
   * @param res - Đối tượng phản hồi của Express.
   * @param next - Hàm gọi tiếp theo để xử lý lỗi.
   */
  export const generateVideoUrl = CatchAsyncError(
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const { videoUrl } = req.body; // Lấy URL video từ yêu cầu

          // Trích xuất ID video từ URL Vimeo
          const videoId = videoUrl.split("/").pop();

          // Gọi API Vimeo để lấy thông tin video
          const response = await axios.get(
              `https://api.vimeo.com/videos/${videoId}`,
              {
                headers: {
                  Accept: "application/json",
                  Authorization: `Bearer ${process.env.VIMEO_API_SECRET}` // Thêm token xác thực
                }
              }
          );

          const { embed } = response.data; // Lấy thông tin nhúng video
          const embedUrl = embed.html.match(/src="([^"]+)"/)[1]; // Lấy URL nhúng từ HTML

          res.json({ link: embedUrl }); // Trả về URL nhúng
        } catch (error: any) {
          // Xử lý lỗi và gọi hàm tiếp theo với thông báo lỗi
          return next(new ErrorHandler(error.message, 400));
        }
      }
  );

/*
* - Các chức năng của khóa học phía Users
*
* + Get Single Course
* + Get All Courses
* + Add Question
* + Add Answer
* + Add Review
* + Add Reply in Review
* +
*/

  /**
   * Lấy thông tin một khóa học theo ID.
   *
   * @param req - Đối tượng yêu cầu từ client.
   * @param res - Đối tượng phản hồi của Express.
   * @param next - Hàm gọi tiếp theo để xử lý lỗi.
   */
  export const getSingleCourse = CatchAsyncError(
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const courseId = req.params.id; // Lấy ID khóa học từ tham số URL

          // Kiểm tra xem dữ liệu khóa học đã được lưu trong cache Redis chưa
          const isCacheExist = await redis.get(courseId);

          if (isCacheExist) {
            const course = JSON.parse(isCacheExist); // Phân tích dữ liệu từ cache
            if (course) {
              return res.status(200).json({
                success: true,
                message: "Course fetched successfully from cache.",
                course,
              });
            }
          }

          // Nếu không có trong cache, tìm khóa học trong cơ sở dữ liệu
          const course = await CourseModel.findById(courseId).select(
              "-courseData.videoUrl -courseData.suggestions -courseData.questions -courseData.links" // Loại bỏ một số trường không cần thiết
          );

          if (!course) {
            // Nếu không tìm thấy khóa học, trả về lỗi
            return next(new ErrorHandler("Course not found", 404));
          }

          // Lưu khóa học vào cache Redis với thời gian sống là 7 ngày
          await redis.set(courseId, JSON.stringify(course), "EX", 604800);

          res.status(200).json({
            success: true,
            message: "Course fetched successfully from database.",
            course,
          });
        } catch (error: any) {
          // Xử lý lỗi và gọi hàm tiếp theo với thông báo lỗi
          return next(new ErrorHandler(error.message, 500));
        }
      }
  );

  /**
   * Lấy tất cả khóa học.
   *
   * @param req - Đối tượng yêu cầu từ client.
   * @param res - Đối tượng phản hồi của Express.
   * @param next - Hàm gọi tiếp theo để xử lý lỗi.
   */
  export const getAllCourses = CatchAsyncError(
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          // Kiểm tra xem dữ liệu tất cả khóa học đã được lưu trong cache Redis chưa
          const isCacheExist = await redis.get("allCourses");

          if (isCacheExist) {
            const courses = JSON.parse(isCacheExist); // Phân tích dữ liệu từ cache
            res.status(200).json({
              success: true,
              message: "Courses fetched successfully - all",
              courses,
            });
          } else {
            // Nếu không có trong cache, tìm tất cả khóa học trong cơ sở dữ liệu
            const courses = await CourseModel.find().select(
                "-courseData.videoUrl -courseData.suggestions -courseData.questions -courseData.links" // Loại bỏ một số trường không cần thiết
            );

            // Lưu tất cả khóa học vào cache Redis với thời gian sống là 1 ngày
            await redis.set("allCourses", JSON.stringify(courses), "EX", 86400);

            res.status(200).json({
              success: true,
              message: "Courses fetched successfully - all",
              courses,
            });
          }
        } catch (error: any) {
          // Xử lý lỗi và gọi hàm tiếp theo với thông báo lỗi
          return next(new ErrorHandler(error.message, 500));
        }
      }
  );

  interface IAddQuestionData {
    question: string; // Câu hỏi từ người dùng
    courseId: string; // ID của khóa học
    contentId: string; // ID của nội dung mà câu hỏi liên quan
  }

  /**
   * Thêm câu hỏi vào một khóa học.
   *
   * @param req - Đối tượng yêu cầu từ client.
   * @param res - Đối tượng phản hồi của Express.
   * @param next - Hàm gọi tiếp theo để xử lý lỗi.
   */
  export const addQuestion = CatchAsyncError(
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const { question, courseId, contentId }: IAddQuestionData = req.body;

          // Tìm khóa học theo ID
          const course = await CourseModel.findById(courseId);

          // Kiểm tra xem contentId có hợp lệ không
          if (!mongoose.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler("Invalid content id", 400));
          }

          // Tìm nội dung trong khóa học
          const courseContent = course?.courseData?.find((item: any) =>
              item._id.equals(contentId)
          );

          // Nếu không tìm thấy nội dung, trả về lỗi
          if (!courseContent) {
            return next(new ErrorHandler("Invalid content id", 400));
          }

          // Tạo một đối tượng câu hỏi mới
          const newQuestion: any = {
            user: req.user, // Người dùng đặt câu hỏi
            question,
            questionReplies: [] // Danh sách phản hồi cho câu hỏi
          };

          // Thêm câu hỏi vào nội dung của khóa học
          courseContent.questions.push(newQuestion);

          // Tạo thông báo cho người dùng
          await NotificationModel.create({
            // user: req.user?._id,
            title: "New Question Received",
            message: `You have a new question about course ${course?.name} in section ${courseContent?.videoSection} with title ${courseContent?.title}.`
          });

          // Lưu thay đổi vào cơ sở dữ liệu
          await course?.save();

          // Trả về phản hồi thành công
          res.status(200).json({
            success: true,
            message: "Question added successfully",
            course
          });
        } catch (error: any) {
          // Xử lý lỗi và gọi hàm tiếp theo với thông báo lỗi
          return next(new ErrorHandler(error.message, 500));
        }
      }
  );

  interface IAddAnswerData {
    answer: string; // Phản hồi từ người dùng
    courseId: string; // ID của khóa học
    contentId: string; // ID của nội dung mà phản hồi liên quan
    questionId: string; // ID của câu hỏi mà phản hồi liên quan
  }

  /**
   * Thêm phản hồi cho một câu hỏi trong khóa học.
   *
   * @param req - Đối tượng yêu cầu từ client.
   * @param res - Đối tượng phản hồi của Express.
   * @param next - Hàm gọi tiếp theo để xử lý lỗi.
   */
  export const addAnswer = CatchAsyncError(
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const { answer, courseId, contentId, questionId }: IAddAnswerData =
              req.body;

          // Tìm khóa học theo ID
          const course = await CourseModel.findById(courseId);

          // Kiểm tra xem contentId có hợp lệ không
          if (!mongoose.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler("Invalid content id", 400));
          }

          // Tìm nội dung trong khóa học
          const courseContent = course?.courseData?.find((item: any) =>
              item._id.equals(contentId)
          );

          // Nếu không tìm thấy nội dung, trả về lỗi
          if (!courseContent) {
            return next(new ErrorHandler("Invalid content id", 400));
          }

          // Tìm câu hỏi theo ID
          const question = courseContent.questions.find((item: any) =>
              item._id.equals(questionId)
          );

          // Nếu không tìm thấy câu hỏi, trả về lỗi
          if (!question) {
            return next(new ErrorHandler("Invalid question id", 400));
          }

          // Tạo một đối tượng phản hồi mới
          const newAnswer: any = {
            user: req.user, // Người dùng trả lời
            answer,
            createAt: new Date().toISOString(), // Thời gian tạo phản hồi
            updatedAt: new Date().toISOString() // Thời gian cập nhật phản hồi
          };

          // Thêm phản hồi vào câu hỏi
          question.questionReplies?.push(newAnswer);

          // Lưu thay đổi vào cơ sở dữ liệu
          await course?.save();

          // Kiểm tra nếu người dùng không phải là người đặt câu hỏi
          if (req.user?._id !== question.user?._id) {
            const data = {
              name: question.user?.name,
              title: courseContent.title
            };

            // Gửi email thông báo cho người đặt câu hỏi
            try {
              await sendMail({
                email: question.user?.email,
                subject: "Question Reply",
                template: "question-reply.ejs",
                data
              });
            } catch (error: any) {
              return next(new ErrorHandler(error.message, 500));
            }
          }

          // else {
          //   await NotificationModel.create({
          //     user: req.user?._id,
          //     title: "New Question Reply Received",
          //     message: `You have a new question reply in ${courseContent?.title}`
          //   });
          // }

          // Trả về phản hồi thành công
          res.status(200).json({
            success: true,
            message: "Answer added successfully",
            course
          });
        } catch (error: any) {
          // Xử lý lỗi và gọi hàm tiếp theo với thông báo lỗi
          return next(new ErrorHandler(error.message, 500));
        }
      }
  );

  interface IAddReviewData {
    review: string;
    rating: number;
    userId: string;
  }

  /**
   * Thêm đánh giá cho một khóa học.
   *
   * @param req - Đối tượng yêu cầu của Express, chứa thông tin người dùng và khóa học.
   * @param res - Đối tượng phản hồi của Express.
   * @param next - Hàm tiếp theo để xử lý lỗi.
   *
   * @throws {ErrorHandler} - Nếu người dùng không đủ điều kiện cho khóa học hoặc khóa học không tồn tại.
   *
   * @returns {Promise<void>} - Không trả về giá trị, nhưng gửi phản hồi thành công với thông tin khóa học.
   */
  export const addReview = CatchAsyncError(
      async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
          const userCourseList = req.user?.courses;
          const courseId = req.params.id;

          // Kiểm tra xem courseId có tồn tại trong userCourseList dựa trên _id
          const courseExist = userCourseList?.some(
              (course: any) => course._id.toString() === courseId.toString()
          );

          if (!courseExist) {
            return next(
                new ErrorHandler("You are not eligible for this course", 404)
            );
          }

          const course = await CourseModel.findById(courseId);

          if (!course) {
            return next(new ErrorHandler("Course not found", 404));
          }

          const { review, rating }: IAddReviewData = req.body;

          const reviewData: any = {
            user: req.user,
            rating,
            comment: review
          };

          course?.reviews.push(reviewData);

          let avg = 0;

          course?.reviews.forEach((rev: any) => {
            avg += rev.rating;
          });

          if (course) {
            course.ratings = avg / course?.reviews.length;
          }

          await course?.save();

          // 7 ngày
          await redis.set(courseId, JSON.stringify(course), "EX", 604800);

          // Tạo thông báo
          await NotificationModel.create({
            // user: req.user?._id,
            title: "New Review Received",
            message: `Customer ${req.user?.name} has given a review in ${course?.name}`
          });

          res.status(200).json({
            success: true,
            message: "Review added successfully",
            course
          });
        } catch (error: any) {
          return next(new ErrorHandler(error.message, 500));
        }
      }
  );

  interface IAddReplyReviewData {
    comment: string;
    courseId: string;
    reviewId: string;
  }

  /**
   * Thêm phản hồi cho một đánh giá trong khóa học.
   *
   * @param req - Đối tượng yêu cầu của Express, chứa thông tin người dùng và đánh giá.
   * @param res - Đối tượng phản hồi của Express.
   * @param next - Hàm tiếp theo để xử lý lỗi.
   *
   * @throws {ErrorHandler} - Nếu khóa học hoặc đánh giá không tồn tại.
   *
   * @returns {Promise<void>} - Không trả về giá trị, nhưng gửi phản hồi thành công với thông tin khóa học.
   */
  export const addReplyToReview = CatchAsyncError(
      async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
          const { comment, courseId, reviewId }: IAddReplyReviewData = req.body;

          const course = await CourseModel.findById(courseId);

          if (!course) {
            return next(new ErrorHandler("Course not found", 400));
          }

          const review = course?.reviews?.find((item: any) =>
              item._id.equals(reviewId)
          );

          if (!review) {
            return next(new ErrorHandler("Review not found", 400));
          }

          const replyData: any = {
            user: req.user,
            comment,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          if (!review.commentReplies) {
            review.commentReplies = [];
          }

          review.commentReplies?.push(replyData);

          await course?.save();

          // 7 ngày
          await redis.set(courseId, JSON.stringify(course), "EX", 604800);

          res.status(200).json({
            success: true,
            message: "Reply added successfully",
            course
          });
        } catch (error: any) {
          return next(new ErrorHandler(error.message, 500));
        }
      }
  );