export const AUTH_CONSTANTS = {
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-env',
  jwtRefreshSecret:
    process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-env',
  accessTokenExpiry: '15m',
  refreshTokenExpiry: '7d',
} as const
