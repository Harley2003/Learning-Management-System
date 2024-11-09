import { NextFunction, Request, Response } from "express";

/*
 * Hàm CatchAsyncError dùng để bắt lỗi trong các hàm xử lý bất đồng bộ
 * Điều này giúp chúng ta xử lý các lỗi xảy ra trong hàm xử lý mà không làm ngắt quãng luồng điều khiển.
 */
export const CatchAsyncError =
    (theFunc: any) => (req: Request, res: Response, next: NextFunction) => {
        /*
         * Sử dụng Promise.resolve để đảm bảo rằng bất kỳ giá trị nào được trả về
         * từ theFunc sẽ được xử lý như một Promise. Nếu theFunc trả về một Promise,
         * hàm này sẽ chờ cho đến khi Promise hoàn thành, nếu có lỗi sẽ được bắt và truyền cho next.
         */
        Promise.resolve(theFunc(req, res, next)).catch(next);
    };
