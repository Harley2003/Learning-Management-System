import { IUser } from "../models/user.model";

/*
* Mở rộng giao diện Request của Express để thêm thuộc tính user
* Điều này cho phép chúng ta gán thông tin người dùng đã xác thực
* vào đối tượng yêu cầu, làm cho nó có sẵn trên toàn bộ ứng dụng của chúng ta.
*/
declare global {
  namespace Express {
    interface Request {
      /*
      * Thuộc tính user tùy chọn, kiểu IUser
      * Thuộc tính này sẽ chứa dữ liệu người dùng sau khi xác thực
      */
      user?: IUser;
    }
  }
}