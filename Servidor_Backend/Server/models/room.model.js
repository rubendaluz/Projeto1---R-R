import { INTEGER, STRING } from 'sequelize';
import { MultiAcces_DB } from '../config/context/database.js';

const RoomModel = MultiAcces_DB.define('rooms', {
  id: {
    type: INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  roomName: {
    type: STRING,
    allowNull: false,
    unique: true,
  },
  access_level_required: {
    type: INTEGER,
    allowNull: false,
  },
  description: {
    type: STRING,
    allowNull: true,
  },
});

export { RoomModel };
