import { AdminModel } from '../models/admin.model.js';
import bcrypt from 'bcrypt';

export const registerAdmin = async (req, res) => {
  try {
    const { type, password, username, permission_level, active } = req.body;
    const existingAdmin = await AdminModel.findOne({ where: { username } });

    if (existingAdmin) {
      return res.status(409).json({ message: 'Username already exists' });
    }

 const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const admin = await AdminModel.create({ type, password: hashedPassword, username, permission_level, active });

    return res.json(admin);
  } catch (error) {
    console.error('Error creating admin:', error);
    return res.status(500).json({ message: 'Failed to create admin' });
  }
};



export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

const admin = await AdminModel.findOne({ where: { username } });

    if (!admin) {
      return res.status(401).json({ message: 'Admin not found' });
    }

 const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

  const token = createToken({
      id: admin.id,
      username: admin.username,
      permission_level: admin.permission_level,
    });

    return res.json({ admin, token });
  } catch (error) {
    console.error('Error during admin login:', error);
    return res.status(500).json({ message: 'Failed to login' });
  }
};

export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, password, username, permission_level, active } = req.body;
    await AdminModel.update({ type, password, username, permission_level, active }, { where: { id } });
    return res.json({ message: 'Admin updated successfully' });
  } catch (error) {
    console.error('Error updating admin:', error);
    return res.status(500).json({ message: 'Failed to update admin' });
  }
};

export const getAdminProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await AdminModel.findByPk(id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    return res.json(admin);
  } catch (error) {
    console.error('Error retrieving admin:', error);
    return res.status(500).json({ message: 'Failed to retrieve admin' });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // Verifique se o administrador existe
    const admin = await AdminModel.findByPk(id);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

  
    await AdminModel.destroy({ where: { id } });

    return res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin:', error);
    return res.status(500).json({ message: 'Failed to delete admin' });
  }
};