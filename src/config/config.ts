import dotenv from "dotenv";
dotenv.config();
export const databaseConfig = {
  development: {
    database: process.env.DB_DEV_NAME,
    username: process.env.DB_DEV_USER,
    password: process.env.DB_DEV_PASS,
    host: "peanut.db.elephantsql.com",
  },
  test: {
    database: process.env.DB_TEST_NAME,
    username: process.env.DB_TEST_USER,
    password: process.env.DB_TEST_PASS,
    host: "peanut.db.elephantsql.com",
  },
  production: {
    database: process.env.DB_PROD_NAME,
    username: process.env.DB_PROD_USER,
    password: process.env.DB_PROD_PASS,
    host: "peanut.db.elephantsql.com",
  },
};
