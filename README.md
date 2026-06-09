# 🚀 Tích hợp Cổng thanh toán VNPAY Sandbox

Chào mừng bạn đến với dự án **Tích hợp Cổng thanh toán VNPAY (Môi trường Sandbox)**. Đây là tài liệu hướng dẫn cấu hình và khởi chạy dự án dành cho Bài tập thực hành môn Thương mại điện tử.

Dự án được xây dựng với kiến trúc Client-Server rõ ràng, cho phép mô phỏng luồng thanh toán thực tế của VNPAY mà không cần kết nối Database.

## 1. GIỚI THIỆU DỰ ÁN

Dự án này là một hệ thống demo hoàn chỉnh việc giao tiếp với cổng thanh toán VNPAY. Bao gồm các chức năng tạo URL thanh toán, gửi người dùng sang trang thanh toán của VNPAY, và xử lý callback (Return URL) để kiểm tra tính hợp lệ của giao dịch dựa trên chữ ký số (Secure Hash).

**Công nghệ sử dụng:**
- **Backend**: Node.js, NestJS (Xử lý logic mã hoá HMAC SHA-512 và xác thực).
- **Frontend**: React.js, Vite, Tailwind CSS v3, Lucide React (Giao diện người dùng hiện đại, Responsive).
- **Công cụ hỗ trợ**: Ngrok (Tạo đường dẫn public HTTPS để VNPAY có thể redirect/webhook về localhost).

---

## 2. YÊU CẦU TIỀN ĐỀ (PREREQUISITES)

Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã được cài đặt các phần mềm sau:
- **Node.js**: Phiên bản 18.x trở lên.
- **Package Manager**: `npm` (thường đi kèm với Node.js) hoặc `yarn`.
- **Ngrok**: Công cụ tạo public URL cho localhost. ([Tải Ngrok tại đây](https://ngrok.com/download))
- **Trình soạn thảo mã (IDE)**: VS Code hoặc bất kỳ IDE nào bạn quen thuộc.

---

## 3. HƯỚNG DẪN CÀI ĐẶT CHI TIẾT

Dự án được tổ chức theo dạng Monorepo với 2 thư mục chính: `backend` và `frontend`. Bạn cần mở Terminal (Command Prompt / PowerShell / Git Bash) và thực hiện cài đặt dependencies cho từng phần.

### Bước 1: Clone repository
Nếu bạn chưa có mã nguồn trên máy, hãy clone nó về:
```bash
git clone <đường_dẫn_repository_của_bạn>
cd BTTH
```

### Bước 2: Cài đặt cho Backend
Mở một tab terminal mới và chạy các lệnh sau:
```bash
cd backend
npm install
```
*(Nếu bạn dùng yarn, hãy thay bằng lệnh `yarn install`)*

### Bước 3: Cài đặt cho Frontend
Mở một tab terminal khác và chạy các lệnh sau:
```bash
cd frontend
npm install
```
*(Nếu bạn dùng yarn, hãy thay bằng lệnh `yarn install`)*

---

## 4. CẤU HÌNH MÔI TRƯỜNG (.ENV)

Để Backend có thể giao tiếp với VNPAY, bạn cần cung cấp các thông tin xác thực.

1. Di chuyển vào thư mục `backend/`.
2. Tạo một file mới có tên là `.env` (có dấu chấm ở đầu).
3. Copy và dán nội dung mẫu dưới đây vào file `.env` vừa tạo:

```env
# Port chạy server Backend
PORT=3000

# Các thông tin lấy từ VNPAY Sandbox
vnp_TmnCode=YOUR_TMN_CODE_HERE
vnp_HashSecret=YOUR_HASH_SECRET_HERE
vnp_Url=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
vnp_Api=https://sandbox.vnpayment.vn/merchant_webapi/api/transaction

# Đường dẫn mà VNPAY sẽ redirect về sau khi thanh toán xong (Sẽ cập nhật bằng Link Ngrok ở Bước 5)
vnp_ReturnUrl=https://your-ngrok-url.ngrok-free.dev/payment/vnpay_return

# Đường dẫn của Frontend (Để Backend redirect về lại màn hình giao diện)
FE_URL=http://localhost:5173
```

> [!TIP]
> **Cách lấy `vnp_TmnCode` và `vnp_HashSecret`**: 
> Truy cập [VNPAY Sandbox](https://sandbox.vnpayment.vn/devreg/), đăng ký một tài khoản môi trường test. Sau khi đăng ký thành công, VNPAY sẽ gửi email chứa `TmnCode` (Mã website) và `HashSecret` (Chuỗi bí mật tạo checksum) cho bạn.

---

## 5. CẤU HÌNH NGROK (QUAN TRỌNG)

VNPAY yêu cầu `vnp_ReturnUrl` phải là một địa chỉ IP public hoặc tên miền có HTTPS. Vì Backend của chúng ta đang chạy ở `localhost:3000`, ta cần dùng Ngrok để tạo ra một URL public giả lập.

1. Khởi động phần mềm Ngrok trên máy của bạn (Mở terminal hoặc double-click vào file ngrok.exe).
2. Chạy lệnh sau để expose port 3000:
   ```bash
   ngrok http 3000
   ```
3. Copy đường dẫn `https://xxxx-xx-xx-xx.ngrok-free.dev` từ cửa sổ của Ngrok.
4. Mở lại file `backend/.env`.
5. Dán đường dẫn vừa copy vào biến `vnp_ReturnUrl`, nhớ thêm `/payment/vnpay_return` ở đuôi.

**Ví dụ cấu hình đúng:**
```env
vnp_ReturnUrl=https://1a2b-3c4d.ngrok-free.dev/payment/vnpay_return
```

> [!WARNING]
> Mỗi lần bạn tắt và bật lại Ngrok (nếu xài bản miễn phí), đường dẫn này sẽ bị đổi. Bạn **BẮT BUỘC** phải copy lại link mới và cập nhật vào file `.env` của backend, sau đó restart lại Backend.

---

## 6. HƯỚNG DẪN KHỞI CHẠY HỆ THỐNG

Sau khi đã hoàn tất các bước cấu hình, chúng ta sẽ chạy đồng thời cả Backend và Frontend.

**Khởi chạy Backend:**
Tại terminal đang ở thư mục `backend/`, chạy lệnh:
```bash
npm run start:dev
```
*Backend sẽ lắng nghe tại `http://localhost:3000`.*

**Khởi chạy Frontend:**
Tại terminal đang ở thư mục `frontend/`, chạy lệnh:
```bash
npm run dev
```
*Frontend sẽ chạy tại `http://localhost:5173`.*

---

## 7. QUY TRÌNH KIỂM THỬ (TESTING FLOW)

Bây giờ bạn đã sẵn sàng trải nghiệm luồng thanh toán:

1. **Truy cập giao diện**: Mở trình duyệt và truy cập vào [http://localhost:5173](http://localhost:5173).
2. **Tạo giao dịch**: Tại màn hình Trang chủ, nhập số tiền muốn thanh toán (Ví dụ: `100000`) và bấm nút **Thanh toán qua VNPAY**.
3. **Thanh toán trên VNPAY Sandbox**:
   - Bạn sẽ được chuyển hướng sang cổng thanh toán của VNPAY.
   - Chọn thanh toán qua **Thẻ ATM và tài khoản ngân hàng** -> Chọn Ngân hàng **NCB**.
   - Sử dụng thẻ test do VNPAY cung cấp để điền vào Form:
     - Số thẻ: `9704198526191432198`
     - Tên chủ thẻ: `NGUYEN VAN A`
     - Ngày phát hành: `07/15`
     - OTP: `123456`
4. **Xem kết quả**: 
   - Sau khi thanh toán xong, VNPAY sẽ redirect bạn về đường dẫn Ngrok (trỏ tới Backend).
   - Backend sẽ tính toán lại chữ ký HMAC SHA-512, đối chiếu xem dữ liệu có bị giả mạo hay không.
   - Cuối cùng, Backend redirect bạn về màn hình **Result Page** của Frontend.
   - Tại đây, bạn sẽ thấy thông báo "Thanh toán thành công" (hoặc thất bại), dòng trạng thái xác thực Chữ ký số, và một bảng (Table) chi tiết liệt kê toàn bộ các tham số giao dịch VNPAY đã trả về.

Chúc bạn thực hành thành công! 🎉
