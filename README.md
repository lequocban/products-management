<p align="center">
  <img src="public/images/new_logo.svg" alt="Products Management Logo" width="128" />
</p>

<h1 align="center">Products Management Backend</h1>

<p align="center">
  Hệ thống backend quản lý bán hàng với khu vực Admin, Client, xác thực OTP, giỏ hàng - đơn hàng và chat realtime theo phòng.
</p>

<p align="center">
  <a href="https://nodejs.org/"><img alt="Node.js" src="https://img.shields.io/badge/Node.js-Express%205-339933?logo=node.js&logoColor=white"></a>
  <a href="https://www.mongodb.com/"><img alt="MongoDB" src="https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white"></a>
  <a href="https://socket.io/"><img alt="Socket.IO" src="https://img.shields.io/badge/Realtime-Socket.IO-010101?logo=socket.io&logoColor=white"></a>
  <a href="https://pugjs.org/"><img alt="Pug" src="https://img.shields.io/badge/View-Pug-A86454?logo=pug&logoColor=white"></a>
  <a href="https://vercel.com/"><img alt="Vercel" src="https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel"></a>
</p>

## Mục Lục

- [1. Tổng quan dự án](#1-tổng-quan-dự-án)
- [2. Screenshot UI thực tế](#2-screenshot-ui-thực-tế)
- [3. Tính năng chính](#3-tính-năng-chính)
- [4. Ma trận chức năng](#4-ma-trận-chức-năng)
- [5. Kiến trúc hệ thống](#5-kiến-trúc-hệ-thống)
- [6. Cấu trúc thư mục](#6-cấu-trúc-thư-mục)
- [7. Biến môi trường](#7-biến-môi-trường)
- [8. Cài đặt và chạy local](#8-cài-đặt-và-chạy-local)
- [9. Sơ đồ route quan trọng](#9-sơ-đồ-route-quan-trọng)
- [10. Socket events realtime](#10-socket-events-realtime)
- [11. Triển khai Vercel](#11-triển-khai-vercel)
- [12. Ghi chú cải tiến](#12-ghi-chú-cải-tiến)
- [13. License](#13-license)

## 1. Tổng quan dự án

| Thành phần  | Công nghệ               |
| ----------- | ----------------------- |
| Runtime     | Node.js (CommonJS)      |
| Framework   | Express 5               |
| Database    | MongoDB + Mongoose      |
| Realtime    | Socket.IO               |
| View Engine | Pug                     |
| Upload ảnh  | Multer + Cloudinary     |
| Email OTP   | Nodemailer              |
| Triển khai  | Vercel (`@vercel/node`) |

Hệ thống bao gồm:

- Khu vực Admin để quản trị danh mục, sản phẩm, bài viết, người dùng, đơn hàng, nhóm quyền.
- Khu vực Client cho khách hàng duyệt sản phẩm, giỏ hàng, checkout, lịch sử đơn.
- Hệ thống tài khoản với đăng ký OTP, quên mật khẩu OTP, đổi mật khẩu.
- Chat realtime theo phòng (direct + group), có typing indicator và gửi ảnh.

## 2. Screenshot UI thực tế

> Bộ ảnh dưới đây là screenshot thật được chụp từ các trang đang chạy của dự án.

### Trang chủ Client

![Trang chủ Client](docs/screenshots/home-dashboard.png)

### Danh mục sản phẩm

![Danh mục sản phẩm](docs/screenshots/products-catalog.png)

### Giỏ hàng và thanh toán

![Giỏ hàng và thanh toán](docs/screenshots/cart-checkout.png)

### Dashboard Admin

![Dashboard Admin](docs/screenshots/admin-dashboard.png)

### Chat realtime

![Chat realtime](docs/screenshots/realtime-chat.png)

## 3. Tính năng chính

### 3.1. Admin (`/admin`)

- Dashboard thống kê nhanh theo các nhóm dữ liệu:
  - Danh mục sản phẩm
  - Sản phẩm
  - Tài khoản admin
  - Người dùng client
  - Danh mục bài viết
  - Bài viết
- Quản lý sản phẩm:
  - CRUD đầy đủ
  - Soft delete
  - Lọc trạng thái
  - Tìm kiếm theo từ khóa
  - Sắp xếp
  - Phân trang
  - Bulk actions (đổi trạng thái, đổi vị trí, xóa nhiều)
  - Upload ảnh thumbnail Cloudinary
- Quản lý danh mục sản phẩm dạng cây (parent/child).
- Quản lý bài viết + danh mục bài viết (tương tự module sản phẩm).
- Quản lý role/permissions (RBAC).
- Quản lý tài khoản admin.
- Quản lý user phía client.
- Quản lý đơn hàng:
  - `pending`, `processing`, `shipped`, `delivered`, `cancelled`, `returned`
  - Cập nhật trạng thái hàng loạt
  - Xem chi tiết đơn hàng
- Cài đặt chung website (tên website, logo, thông tin liên hệ).

### 3.2. Client (`/`)

- Trang chủ: sản phẩm nổi bật + sản phẩm mới.
- Sản phẩm:
  - Danh sách theo trạng thái active
  - Xem theo danh mục slug
  - Xem chi tiết theo slug
- Bài viết:
  - Danh sách tổng
  - Bài viết nổi bật
  - Bài viết mới nhất
  - Lọc theo danh mục slug
- Tìm kiếm sản phẩm theo từ khóa.
- Giỏ hàng:
  - Thêm sản phẩm
  - Cập nhật số lượng
  - Xóa sản phẩm
  - Hiển thị mini-cart ở layout
- Checkout:
  - Chọn từng item từ giỏ để thanh toán
  - Lưu snapshot giá vào order (không tin dữ liệu giá từ frontend)
  - Xóa item đã đặt khỏi giỏ
- Đơn hàng client:
  - Danh sách đơn
  - Chi tiết đơn

### 3.3. Tài khoản người dùng + Social + Chat

- Đăng ký tài khoản với OTP qua email.
- Đăng nhập/đăng xuất.
- Quên mật khẩu + reset mật khẩu bằng OTP.
- Đổi mật khẩu khi đã đăng nhập.
- Cập nhật profile + avatar.
- Kết bạn:
  - Danh sách chưa kết bạn
  - Danh sách yêu cầu đã gửi
  - Danh sách lời mời nhận được
  - Danh sách bạn bè
- Chat realtime:
  - Chat direct giữa bạn bè (room `friend`)
  - Chat nhóm (`group`)
  - Typing indicator
  - Gửi ảnh trong tin nhắn
  - Quản lý quyền thành viên phòng: `superAdmin`, `admin`, `user`
  - Thêm thành viên vào nhóm
  - Nâng quyền thành viên lên admin
  - Xóa phòng (chỉ `superAdmin`)

## 4. Ma trận chức năng

| Domain          | Mô tả đã triển khai                                  | Khu vực         |
| --------------- | ---------------------------------------------------- | --------------- |
| Catalog         | Danh sách sản phẩm, danh mục, chi tiết theo slug     | Client          |
| Content         | Danh sách bài viết, nổi bật, theo danh mục, chi tiết | Client          |
| Cart            | Thêm, cập nhật số lượng, xóa, mini-cart              | Client          |
| Checkout        | Chọn sản phẩm từ giỏ, tạo đơn, trang thành công      | Client          |
| Orders          | Lịch sử đơn + chi tiết đơn, quản lý đơn phía admin   | Client + Admin  |
| Authentication  | Đăng ký/login/logout, OTP quên mật khẩu              | Client          |
| RBAC            | Đăng nhập admin và phân quyền theo role              | Admin           |
| Product CMS     | CRUD + lọc/tìm kiếm/sắp xếp/phân trang/bulk action   | Admin           |
| Article CMS     | CRUD + danh mục cây + bulk action                    | Admin           |
| User Management | Quản lý user, đổi trạng thái, soft delete            | Admin           |
| Social Graph    | Gửi/huỷ/chấp nhận/từ chối lời mời kết bạn            | Client + Socket |
| Realtime Chat   | Join room, gửi tin nhắn, typing, gửi ảnh             | Client + Socket |

## 5. Kiến trúc hệ thống

```mermaid
flowchart TD
    Browser[Browser Client / Admin] --> Express[Express App]
    Express --> Routes[Routes]
    Routes --> Controllers[Controllers]
    Controllers --> Models[Mongoose Models]
    Models --> Mongo[(MongoDB)]

    Browser --> SocketClient[Socket.IO Client]
    SocketClient <--> SocketServer[Socket.IO Server]
    SocketServer --> ChatModel[Chat + RoomChat Models]
    ChatModel --> Mongo

    Controllers --> Cloudinary[Cloudinary Upload]
    Controllers --> Mailer[Nodemailer OTP Mail]
```

Luồng xử lý chuẩn:

1. Request đi vào route.
2. Route gọi middleware (auth/validate/upload nếu có).
3. Controller xử lý nghiệp vụ.
4. Model thao tác MongoDB.
5. Trả về view Pug hoặc redirect; sự kiện realtime phát qua Socket.IO.

## 6. Cấu trúc thư mục

```text
config/          Cấu hình hệ thống và kết nối database
controllers/     Nghiệp vụ chính (admin/client)
helper/          Hàm hỗ trợ dùng chung (tree, pagination, search, mail, upload)
middlewares/     Middleware auth, cart, category, setting, upload
models/          Mongoose schema
public/          Tài nguyên tĩnh (css/js/images/uploads)
routes/          Khai báo route theo nhóm admin/client
sockets/         Socket handlers realtime
validates/       Validate request cơ bản
views/           Pug templates cho admin/client
docs/screenshots/  Ảnh minh họa UI cho README
```

## 7. Biến môi trường

Dự án hiện sử dụng các biến sau:

| Biến               | Bắt buộc        | Ý nghĩa               |
| ------------------ | --------------- | --------------------- |
| `PORT`             | Có              | Cổng chạy server      |
| `MONGO_URL`        | Có              | Chuỗi kết nối MongoDB |
| `CLOUD_NAME`       | Có (nếu upload) | Cloudinary cloud name |
| `CLOUD_API_KEY`    | Có (nếu upload) | Cloudinary API key    |
| `CLOUD_API_SECRET` | Có (nếu upload) | Cloudinary API secret |
| `EMAIL_USER`       | Có (nếu OTP)    | Email gửi OTP         |
| `EMAIL_PASS`       | Có (nếu OTP)    | App password email    |

Ví dụ `.env`:

```env
PORT=3000
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/products-management

CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_cloud_api_key
CLOUD_API_SECRET=your_cloud_api_secret

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

## 8. Cài đặt và chạy local

### Yêu cầu

- Node.js 18+
- MongoDB (Atlas hoặc local)
- Tài khoản Cloudinary (nếu dùng upload)
- Email SMTP/Gmail app password (nếu dùng OTP)

### Cài đặt

```bash
npm install
```

### Chạy dự án

```bash
npm start
```

Script hiện tại:

- `npm start` -> `nodemon --inspect index.js`

## 9. Sơ đồ route quan trọng

### Admin

- `/admin/dashboard`
- `/admin/products`
- `/admin/products-category`
- `/admin/articles`
- `/admin/articles-category`
- `/admin/orders`
- `/admin/users`
- `/admin/accounts`
- `/admin/roles`
- `/admin/settings/general`
- `/admin/my-account`

### Client

- `/`
- `/products`
- `/articles`
- `/search`
- `/cart`
- `/checkout`
- `/orders`
- `/user/*`
- `/users/*`
- `/rooms-chat`
- `/chat/:roomChatId`

## 10. Socket events realtime

### Chat events

- `CLIENT_JOIN_ROOM`
- `CLIENT_SEND_MESSAGE`
- `CLIENT_SEND_TYPING`
- `SERVER_RETURN_MESSAGE`
- `SERVER_RETURN_TYPING`
- `SERVER_MESSAGE_ERROR`

### Friend + presence events

- `CLIENT_ADD_FRIEND`
- `CLIENT_CANCEL_FRIEND`
- `CLIENT_REFUSE_FRIEND`
- `CLIENT_ACCEPT_FRIEND`
- `SERVER_RETURN_LENGTH_ACCEPT_FRIEND`
- `SERVER_RETURN_INFO_ACCEPT_FRIEND`
- `SERVER_RETURN_USER_ID_CANCEL_FRIEND`
- `SERVER_RETURN_USER_ONLINE`
- `SERVER_RETURN_USER_OFFLINE`

## 11. Triển khai Vercel

Dự án đã có file `vercel.json` để route toàn bộ request về `index.js`.

```json
{
  "version": 2,
  "builds": [{ "src": "index.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "index.js" }]
}
```

Checklist deploy:

1. Push code lên GitHub.
2. Import repo vào Vercel.
3. Khai báo đầy đủ biến môi trường.
4. Deploy.

## 12. Ghi chú cải tiến

- Dự án theo mô hình SSR (Pug) + Socket realtime.
- Nhiều module dùng soft delete (`deleted: true/false`).
- Có thể mở rộng thêm API JSON và OpenAPI/Swagger khi cần frontend tách riêng.
- Nên bổ sung test tự động (unit/integration) để giảm rủi ro regression.

## 13. License

ISC
