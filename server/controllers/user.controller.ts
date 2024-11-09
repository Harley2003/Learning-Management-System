require("dotenv").config();
import {NextFunction, Request, Response} from "express";
import UserModel, {IUser} from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import {CatchAsyncError} from "../middleware/catchAsyncErrors";
import jwt, {JwtPayload, Secret} from "jsonwebtoken";
import sendMail from "../utils/sendMail";
import {
    accessTokenOptions,
    refreshTokenOptions,
    sendToken
} from "../utils/jwt";
import {redis} from "../utils/redis";
import {
    checkAccountStatus,
    createActivationToken,
    getAllUserServices,
    getUserById,
    updateUserRoleService
} from "../services/user.service";
import cloudinary from "cloudinary";
import crypto from "crypto";

/*
* - Các chức năng xử lý của Authenticator
*
* + Register User
* + Activate User
* + Login User
* + Logout User
* + Forgot Password
* + Reset Password
* + Update Access Token
*/

interface IRegistrationBody {
    name: string;
    email: string;
    password: string;
    avatar?: string;
}

/**
 * Đăng ký người dùng.
 *
 * @param req - Đối tượng yêu cầu từ client.
 * @param res - Đối tượng phản hồi từ server.
 * @param next - Hàm gọi tiếp theo để xử lý lỗi.
 */
export const registrationUser = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, email, password }: IRegistrationBody = req.body;

            // Kiểm tra xem email đã tồn tại chưa
            const isEmailExist = await UserModel.findOne({ email });
            if (isEmailExist) {
                return next(new ErrorHandler("Email already exists", 400));
            }

            const user: IRegistrationBody = {
                name,
                email,
                password,
            };

            const activationToken = createActivationToken(user);
            const activationCode = activationToken.activationCode;

            const data = { user: { name: user.name }, activationCode };

            // Gửi email kích hoạt
            await sendMail({
                email: user.email,
                subject: "Activate your account",
                template: "activation-mail.ejs",
                data,
            });

            res.status(201).json({
                success: true,
                message: `Please check your email: ${user.email} to activate your account!`,
                activationToken: activationToken.token,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }
    }
);

interface IActivationRequest {
    activation_token: string;
    activation_code: string;
}

/**
 * Kích hoạt tài khoản người dùng.
 *
 * @param req - Đối tượng yêu cầu từ client.
 * @param res - Đối tượng phản hồi từ server.
 * @param next - Hàm gọi tiếp theo để xử lý lỗi.
 */
export const activateUser = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { activation_token, activation_code }: IActivationRequest = req.body;

            // Xác minh token kích hoạt
            const newUser: { user: IUser; activationCode: string } = jwt.verify(
                activation_token,
                process.env.ACTIVATION_SECRET as string
            ) as { user: IUser; activationCode: string };

            // Kiểm tra mã kích hoạt
            if (newUser.activationCode !== activation_code) {
                return next(new ErrorHandler("Invalid activation code", 400));
            }

            const { name, email, password } = newUser.user;

            // Kiểm tra xem người dùng đã tồn tại
            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                existingUser.isVerified = true;
                await existingUser.save();
                return res.status(200).json({
                    success: true,
                    message: "Account has been activated",
                });
            }

            // Tạo người dùng mới
            const user = await UserModel.create({
                name,
                email,
                password,
                isVerified: true,
            });

            res.status(201).json({
                success: true,
                message: "Account has been activated",
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }
    }
);

interface ILoginRequest {
    email: string;
    password: string;
}

/**
 * Đăng nhập người dùng.
 *
 * @param req - Đối tượng yêu cầu từ client.
 * @param res - Đối tượng phản hồi từ server.
 * @param next - Hàm gọi tiếp theo để xử lý lỗi.
 */
export const loginUser = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password }: ILoginRequest = req.body;

            // Kiểm tra xem email và password có được cung cấp không
            if (!email || !password) {
                return next(new ErrorHandler("Please enter email and password.", 400));
            }

            // Tìm người dùng theo email
            const user = await UserModel.findOne({ email }).select("+password");
            if (!user) {
                return next(new ErrorHandler("Invalid email or password.", 400));
            }

            // So sánh password
            const isPasswordMatch = await user.comparePassword(password);
            if (!isPasswordMatch) {
                return next(new ErrorHandler("Invalid email or password.", 400));
            }

            // Kiểm tra trạng thái tài khoản
            checkAccountStatus(user, next, "Your account has been locked.");

            // Gửi token cho người dùng
            sendToken(user, 200, res);
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }
    }
);

/**
 * Đăng xuất người dùng.
 *
 * @param req - Đối tượng yêu cầu từ client.
 * @param res - Đối tượng phản hồi từ server.
 * @param next - Hàm gọi tiếp theo để xử lý lỗi.
 */
export const logoutUser = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Xóa cookies
            res.cookie("access_token", "", { maxAge: 1 });
            res.cookie("refresh_token", "", { maxAge: 1 });

            const userId = req.user?._id || "";

            // Xóa phiên người dùng trong redis
            await redis.del(userId as string);

            res.status(200).json({
                success: true,
                message: "Logged out successfully"
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }
    }
);

/**
 * Cập nhật access token dựa trên refresh token.
 *
 * @param req - Đối tượng yêu cầu từ client.
 * @param res - Đối tượng phản hồi từ server.
 * @param next - Hàm gọi tiếp theo để xử lý lỗi.
 */
export const updateAccessToken = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const refresh_token = req.cookies.refresh_token as string;

            // Giải mã refresh token
            const decoded = jwt.verify(
                refresh_token,
                process.env.REFRESH_TOKEN as string
            ) as JwtPayload;

            if (!decoded) {
                return next(new ErrorHandler("Could not refresh token", 400));
            }

            // Kiểm tra phiên người dùng trong redis
            const session = await redis.get(decoded.id as string);
            if (!session) {
                return next(new ErrorHandler("Please login to access this resource", 400));
            }

            const user = JSON.parse(session);

            // Tạo access token mới
            const accessToken = jwt.sign(
                { id: user._id },
                process.env.ACCESS_TOKEN as string,
                // {
                //     expiresIn: "15m"
                // }
            );

            // Tạo refresh token mới
            const refreshToken = jwt.sign(
                { id: user._id },
                process.env.REFRESH_TOKEN as string,
                // {
                //     expiresIn: "7d"
                // }
            );

            // Gán người dùng vào yêu cầu để sử dụng sau này
            req.user = user;

            // Cài đặt cookies với token mới
            res.cookie("access_token", accessToken, accessTokenOptions);
            res.cookie("refresh_token", refreshToken, refreshTokenOptions);

            // Cập nhật phiên người dùng trong redis với thời gian hết hạn 7 ngày
            await redis.set(user._id as string, JSON.stringify(user), "EX", 604800);

            // Gọi hàm tiếp theo
            next();
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }
    }
);

interface IForgetPassword {
    email: string;
}

/**
 * Xử lý yêu cầu quên mật khẩu.
 *
 * @param req - Đối tượng yêu cầu từ client.
 * @param res - Đối tượng phản hồi từ server.
 * @param next - Hàm gọi tiếp theo để xử lý lỗi.
 */
export const forgotPassword = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email }: IForgetPassword = req.body;

            // Tìm người dùng theo email
            const user = await UserModel.findOne({ email });
            if (!user) {
                return next(new ErrorHandler("User not found", 404)); // Người dùng không tìm thấy
            }

            /*
            // Kiểm tra trạng thái tài khoản
            checkAccountStatus(user, next, "Your account has been locked.");
            */

            // Tạo mã thông báo để đặt lại mật khẩu
            const resetToken = user.createPasswordResetToken();
            await user.save({ validateBeforeSave: false }); // Lưu thông tin người dùng mà không cần xác thực

            // Gửi thông báo thành công
            res.status(200).json({
                success: true,
                resetToken: resetToken, // Trả về mã thông báo đặt lại mật khẩu
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400)); // Xử lý lỗi chung
        }
    }
);

/**
 * Đặt lại mật khẩu cho người dùng.
 *
 * @param req - Đối tượng yêu cầu từ client.
 * @param res - Đối tượng phản hồi từ server.
 * @param next - Hàm gọi tiếp theo để xử lý lỗi.
 */
export const resetPassword = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const resetToken = req.params.token; // Lấy mã thông báo đặt lại mật khẩu từ tham số URL
            const hashedToken = crypto
                .createHash("sha256") // Mã hóa mã thông báo
                .update(resetToken)
                .digest("hex");

            // Tìm người dùng với mã thông báo đã mã hóa và kiểm tra thời gian hết hạn
            const user = await UserModel.findOne({
                passwordResetToken: hashedToken,
                passwordResetExpires: { $gt: Date.now() } // Kiểm tra xem mã thông báo có còn hiệu lực không
            });

            if (!user) {
                return next(new ErrorHandler("Invalid or expired token", 400)); // Mã thông báo không hợp lệ hoặc đã hết hạn
            }

            // Kiểm tra trạng thái tài khoản
            checkAccountStatus(user, next, "Your account has been locked.");

            // Cập nhật mật khẩu mới cho người dùng
            user.password = req.body.password; // Lưu mật khẩu mới
            user.passwordResetToken = undefined; // Đặt lại mã thông báo
            user.passwordResetExpires = undefined; // Đặt lại thời gian hết hạn

            await user.save(); // Lưu thay đổi vào cơ sở dữ liệu

            // Phản hồi thành công
            res.status(200).json({
                success: true,
                message: "Password has been reset successfully"
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }
    }
);

/*
* - Các chức năng xử lý của Users
*
* + Get User Info
* + Update User Info
* + Update User Password
* + Update Profile Picture
*/

/**
 * Lấy thông tin người dùng dựa trên ID của họ.
 *
 * @param req - Đối tượng yêu cầu từ client.
 * @param res - Đối tượng phản hồi từ server.
 * @param next - Hàm gọi tiếp theo để xử lý lỗi.
 */
export const getUserInfo = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?._id; // Lấy ID người dùng từ thông tin yêu cầu

            // Kiểm tra xem userId có tồn tại không
            if (!userId) {
                return next(new ErrorHandler("User not found", 404)); // Xử lý lỗi nếu không tìm thấy người dùng
            }

            // Gọi hàm lấy thông tin người dùng
            await getUserById(userId as string, res);
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400)); // Xử lý lỗi chung
        }
    }
);

interface IUpdateUserInfo {
    name: string;
    email: string;
}

/**
 * Cập nhật thông tin người dùng.
 *
 * @param req - Đối tượng yêu cầu từ client.
 * @param res - Đối tượng phản hồi từ server.
 * @param next - Hàm gọi tiếp theo để xử lý lỗi.
 */
export const updateUserInfo = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, email } = req.body as IUpdateUserInfo; // Lấy các thông tin từ yêu cầu

            const userId = req.user?._id; // Lấy ID người dùng từ yêu cầu

            const user = await UserModel.findById(userId); // Tìm người dùng theo ID

            if (!user) {
                return next(new ErrorHandler("User not found", 404)); // Kiểm tra xem người dùng có tồn tại không
            }

            /*
            // Kiểm tra trạng thái tài khoản
            checkAccountStatus(user, next, "Your account has been locked. Please log out.");
            */

            // Cập nhật thông tin người dùng nếu có
            if (name) user.name = name;
            if (email) user.email = email; // Cập nhật email nếu có

            await user.save(); // Lưu thông tin đã cập nhật

            // Cập nhật cache trong Redis
            try {
                await redis.set(userId as string, JSON.stringify(user), "EX", 604800); // Thiết lập thời gian hết hạn là 7 ngày
            } catch (error) {
                console.error("Error caching user data in Redis:", error); // Ghi log lỗi nếu không thể cache
            }

            // Trả về phản hồi thành công
            res.status(200).json({
                success: true,
                message: "User info updated successfully",
                user
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400)); // Xử lý lỗi chung
        }
    }
);

interface IUpdatePassword {
    oldPassword: string;
    newPassword: string;
}

/**
 * Cập nhật mật khẩu người dùng.
 *
 * @param req - Đối tượng yêu cầu từ client.
 * @param res - Đối tượng phản hồi từ server.
 * @param next - Hàm gọi tiếp theo để xử lý lỗi.
 */
export const updatePassword = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { oldPassword, newPassword } = req.body as IUpdatePassword;

            // Kiểm tra sự tồn tại của mật khẩu cũ và mới
            if (!oldPassword || !newPassword) {
                return next(new ErrorHandler("Please enter old and new password", 400));
            }

            // Tìm người dùng và lấy mật khẩu đã mã hóa
            const user = await UserModel.findById(req.user?._id).select("+password");
            if (!user) {
                return next(new ErrorHandler("Invalid User", 400));
            }

            // Kiểm tra xem mật khẩu cũ có khớp không
            const isPasswordMatch = await user.comparePassword(oldPassword);
            if (!isPasswordMatch) {
                return next(new ErrorHandler("Invalid old password", 400));
            }

            // Kiểm tra trạng thái tài khoản
            checkAccountStatus(user, next, "Your account has been locked. Please log out.");

            // Cập nhật mật khẩu mới
            user.password = newPassword;
            await user.save(); // Lưu thông tin đã cập nhật

            // Cập nhật cache trong Redis
            try {
                await redis.set(req.user?._id as string, JSON.stringify(user), "EX", 604800); // Đặt thời gian hết hạn là 7 ngày
            } catch (error) {
                console.error("Error caching user data in Redis:", error); // Ghi log lỗi nếu không thể cache
            }

            // Trả về phản hồi thành công
            res.status(200).json({
                success: true,
                message: "Password updated successfully",
                user: { _id: user._id, name: user.name, email: user.email } // Chỉ trả về thông tin cần thiết
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400)); // Xử lý lỗi chung
        }
    }
);

interface IUpdateProfilePicture {
    avatar: string;
}

/**
 * Cập nhật hình ảnh đại diện của người dùng.
 *
 * @param req - Đối tượng yêu cầu từ client.
 * @param res - Đối tượng phản hồi từ server.
 * @param next - Hàm gọi tiếp theo để xử lý lỗi.
 */
export const updateProfilePicture = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { avatar } = req.body as IUpdateProfilePicture;
            const userId = req.user?._id;

            // Tìm người dùng
            const user = await UserModel.findById(userId);
            if (!user) {
                return next(new ErrorHandler("User not found", 404));
            }

            // Kiểm tra trạng thái tài khoản
            checkAccountStatus(user, next, "Your account has been locked. Please log out.");

            // Nếu có hình ảnh đại diện mới
            if (avatar) {
                // Xóa hình ảnh cũ từ Cloudinary nếu có
                if (user.avatar?.public_id) {
                    await cloudinary.v2.uploader.destroy(user.avatar.public_id);
                }

                // Tải lên hình ảnh mới lên Cloudinary
                const myCloud = await cloudinary.v2.uploader.upload(avatar, {
                    folder: "avatars",
                    width: "150",
                    crop: "scale" // Có thể thêm crop để đảm bảo kích thước phù hợp
                });

                // Cập nhật thông tin hình ảnh đại diện
                user.avatar = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url
                };
            }

            // Lưu thông tin người dùng đã cập nhật
            await user.save();

            // Cập nhật cache trong Redis
            try {
                await redis.set(userId as string, JSON.stringify(user), "EX", 604800); // Đặt thời gian hết hạn là 7 ngày
            } catch (error) {
                console.error("Error caching user data in Redis:", error); // Ghi log lỗi nếu không thể cache
            }

            // Trả về phản hồi thành công
            res.status(200).json({
                success: true,
                message: "Profile picture updated successfully",
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar // Chỉ trả về thông tin cần thiết
                }
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400)); // Xử lý lỗi chung
        }
    }
);

/*
* - Các chức năng xử lý của Users phía Admin
*
* + Get All Users
* + Update User Role
* + Delete User
* + Lock/Unlock Account
*/

/**
 * Lấy danh sách tất cả người dùng cho admin.
 *
 * @param req - Đối tượng yêu cầu từ client.
 * @param res - Đối tượng phản hồi từ server.
 * @param next - Hàm gọi tiếp theo để xử lý lỗi.
 */
export const getAllUsersAdmin = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await getAllUserServices(res);
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400)); // Xử lý lỗi
        }
    }
);

interface IUpdateUserRole {
    email: string,
    role: string
}

/**
 * Cập nhật vai trò người dùng dựa trên email.
 *
 * @param req - Đối tượng yêu cầu từ client.
 * @param res - Đối tượng phản hồi từ server.
 * @param next - Hàm gọi tiếp theo để xử lý lỗi.
 */
export const updateUserRole = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, role } = req.body as IUpdateUserRole;
            const user = await UserModel.findOne({ email });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found!",
                });
            }

            const id: any = user._id;
            await updateUserRoleService(res, id, role); // Cập nhật vai trò người dùng

            res.status(200).json({
                success: true,
                message: `User role updated to ${role}`,
                user: { _id: user._id, email: user.email, role },
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400)); // Xử lý lỗi
        }
    }
);

/**
 * Xóa người dùng theo ID.
 *
 * @param req - Đối tượng yêu cầu từ client.
 * @param res - Đối tượng phản hồi từ server.
 * @param next - Hàm gọi tiếp theo để xử lý lỗi.
 */
export const deleteUser = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;

            const user = await UserModel.findById(id);
            if (!user) {
                return next(new ErrorHandler("User not found", 404)); // Kiểm tra người dùng
            }

            // Xóa hình ảnh đại diện từ Cloudinary
            if (user.avatar?.public_id) {
                await cloudinary.v2.uploader.destroy(user.avatar.public_id);
            }

            await user.deleteOne(); // Xóa người dùng
            await redis.del(id); // Xóa cache từ Redis

            res.status(200).json({
                success: true,
                message: "User deleted successfully",
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500)); // Xử lý lỗi
        }
    }
);

interface IUpdateUserStatus {
    userId: string,
    isActivate: string
}

/**
 * Cập nhật trạng thái kích hoạt của người dùng.
 *
 * @param req - Đối tượng yêu cầu từ client.
 * @param res - Đối tượng phản hồi từ server.
 * @param next - Hàm gọi tiếp theo để xử lý lỗi.
 */
export const updateUserStatus = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        const { userId, isActivate } = req.body as IUpdateUserStatus;
        try {
            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found." }); // Kiểm tra người dùng
            }

            user.isActivate = isActivate; // Cập nhật trạng thái
            await user.save();

            return res.status(200).json({
                success: true,
                message: `User ${user.name} status updated to ${isActivate}.`,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500)); // Xử lý lỗi
        }
    }
);
