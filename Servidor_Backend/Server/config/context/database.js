import Sequelize from "sequelize";

const MultiAcces_DB = new Sequelize({
  host: "localhost",
  port: 3306,
  username: "rubenluz",
  password: "123",
  database: "multiacces",
  dialect: "mysql",
});


export { MultiAcces_DB };
