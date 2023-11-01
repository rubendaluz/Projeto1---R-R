import { Router } from 'express';
import {
  createRoom,
  getAllRooms,
  updateRoom,
  getRoomInfo,
  deleteRoom,
} from '../controllers/room.controller.js';

const roomRoutes = Router();

// http://localhost:4242/api/room/
roomRoutes.post('/', createRoom);

//  http://localhost:4242/api/room/
roomRoutes.get('/', getAllRooms);

// http://localhost:4242/api/room/:id
roomRoutes.put('/:id', updateRoom);

// http://localhost:4242/api/room/:id
roomRoutes.get('/:id', getRoomInfo);

// http://localhost:4242/api/room/:id
roomRoutes.delete('/:id', deleteRoom);
export { roomRoutes };
