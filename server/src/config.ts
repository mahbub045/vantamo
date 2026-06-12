export const config = {
  port: Number(process.env.PORT),
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: '7d',
  database: {
    path: process.env.DB_PATH,
  },
  cors: {
    origin: process.env.CORS_ORIGIN,
  },
};
