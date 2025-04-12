# Tiện Ích Mở Rộng Giả Mạo Fingerprint

## Tổng Quan
Dự án này là một tiện ích mở rộng Chrome được thiết kế để giả mạo fingerprint của thiết bị, cho phép người dùng ngụy trang thiết bị của mình thành Android hoặc các thiết bị khác. Tiện ích sử dụng nhiều kỹ thuật khác nhau để thay đổi dữ liệu fingerprint, tăng cường quyền riêng tư và bảo mật khi duyệt web.

## Tính Năng
- **Giả Mạo User-Agent**: Thay đổi chuỗi User-Agent để mô phỏng các thiết bị khác nhau.
- **Giả Mạo Canvas Fingerprinting**: Tạo fingerprint canvas giả để tránh bị phát hiện.
- **Giả Mạo WebGL Fingerprinting**: Giả mạo thông tin renderer WebGL.
- **Giả Mạo Audio Fingerprinting**: Tạo fingerprint âm thanh giả.
- **Giả Mạo Múi Giờ**: Thay đổi múi giờ được báo cáo của thiết bị.
- **Kích Thước Màn Hình và Độ Phân Giải**: Giả mạo kích thước màn hình và mật độ điểm ảnh.
- **Danh Sách Font Cài Đặt**: Mô phỏng danh sách các font đã cài đặt trên thiết bị.

## Cài Đặt
1. Clone repository:
   ```bash
   git clone <repository-url>
   cd fingerprint-spoofing-extension
   ```

2. Cài đặt các dependencies:
   ```bash
   npm install
   ```

3. Cấu hình các biến môi trường trong file `.env` (tùy chọn).

## Sử Dụng
1. Tải tiện ích mở rộng vào Chrome:
   - Truy cập `chrome://extensions/`
   - Bật chế độ "Developer mode"
   - Nhấn "Load unpacked" và chọn thư mục `src`.

2. Tương tác với tiện ích thông qua giao diện popup.

3. Theo dõi script nền (background script) để xem log và sự kiện.

## Phát Triển
- Chỉnh sửa logic giả mạo fingerprint trong file `src/fingerprint.js` để thêm hoặc thay đổi các kỹ thuật giả mạo.
- Cập nhật giao diện popup trong các file `src/popup/popup.html`, `src/popup/popup.css`, và `src/popup/popup.js` khi cần.

## Giấy Phép
Dự án này được cấp phép theo giấy phép MIT.