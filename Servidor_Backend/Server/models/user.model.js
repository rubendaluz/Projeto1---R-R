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
  fingerPrintId: {
    type: INTEGER,
    allowNull: true,
    unique: true,
  },
  nfcTag: {
    type: STRING,
    allowNull: true,
    unique: false,
  },
  email: {
    type: STRING,
    allowNull: false,
    unique: false,
  },
  photopath: {
    type: STRING,
    allowNull: true,
    unique: false,
  },
  phone: {
    type: INTEGER,
    allowNull: true,
    unique: false,
  },
  lastName: {
    type: STRING,
    allowNull: false,
    unique: false,
  },
  accessLevel: {
    type: INTEGER,
    allowNull: false,
    unique: false,
  },
  active: {
    type: BOOLEAN,
    allowNull: true,
    unique: false,

  },
  password: {
    type: STRING,
    allowNull: false,
    unique: false,
  }
});
export { UserModel };
