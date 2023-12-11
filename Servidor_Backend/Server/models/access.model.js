import { INTEGER, STRING, BOOLEAN, DATE } from "sequelize";
import { MultiAcces_DB } from "../config/context/database.js";

const AcessesModel = MultiAcces_DB.define('Acessos', {
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_area: {
    type: INTEGER,
    allowNull: false,
  },
  id_user: {
    type: INTEGER,
    allowNull: false,
  },
  data_hora_entrada: {
    type: DATE,
    allowNull: false,
    },
  metodo_auth: {
    type: STRING,
    allowNull: false,
    },
    acesso_permitido: {
        type: BOOLEAN,
        allowNull: false,
  }
});



export { AcessesModel };
