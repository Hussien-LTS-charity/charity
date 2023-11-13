import dotenv from "dotenv";
dotenv.config();
export const databaseConfig = {
  development: {
    database: "ynnbevvc",
    username: "ynnbevvc",
    password: "sYVxsUAck-Ik1uvNl6GY6e6r98FPdTdF",
    host: "peanut.db.elephantsql.com",
  },
  test: {
    database: "acgnczas",
    username: "acgnczas",
    password: "ouBWh79Wadgxj0Tlyc8KftOTqkBHt2yJ",
    host: "peanut.db.elephantsql.com",
  },
  production: {
    database: "zlyachnp",
    username: "zlyachnp",
    password: "U2Jk9BFL6R67b0ir4NKXZ6gREeRoqkiw",
    host: "peanut.db.elephantsql.com",
  },
};
