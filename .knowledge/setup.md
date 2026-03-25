# 🛠 Hướng dẫn Setup dự án Open ERP - API (NestJS)

## Yêu cầu hệ thống
- Node.js >= 20 (Khuyên dùng v22 LTS)
- pnpm (Quản lý package)
- fnm (Quản lý Node version)
- Docker & Docker Compose

## Các bước Setup

### 1. Cài đặt Node version
```bash
fnm install 22
fnm use 22
```
Hoặc tạo file `.node-version` trong thư mục dự án để fnm tự chuyển version.

### 2. Cài đặt dependencies
```bash
pnpm install
```
⚠️ Dùng `pnpm`, KHÔNG dùng `npm i`.
Nếu lỡ chạy `npm i`, xóa `node_modules` và `package-lock.json` rồi chạy lại `pnpm install`.

### 3. Tạo file .env
Copy file `.env.example` và thêm biến `DATABASE_URL`:
```bash
cp .env.example .env
```

File `.env` cần có các biến sau:
```env
APP_PORT=3002
APP_HOST=http://localhost
POSTGRES_PORT=5439
DATABASE_URL=postgresql://postgres:open_erp@localhost:5439/open_erp?schema=public
```

⚠️ `DATABASE_URL` là **BẮT BUỘC**, thiếu biến này sẽ gây lỗi:
`Error: SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string`

### 4. Khởi động Database (Docker)
```bash
pnpm docker up -d
```
Lệnh này sẽ chạy PostgreSQL trong Docker container, 
sử dụng port từ biến `POSTGRES_PORT` trong file `.env` (mặc định 5439).

⚠️ Nếu đổi `POSTGRES_PASSWORD` trong `docker-compose.yml`, 
phải xóa volume cũ trước rồi tạo lại:
```bash
pnpm docker down -v
pnpm docker up -d
```

### 5. Generate Prisma Client
```bash
pnpm prisma generate
```
⚠️ Chạy lệnh này mỗi khi:
- Cài lại `node_modules` (sau `pnpm install`)
- Thay đổi file `prisma/schema.prisma`

### 6. Đẩy Schema lên Database
```bash
pnpm prisma db push
```
Lệnh này tạo các bảng trong DB theo schema đã định nghĩa.

### 7. Chạy ứng dụng
```bash
pnpm start:dev
```
API sẽ chạy tại: `http://localhost:3002/api`
Swagger UI tại: `http://localhost:3002/api`

---

## Thứ tự chạy khi clone project mới

```bash
# 1. Cài dependencies
pnpm install

# 2. Tạo file .env (nhớ thêm DATABASE_URL!)
cp .env.example .env

# 3. Chạy Docker DB
pnpm docker up -d

# 4. Generate Prisma Client
pnpm prisma generate

# 5. Tạo bảng trong DB
pnpm prisma db push

# 6. Chạy app
pnpm start:dev
```

---

## Lưu ý quan trọng

### Prisma v7
- File `schema.prisma` KHÔNG dùng trường `url` trong `datasource` nữa.
- URL kết nối DB được cấu hình trong file `prisma.config.ts`.
- Chi tiết: https://pris.ly/d/config-datasource

### Docker Compose
- File `docker-compose.yml` nằm trong thư mục `docker/`.
- Script `pnpm docker` đã cấu hình sẵn `--env-file .env` và `-f docker/docker-compose.yml`.
- Cú pháp biến môi trường trong docker-compose: `${VAR:-default}` (phải có dấu `-`).

### Package Manager
- Dự án dùng `pnpm`, KHÔNG dùng `npm` hay `yarn`.
- Chạy script: `pnpm <tên-script>` (không cần `run`).
- Chạy CLI tool: `pnpm <tên-tool>` (ví dụ: `pnpm nest g res users`).