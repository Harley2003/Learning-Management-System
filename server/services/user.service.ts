import { NextFunction, Request, Response } from "express";
import userModel, {IUser} from "../models/user.model";
import { redis } from "../utils/redis";
import jwt, { Secret } from "jsonwebtoken";
import ErrorHandler from "../utils/ErrorHandler";

/**
 * Lấy thông tin người dùng theo ID.
 * @param id - ID duy nhất của người dùng.
 * @param res - Đối tượng phản hồi của Express.
 */
export const getUserById = async (id: string, res: Response): Promise<void> => {
    try {
        // Lấy thông tin người dùng từ Redis cache
        const userJson = await redis.get(id);

        if (userJson) {
            const user = JSON.parse(userJson);
            res.status(200).json({
                success: true,
                user
            });
        }

        // Tìm dữ liệu người dùng từ cơ sở dữ liệu nếu không tìm thấy trong Redis
        const user = await userModel.findById(id);
        if (user) {
            res.status(200).json({
                success: true,
                user
            });
        } else {
            res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

/**
 * Lấy danh sách tất cả người dùng.
 * @param res - Đối tượng phản hồi của Express.
 */
export const getAllUserServices = async (res: Response): Promise<void> => {
    try {
        const users = await userModel.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            users
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

/**
 * Cập nhật vai trò người dùng theo ID.
 * @param res - Đối tượng phản hồi của Express.
 * @param id - ID duy nhất của người dùng.
 * @param role - Vai trò mới để gán cho người dùng.
 */
export const updateUserRoleService = async (res: Response, id: string, role: string): Promise<void> => {
    try {
        const user = await userModel.findByIdAndUpdate(id, { role }, { new: true });
        res.status(200).json({
            success: true,
            user
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

interface IActivationToken {
    token: string;
    activationCode: string;
}

/**
 * Tạo mã kích hoạt với mã xác thực cho người dùng.
 * @param user - Dữ liệu người dùng để đưa vào token.
 * @returns Một đối tượng chứa mã kích hoạt và mã xác thực.
 */
export const createActivationToken = (user: any): IActivationToken => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const token = jwt.sign(
        { user, activationCode },
        process.env.ACTIVATION_SECRET as Secret,
        { expiresIn: "5m" }
    );

    return { token, activationCode };
};

export const checkAccountStatus = (
    user: IUser,
    next: NextFunction,
    message: string
) => {
    if (user.isActivate === "deactivate") {
        return next(new ErrorHandler(message, 400));
    }
};