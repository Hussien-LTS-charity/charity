import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  database: "charity",
  username: "asura",
  password: "0000",
  host: "localhost",
  port: 5432,
  dialect: "postgres",
});

export default sequelize;
