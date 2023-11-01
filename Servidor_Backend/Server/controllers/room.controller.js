import { RoomModel } from '../models/room.model.js';

export const createRoom = async (req, res) => {
  try {
    const { roomName, access_level_required, description } = req.body;
    const room = await RoomModel.create({ roomName, access_level_required, description });
    return res.json(room);
  } catch (error) {
    console.error('Error creating room:', error);
    return res.status(500).json({ message: 'Failed to create room' });
  }
};

export const getAllRooms = async (req, res) => {
  try {
    const rooms = await RoomModel.findAll();
    return res.json(rooms);
  } catch (error) {
    console.error('Error retrieving rooms:', error);
    return res.status(500).json({ message: 'Failed to retrieve rooms' });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { roomName, access_level_required, description } = req.body;
    await RoomModel.update({ roomName, access_level_required, description }, { where: { id } });
    return res.json({ message: 'Room updated successfully' });
  } catch (error) {
    console.error('Error updating room:', error);
    return res.status(500).json({ message: 'Failed to update room' });
  }
};

export const getRoomInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await RoomModel.findByPk(id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    return res.json(room);
  } catch (error) {
    console.error('Error retrieving room:', error);
    return res.status(500).json({ message: 'Failed to retrieve room' });
  }
};


export const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;

    // Verifique se a sala existe
    const room = await RoomModel.findByPk(id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }


    await RoomModel.destroy({ where: { id } });

    return res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Error deleting room:', error);
    return res.status(500).json({ message: 'Failed to delete room' });
  }
};