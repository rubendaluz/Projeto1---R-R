import Sequelize from "sequelize";

const MultiAcces_DB = new Sequelize("MultiAcces", "root", "", {
  host: "localhost",
  port: 3306,
  dialect: "mysql",
});


export { MultiAcces_DB };
