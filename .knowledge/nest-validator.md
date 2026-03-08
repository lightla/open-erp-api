# NestJS ValidationPipe & Class-Validator (Chi tiết)

Tài liệu này giải thích chi tiết hành vi của NestJS khi cấu hình các Options trong `ValidationPipe`.

## 1. Chi tiết các Options (So sánh True/False)

| Option | Nếu là `TRUE` | Nếu là `FALSE` (Mặc định) |
| :--- | :--- | :--- |
| **`whitelist`** | **Lọc sạch**: Chỉ giữ lại các trường có Decorator (như `@IsString`). Các trường "lạ" (không khai báo) sẽ bị xóa bỏ hoàn toàn khỏi Object Body. | **Thả cửa**: Giữ lại toàn bộ các trường gửi lên, kể cả những trường không được khai báo trong DTO. Điều này có thể gây rủi ro bảo mật (Mass Assignment). |
| **`forbidNonWhitelisted`** | **Chặn đứng**: Nếu phát hiện có trường "lạ" (không có decorator), NestJS sẽ trả về lỗi **400 Bad Request** ngay lập tức thay vì chỉ âm thầm xóa bỏ. | **Âm thầm**: Không báo lỗi. Nếu `whitelist` là true thì nó chỉ âm thầm xóa trường đó đi. |
| **`transform`** | **Tự động ép kiểu**: Nếu DTO khai báo `id: number`, mà Client gửi lên chuỗi `"123"`, NestJS sẽ tự động chuyển nó thành kiểu `number` trước khi đưa vào Controller. | **Giữ nguyên**: Giữ nguyên kiểu dữ liệu của Client gửi lên (thường là string cho tất cả các trường từ URL hoặc JSON). |

### Ví dụ minh họa:
Giả sử DTO chỉ khai báo `@IsString() name`. Client gửi: `{ "name": "A", "address": "B" }`.

- `whitelist: true`: Service nhận được `{ name: "A" }` (address bị mất).
- `whitelist: true` & `forbidNonWhitelisted: true`: Client nhận lỗi **400: "property address should not exist"**.
- `whitelist: false`: Service nhận nguyên vẹn `{ name: "A", "address": "B" }`.

## 2. Pipe được chạy ở đâu? Ai gọi nó?

`ValidationPipe` là một **Middleware đặc biệt** (được gọi là Pipe) trong NestJS. Bạn **không cần gọi nó thủ công** trong code Service hay Controller.

### Cơ chế "Tự động call":
- **App Call**: Khi bạn khai báo `app.useGlobalPipes(...)` trong `main.ts`, bạn đang ra lệnh cho NestJS: *"Mọi request đi vào ứng dụng, hãy đi qua cái phễu lọc này trước khi tới Controller"*.
- **Vị trí**: Nó nằm giữa **Guard** (Bảo vệ/Xác thực) và **Controller** (Xử lý logic).

### Quy trình:
1. Client gửi Request.
2. NestJS nhận Request.
3. NestJS thấy có Global Pipe -> **Tự động gọi `ValidationPipe`**.
4. `ValidationPipe` soi vào DTO của Controller tương ứng.
5. Nếu dữ liệu sai -> Trả về lỗi 400 cho Client (Controller chưa kịp chạy).
6. Nếu dữ liệu đúng -> Đưa dữ liệu đã "sạch" vào Controller.

## 3. Tại sao phải dùng `@IsOptional()`?

Kể cả khi một trường không bắt buộc (dấu `?`), bạn **vẫn phải** gắn `@IsOptional()`. 

**Lý do:** 
NestJS không đọc được dấu `?` của TypeScript ở Runtime. Nó chỉ nhìn thấy các Decorator. Nếu một trường không có Decorator nào, `ValidationPipe` (khi bật `whitelist`) sẽ coi đó là trường không hợp lệ và xóa bỏ nó hoặc báo lỗi.
