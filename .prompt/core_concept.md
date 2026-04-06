# Core Concept: Kiến Trúc Tách Biệt Phân Cấp (Decoupled Frontend & Backend Architecture)

## 📌 1. Triết Lý Cốt Lõi (Core Philosophy)
Hệ thống Frontend (FE) và Backend (BE) là **hai thực thể độc lập hoàn toàn**. 
Sự phát triển của FE **không bao giờ** bị đóng băng hay phụ thuộc vào tiến độ của BE. FE được thiết kế để có khả năng sinh tồn và hoạt động trơn tru ngay cả khi hệ thống BE chưa được xây dựng hoặc đang trong quá trình bảo trì.

## 🎯 2. Mục Tiêu Ý Tưởng
- **Phát triển song song (Parallel Development):** FE Team và BE Team có thể bắt tay vào làm việc ngay lập tức với tốc độ của riêng mình.
- **Zero Blocker:** FE không bao giờ phải đợi "BE làm xong API rồi mới làm tiếp được".
- **Plug and Play:** Việc chuyển đổi từ "Dữ liệu giả" sang "API thật" diễn ra cực kỳ mượt mà, không yêu cầu tái cấu trúc (refactoring) ở tầng giao diện của FE.

## 🏗️ 3. Cơ Chế Hoạt Động (Architecture Flow)

### 3.1. Frontend Không Biết Backend Tồn Tại (Agnostic Frontend)
- Ở tầng UI Component, FE **hoàn toàn mù tịt** về khái niệm như: base_url, endpoint, request data type API hay RESTful. 
- FE chỉ biết duy nhất một nguyên tắc: "Tôi gọi hàm `getData()` và tôi chắc chắn sẽ nhận lại dữ liệu theo đúng cấu trúc (interface) đã thoả thuận".

### 3.2. Lớp Trung Gian: Data Mapper (Adapter Pattern)
Đây là "bộ não" giao tiếp của hệ thống. Thay vì các Component FE gọi thẳng HTTP Request bằng `fetch` hay `axios`, mọi yêu cầu sẽ đi qua một lớp gọi là **Mapper**.
- **Vai trò:** Nhận yêu cầu từ FE Component. Định tuyến nơi nó nên lấy dữ liệu (từ API thật hay từ Mock Data).
- Sau khi lấy được dữ liệu, Mapper chịu trách nhiệm "chuẩn hoá" (parse) cấu trúc data từ phía nguổn để trả chuẩn về kiểu mà FE đang cần.

### 3.3. Tích Hợp System Hook (Seed Data)
Bên trong Mapper, chúng ta sẽ thiết kế một hệ thống **Hook / Switcher**.
- **Khi BE Chưa Sẵn Sàng (API Unavailable):**
  - Mapper sẽ điều chuyển mọi request sang **Seed Hook**.
  - Lúc này, Data Hook sẽ mô phỏng lại hành vi của Backend hoàn toàn 100% bằng cách can thiệp vào bộ nhớ trình duyệt (**như Local Storage hoặc IndexedDB**).
  - Mọi thao tác CRUD (Tạo, Đọc, Cập nhật, Xoá) của người dùng sẽ thao tác trực tiếp lên file JSON/bộ nhớ ảo này, cho cảm giác như đang dùng một web_app hoàn thiện với Backend thực sự.

- **Khi BE Đã Sẵn Sàng (API Ready):**
  - Chỉ việc thay đổi cấu hình tại **Mapper**, trỏ Data Fetch từ *Seed Hook* sang *API Services*. Toàn bộ hệ thống UI Component trên FE không cần sửa bất cứ một dòng logic nào.

## 🔄 4. Luồng Dữ Liệu Tóm Tắt (Data Flow)

### Kịch Bản 1: Giai Đoạn Dev (BE chưa có API)
1. User nhấn "Lưu Sản Phẩm".
2. **FE Component** gọi -> `ProductMapper.saveProduct(payload)`.
3. **Mapper** nhận định BE chưa sẵn sàng, gọi -> **Hook SeedData**.
4. **Hook SeedData** format dữ liệu và lưu vào `Window.LocalStorage`.
5. Trả kết quả `Success` ngược về **Mapper** -> báo lại cho **FE hiển thị thông báo thành công**.

### Kịch Bản 2: Giai Đoạn Tích Hợp (BE đã lên API)
1. User nhấn "Lưu Sản Phẩm".
2. **FE Component** gọi -> `ProductMapper.saveProduct(payload)` *(Chỗ này giống hệt Kịch bản 1)*.
3. **Mapper** gọi -> `Axios.post(API_ENDPOINT)`.
4. Nhận Data từ DB Backend -> **Mapper format lại chuẩn** -> Trả về **FE**.

## 🚀 5. Lợi Ích Trực Tiếp Ngay Ngắn Hạn & Dài Hạn
- **Kiểm thử logic tối đa:** Dev FE tự do test mọi trường hợp lỗi (Error 500, Delay API chậm, Timeout) ngay trên Local Storage mà không cần nhờ BE giả lập.
- **Demo cho Khách Hàng (Client) sớm:** Mang sản phẩm đi demo trực tiếp với độ mượt 100% khi chỉ cần mang theo mỗi Code Frontend mà không phải cài cắm Database lằng nhằng.
- **Tiền đề Offline-First App:** Dễ dàng triển khai PWA (Progressive Web App) hoạt động offline khi mất mạng ở tương lai vì Mapper đã xử lý được Local Database.
