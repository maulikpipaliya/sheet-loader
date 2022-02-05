import dotenv from "dotenv";

dotenv.config();

export const envConfig = {
  port: process.env.PORT || 5001,
  corsOrigin: process.env.CLIENT_URL,
};
