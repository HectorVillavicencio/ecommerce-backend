export const env = {
  databaseUrl:         process.env.DATABASE_URL         || '',
  jwtSecret:           process.env.JWT_SECRET           || 'dev-secret',
  jwtRefreshSecret:    process.env.JWT_REFRESH_SECRET   || 'dev-refresh-secret',
  jwtExpiresIn:        process.env.JWT_EXPIRES_IN       || '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  port:                Number(process.env.PORT)         || 3000,
  frontendUrl:         process.env.FRONTEND_URL         || 'http://localhost:4200',
};
