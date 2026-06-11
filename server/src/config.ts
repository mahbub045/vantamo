export const config = {
  port: Number(process.env.PORT) || 3001,
  jwtSecret: process.env.JWT_SECRET || 'vantamo-dev-secret-change-in-production',
  jwtExpiresIn: '7d',
  database: {
    path: process.env.DB_PATH || './data/vantamo.db'
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173'
  }
};
