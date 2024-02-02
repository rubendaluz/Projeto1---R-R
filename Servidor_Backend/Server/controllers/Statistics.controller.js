// Import the necessary models
import { AdminModel } from '../models/admin.model.js';
import { UserModel } from '../models/user.model.js';
import { RoomModel } from '../models/room.model.js';
import { AcessesModel } from '../models/access.model.js';

// Function to count accesses, administrators, users, and rooms
export const countEntities = async (req, res) => {
  try {
    // Use Sequelize aggregation functions to count records in each table
    const adminsCount = await AdminModel.count();
    const usersCount = await UserModel.count();
    const roomsCount = await RoomModel.count();
    const accessesCount = await AcessesModel.count();

    // Additional statistics based on your requirements
    const allowedAccessesCount = await AcessesModel.count({
      where: { acesso_permitido: true },
    });

    const deniedAccessesCount = await AcessesModel.count({
      where: { acesso_permitido: false },
    });

    const nfcAccessesCount = await AcessesModel.count({
      where: { metodo_auth: 'NFC' },
    });

    const fingerprintAccessesCount = await AcessesModel.count({ 
      where: { metodo_auth: 'FINGER' },
    });



console.log(adminsCount);
console.log(usersCount);
console.log(roomsCount);
console.log(accessesCount);
console.log(allowedAccessesCount);
console.log(deniedAccessesCount);
console.log(nfcAccessesCount);
console.log(fingerprintAccessesCount);
  
    // Return the results as JSON
    return res.json({
      adminsCount,
      usersCount,
      roomsCount,
      accessesCount,
      allowedAccessesCount,
      deniedAccessesCount,
    
      nfcAccessesCount,
      fingerprintAccessesCount,
      

    });
  } catch (error) {
    console.error('Error counting entities:', error);
    return res.status(500).json({ message: 'Failed to count entities' });
  }
};
