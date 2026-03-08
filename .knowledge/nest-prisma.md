# NestJS + Prisma Framework

Tài liệu hướng dẫn cài đặt, cấu hình và sử dụng Prisma trong dự án NestJS.

## 1. Cài đặt ban đầu

Để bắt đầu với Prisma, bạn cần cài đặt CLI (development) và Client (runtime):

```bash
# Cài đặt Prisma CLI (Dev dependency)
npm install prisma --save-dev

# Cài đặt Prisma Client (Runtime dependency)
npm install @prisma/client

# Khởi tạo Prisma trong project (tạo thư mục prisma/)
npx prisma init
```

## 2. Cấu trúc thư mục Prisma

- `prisma/schema.prisma`: File quan trọng nhất, dùng để định nghĩa Database Model.
- `prisma.config.ts` (Prisma 7+): File cấu hình trung tâm cho các tác vụ CLI (như Migrate).
- `.env`: Nơi lưu trữ biến `DATABASE_URL`.

## 3. Các lệnh Prisma quan trọng

| Lệnh | Ý nghĩa | Khi nào dùng? |
| :--- | :--- | :--- |
| `npx prisma generate` | Cập nhật lại các kiểu dữ liệu (Types) cho Prisma Client. | Mỗi khi bạn thay đổi model trong file `schema.prisma`. |
| `npx prisma migrate dev` | Tạo file SQL migration và áp dụng thay đổi vào Database thực tế. | Khi bạn muốn đồng bộ cấu trúc bảng (thêm cột, đổi tên bảng, ...). |
| `npx prisma studio` | Mở giao diện Web (GUI) để xem và sửa dữ liệu trực tiếp. | Khi muốn kiểm tra dữ liệu nhanh mà không cần dùng tool ngoài (DBeaver, TablePlus). |

## 4. Tích hợp vào NestJS (PrismaService)

Để sử dụng Prisma trong NestJS, chúng ta cần tạo một Service kế thừa từ `PrismaClient`.

```typescript
// prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    // Đảm bảo kết nối database ngay khi module khởi chạy
    await this.$connect();
  }
}
```

## 5. Lưu ý quan trọng cho Prisma 7+

Dự án hiện tại đang sử dụng **Prisma 7.4.2**, có một số thay đổi lớn so với bản cũ:

1. **Cấu hình Database URL**: Prisma 7 khuyến khích tách biệt cấu hình. File `schema.prisma` có thể không cần dòng `url = env(...)`.
2. **Cấu hình Migrate**: Lệnh `migrate dev` sẽ đọc URL từ file `prisma.config.ts`.
3. **Cấu hình Runtime**: Trong NestJS, `PrismaService` nên lấy URL từ `ConfigService` để linh hoạt giữa môi trường Docker và Local.

## 6. Mẹo kết nối (WSL & Docker)

- **Khi chạy API từ máy Local (WSL)**: Kết nối tới Database trong Docker qua cổng đã map (ví dụ: `127.0.0.1:5439`).
- **Khi chạy API trong Docker**: Kết nối tới Database qua tên Service (ví dụ: `postgres:5432`).
