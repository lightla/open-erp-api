Phase 1: Setup (Packages + Schema)
✅ Cài packages: @nestjs/jwt, @nestjs/passport, passport-*, bcryptjs
✅ Update Prisma schema (thêm User model với googleId, facebookId, email, password, refreshToken)
✅ Run prisma migrate


Phase 2: Auth Module Core
✅ Create auth/ folder + auth.module.ts
✅ Create auth.service.ts (generate tokens, validate)
✅ Create constants.ts (JWT secret, expiry)
Phase 3: Passport Strategies
✅ Create strategies/jwt.strategy.ts
✅ Create strategies/local.strategy.ts (email+password)
✅ Create strategies/google.strategy.ts
✅ Create strategies/facebook.strategy.ts
Phase 4: Guards & Decorators
✅ Create guards/jwt.guard.ts
✅ Create guards/local.guard.ts
✅ Create decorators/current-user.decorator.ts
Phase 5: API Layer
✅ Create auth.resolver.ts (login, logout, refresh)
✅ Update user.module.ts (import auth.module)
✅ Create DTOs (LoginInput, RegisterInput, etc)
Phase 6: User Updates
✅ Update user.service.ts (tạo user, find by email, etc)
