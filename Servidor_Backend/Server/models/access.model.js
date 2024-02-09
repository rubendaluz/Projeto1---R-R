import { INTEGER, STRING, BOOLEAN, DATE } from "sequelize";
import { MultiAcces_DB } from "../config/context/database.js";
import { UserModel } from "./user.model.js";
import { RoomModel } from "./room.model.js";

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
    allowNull: true,
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

// Establish foreign key relationships
AcessesModel.belongsTo(UserModel, { foreignKey: 'id_user', onDelete: 'CASCADE' });
AcessesModel.belongsTo(RoomModel, { foreignKey: 'id_area', onDelete: 'CASCADE' });

export { AcessesModel };
