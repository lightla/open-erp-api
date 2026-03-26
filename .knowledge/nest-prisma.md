# NestJS + Prisma Framework

Tài liệu hướng dẫn cài đặt, cấu hình và sử dụng Prisma trong dự án NestJS.

## 0. Prisma Cheat Sheet Cho Repo Này

Nếu bạn bị lú không nhớ lệnh nào chạy lúc nào, cứ bám flow này:

### Trường hợp 1: Bạn vừa sửa `prisma/schema.prisma`

Ví dụ:
- thêm model mới
- thêm field mới
- đổi quan hệ giữa các bảng

Thì chạy:

```bash
pnpm prisma migrate dev --name ten_thay_doi
```

Lệnh này sẽ:
- tạo migration SQL mới trong `prisma/migrations`
- áp dụng migration vào database local
- cập nhật Prisma Client

Ví dụ:

```bash
pnpm prisma migrate dev --name add_user_model
```

### Trường hợp 2: Bạn chỉ muốn cập nhật Prisma Client sau khi đổi schema

```bash
pnpm prisma generate
```

Dùng khi:
- muốn regenerate types/client
- chưa cần tạo migration ngay

Nhưng trong dự án thực tế, nếu schema đổi thật thì thường bạn sẽ dùng `migrate dev`, vì nó làm luôn cả migration + generate.

### Trường hợp 3: Bạn muốn tạo data mẫu

Repo này đã có seed user:

```bash
pnpm db:seed
```

Lệnh này sẽ chạy file:

```bash
prisma/seed.js
```

Mặc định sẽ tạo hoặc cập nhật user:
- email: `admin@example.com`
- password: `12345678`

### Trường hợp 4: Bạn muốn đổi email/password user seed

```bash
SEED_USER_EMAIL=you@example.com SEED_USER_PASSWORD=yourpassword pnpm db:seed
```

### Trường hợp 5: Bạn muốn xem dữ liệu trực tiếp trong DB

```bash
pnpm prisma studio
```

Rất hữu ích khi:
- muốn xem user đã được seed chưa
- muốn kiểm tra bảng `User`, `Customer`, `Order`

### Trường hợp 6: Team khác đã có migration mới, bạn chỉ cần kéo về và áp vào DB

```bash
pnpm prisma migrate deploy
```

Thường dùng cho:
- staging
- production
- môi trường shared

Không dùng `migrate dev` ở production.

## 0.1. Tóm tắt siêu ngắn

- sửa `schema.prisma` xong: `pnpm prisma migrate dev --name ten_migration`
- chỉ muốn regenerate Prisma Client: `pnpm prisma generate`
- muốn seed user test: `pnpm db:seed`
- muốn xem dữ liệu DB: `pnpm prisma studio`
- deploy migration lên server: `pnpm prisma migrate deploy`

## 0.2. Flow làm việc khuyến nghị

Khi bạn thêm bảng/cột mới:

1. sửa `prisma/schema.prisma`
2. chạy:

```bash
pnpm prisma migrate dev --name mo_ta_thay_doi
```

3. nếu cần data mẫu thì chạy:

```bash
pnpm db:seed
```

4. chạy lại API:

```bash
pnpm start:dev
```

## 0.3. Ví dụ thực tế

Ví dụ bạn thêm field `phone` vào `User`:

1. sửa `prisma/schema.prisma`
2. chạy:

```bash
pnpm prisma migrate dev --name add_phone_to_user
```

3. nếu seed cần cập nhật thêm field thì sửa `prisma/seed.js`
4. chạy lại:

```bash
pnpm db:seed
```

## 0.4. Khi nào KHÔNG cần chạy migrate?

Bạn không cần chạy `migrate dev` nếu:
- chỉ sửa code service/controller
- chỉ sửa DTO
- chỉ sửa logic NestJS
- không đụng gì đến `prisma/schema.prisma`

Trong case đó, chỉ cần chạy lại app.

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
| `npx prisma migrate deploy` | Áp dụng các migration đã có vào database. | Dùng ở môi trường deploy/staging/production. |
| `npm run db:seed` | Chạy seed data mẫu cho database. | Khi muốn tạo user test hoặc dữ liệu khởi tạo. |
| `npx prisma studio` | Mở giao diện Web (GUI) để xem và sửa dữ liệu trực tiếp. | Khi muốn kiểm tra dữ liệu nhanh mà không cần dùng tool ngoài (DBeaver, TablePlus). |

## 3.1. Seed trong repo hiện tại

Repo này có file:

- `prisma/seed.js`

Lệnh chạy:

```bash
pnpm db:seed
```

Seed hiện tại tạo user test bằng `upsert`, nên chạy nhiều lần cũng không bị trùng.

Mặc định:

- email: `admin@example.com`
- password: `12345678`

Bạn có thể override bằng env:

```bash
SEED_USER_EMAIL=hello@example.com SEED_USER_PASSWORD=12345678 pnpm db:seed
```

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

## 7. Mẹo để đỡ quên lệnh

Bạn có thể nhớ ngắn gọn như này:

- đổi cấu trúc DB => `migrate dev`
- chỉ cập nhật Prisma Client => `generate`
- cần dữ liệu mẫu => `db:seed`
- xem dữ liệu trực tiếp => `prisma studio`
- đưa migration đã có lên server => `migrate deploy`
