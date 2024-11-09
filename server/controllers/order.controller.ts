require("dotenv").config();
import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import { IOrder } from "../models/order.model";
import NotificationModel from "../models/notification.model";
import UserModel from "../models/user.model";
import CourseModel from "../models/course.model";
import sendMail from "../utils/sendMail";
import { redis } from "../utils/redis";
import { getAllOrderServices, newOrder } from "../services/order.service";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

/*
* - Các chức năng xử lý đơn hàng phía Users
*
* + Create Order (Payment)
* + Create Order Free
* + Send Stripe publishable key
* + New Payment
*/

/**
 * Tạo một đơn hàng mới.
 *
 * @param req - Đối tượng yêu cầu từ client, chứa thông tin đơn hàng.
 * @param res - Đối tượng phản hồi của Express.
 * @param next - Hàm gọi tiếp theo để xử lý lỗi.
 */
export const createOrder = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        // Lấy thông tin khóa học và thông tin thanh toán từ yêu cầu
        const { courseId, payment_info } = req.body as IOrder;

        // Kiểm tra thông tin thanh toán
        if (payment_info) {
          if ("id" in payment_info) {
            const paymentIntentId = payment_info.id;
            // Lấy thông tin về tình trạng thanh toán từ Stripe
            const paymentIntent = await stripe.paymentIntents.retrieve(
                paymentIntentId
            );

            // Kiểm tra xem thanh toán đã được xác nhận chưa
            if (paymentIntent.status !== "succeeded") {
              return next(new ErrorHandler("Payment not authorized!", 400));
            }
          }
        }

        // Lấy thông tin người dùng từ cơ sở dữ liệu
        const user = await UserModel.findById(req.user?._id);

        // Kiểm tra xem người dùng đã mua khóa học này chưa
        const courseExistInUser = user?.courses.some(
            (course: any) => course._id.toString() === courseId
        );

        if (courseExistInUser) {
          return next(
              new ErrorHandler("You have already purchased this course", 400)
          );
        }

        // Tìm khóa học trong cơ sở dữ liệu
        const course = await CourseModel.findById(courseId);

        // Kiểm tra xem khóa học có tồn tại hay không
        if (!course) {
          return next(new ErrorHandler("Course buy not found", 404));
        }

        // Tạo dữ liệu đơn hàng mới
        const data: any = {
          courseId: course?._id,
          userId: user?._id,
          payment_info
        };

        // Dữ liệu để gửi email xác nhận đơn hàng
        const mailData = {
          order: {
            _id: course._id?.toString().slice(0, 6),
            name: course?.name ?? "",
            price: course?.price ?? 0,
            date: new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric"
            })
          }
        };

        try {
          // Gửi email xác nhận đơn hàng cho người dùng
          if (user) {
            await sendMail({
              email: user.email,
              subject: "Order Confirmation",
              template: "order-confirmation.ejs",
              data: mailData
            });
          }
        } catch (error: any) {
          return next(new ErrorHandler(error.message, 500));
        }

        // Thêm khóa học vào danh sách khóa học của người dùng
        user?.courses.push(course?._id as any);

        // Cập nhật thông tin người dùng trong Redis
        await redis.set(req.user?._id as any, JSON.stringify(user));

        // Lưu thông tin người dùng
        await user?.save();

        // Tạo thông báo cho admin khi người dùng đặt hàng
        await NotificationModel.create({
          title: "New Order",
          // user: user?._id,
          message: `There is a new order from customer ${user?.name} for course ${course?.name}.`
        });

        // Cập nhật số lượng khóa học đã mua
        if (course.purchased) {
          course.purchased += 1;
        } else {
          course.purchased = 1;
        }

        // Lưu thông tin khóa học
        await course.save();

        // Tạo đơn hàng mới và gửi phản hồi
        newOrder(data, res, next);
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }
    }
);

interface ICreateFreeOrder {
  courseId: string
}

/**
 * Tạo đơn hàng miễn phí cho khóa học.
 *
 * @param req - Đối tượng yêu cầu từ client, chứa thông tin khóa học.
 * @param res - Đối tượng phản hồi của Express.
 * @param next - Hàm gọi tiếp theo để xử lý lỗi.
 */
export const createFreeOrder = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        // Lấy ID khóa học từ yêu cầu
        const { courseId } = req.body as ICreateFreeOrder;

        // Tìm thông tin người dùng trong cơ sở dữ liệu
        const user = await UserModel.findById(req.user?._id);

        // Kiểm tra xem người dùng có tồn tại hay không
        if (!user) {
          return next(new ErrorHandler("User not found", 404));
        }

        // Kiểm tra xem người dùng đã đăng ký khóa học này chưa
        const courseExistInUser = user.courses.some(
            (course: any) => course._id.toString() === courseId
        );

        if (courseExistInUser) {
          return next(
              new ErrorHandler("You have already purchased this course", 400)
          );
        }

        // Tìm khóa học trong cơ sở dữ liệu
        const course = await CourseModel.findById(courseId);
        console.log(course, "course");

        // Kiểm tra xem khóa học có tồn tại hay không
        if (!course) {
          return next(new ErrorHandler("Course free not found", 404));
        }

        // Thêm khóa học vào danh sách khóa học của người dùng
        user.courses.push(course._id as any);

        // Lưu thông tin người dùng và cập nhật cache Redis
        await redis.set(req.user?._id as any, JSON.stringify(user));
        await user.save();

        // Tạo thông báo cho người dùng về đơn hàng mới
        // await NotificationModel.create({
        //   user: user._id,
        //   title: "New Order",
        //   message: `You have successfully enrolled in the course: ${course.name}`
        // });

        // Cập nhật số lượng khóa học đã mua
        course.purchased = (course.purchased || 0) + 1;
        await course.save();

        // Dữ liệu để gửi email xác nhận đơn hàng
        const mailData = {
          order: {
            _id: course._id?.toString().slice(0, 6),
            name: course.name,
            price: "Free",
            date: new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric"
            })
          }
        };

        // Trả về phản hồi thành công với mã trạng thái 201 (Created)
        res.status(201).json({
          success: true,
          message: "Successfully enrolled in the course"
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }
    }
);

/**
 * Gửi khóa công khai của Stripe cho client.
 *
 * @param req - Đối tượng yêu cầu từ client.
 * @param res - Đối tượng phản hồi của Express.
 */
export const sendStripePublishableKey = CatchAsyncError(
    async (req: Request, res: Response) => {
      // Trả về khóa công khai của Stripe với mã trạng thái 200 (OK)
      res.status(200).json({
        publishablekey: process.env.STRIPE_PUBLISHABLE_KEY
      });
    }
);

/**
 * Tạo một giao dịch thanh toán mới với Stripe.
 *
 * @param req - Đối tượng yêu cầu từ client, chứa thông tin thanh toán.
 * @param res - Đối tượng phản hồi của Express.
 * @param next - Hàm gọi tiếp theo để xử lý lỗi.
 */
export const newPayment = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        // Tạo một payment intent mới với thông tin thanh toán từ yêu cầu
        const myPayment = await stripe.paymentIntents.create({
          amount: req.body.amount, // Số tiền cần thanh toán
          currency: "USD", // Loại tiền tệ
          metadata: {
            company: "E-Learning" // Thông tin công ty
          },
          automatic_payment_methods: {
            enabled: true // Kích hoạt các phương thức thanh toán tự động
          }
        });

        // Trả về phản hồi thành công với mã trạng thái 201 (Created) và client_secret
        res.status(201).json({
          success: true,
          client_secret: myPayment.client_secret // Trả về client_secret để xác thực thanh toán
        });
      } catch (error: any) {
        // Xử lý lỗi và gọi hàm tiếp theo với thông báo lỗi
        return next(new ErrorHandler(error.message, 500));
      }
    }
);

/*
* - Các chức năng xử lý đơn hàng phía Admin
*
* + Get All Orders
*/

/**
 * Lấy tất cả đơn hàng cho quản trị viên.
 *
 * @param req - Đối tượng yêu cầu từ client.
 * @param res - Đối tượng phản hồi của Express.
 * @param next - Hàm gọi tiếp theo để xử lý lỗi.
 */
export const getAllOrdersAdmin = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        // Gọi hàm để lấy tất cả các đơn hàng và gửi phản hồi
        getAllOrderServices(req, res, next);
      } catch (error: any) {
        // Xử lý lỗi và gọi hàm tiếp theo với thông báo lỗi
        return next(new ErrorHandler(error.message, 400));
      }
    }
);