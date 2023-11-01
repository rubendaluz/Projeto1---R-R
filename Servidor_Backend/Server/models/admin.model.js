import { INTEGER, STRING, BOOLEAN } from 'sequelize';
import { MultiAcces_DB } from '../config/context/database.js';
const AdminModel = MultiAcces_DB.define("user", {
  id: {
    type: INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  type: {
    type: STRING,
    allowNull: false,
    unique: false,
  },
  password: {
    type: STRING,
    allowNull: false,
    unique: false,
  },
  username: {
    type: STRING,
    allowNull: false,
    unique: true,
  
  },
  permission_level: {
    type: INTEGER,
    allowNull: false,
    unique: true,
  
  },
  
  active: {
    type: BOOLEAN,
    allowNull: true,
  },
});
export { AdminModel };
