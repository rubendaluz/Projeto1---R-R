import { INTEGER, STRING, BOOLEAN } from 'sequelize';
import { MultiAcces_DB } from '../config/context/database.js';
const UserModel = MultiAcces_DB.define("user", {
  id: {
    type: INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  firstName: {
    type: STRING,
    allowNull: false,
    unique: false,
  },
  lastName: {
    type: STRING,
    allowNull: false,
    unique: false,
  },
  fingerPrint: {
    type: STRING,
    allowNull: true,
    unique: true,
  },
  nfcTag: {
    type: STRING,
    allowNull: true,
    unique: true,
  },
  email: {
    type: STRING,
    allowNull: false,
    unique: true,
  
  },
  phone: {
    type: INTEGER,
    allowNull: false,
    unique: true,
  
  },
  accessLevel: {
    type: INTEGER,
    allowNull: false,
    unique: true,
  
  },
  
  active: {
    type: BOOLEAN,
    allowNull: true,
  },
});
export { UserModel };
