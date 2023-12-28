// Importe os modelos necessários
import { AdminModel } from '../models/admin.model.js';
import { UserModel } from '../models/user.model.js';
import { RoomModel } from '../models/room.model.js';

// Função para contar acessos, administradores, usuários e salas
export const countEntities = async (req, res) => {
  try {
    // Use métodos de contagem do Sequelize para contar registros em cada tabela
    const adminsCount = await AdminModel.count();
    const usersCount = await UserModel.count();
    const roomsCount = await RoomModel.count();

    // Retorne os resultados como JSON
    return res.json({
      adminsCount,
      usersCount,
      roomsCount,
    });
  } catch (error) {
    console.error('Error counting entities:', error);
    return res.status(500).json({ message: 'Failed to count entities' });
  }
};
