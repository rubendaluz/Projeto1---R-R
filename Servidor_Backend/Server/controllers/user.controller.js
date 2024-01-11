import { UserModel } from "../models/user.model.js";
import { RoomModel } from '../models/room.model.js';
import { AcessesModel } from "../models/access.model.js";

import { createToken } from "../utils/jwt.js";
import path from 'path';
import bcrypt from 'bcrypt';
import fs from 'fs';


export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    // Delete the user
    await UserModel.destroy({ where: { id } });

    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Failed to delete user" });
  }
};

export const login = async (req, res) => {

  const { email, password } = req.body;
  const user = await UserModel.findOne({
    where: {
      email: email,
      password: password,
    },
    attributes: { exclude: ["password"] },
  });
  if (!user) {
    return res.status(401).json({ message: "User nao existe" });
  }
  const token = createToken({
    id: user.id,
    email: user.email,
    batatas: 2,
  });

  return res.json({
    user,
    token,
  });
};



export const register = async (req, res) => {
  
  try {
    const { firstName, lastName, fingerPrint, nfcTag, email, phone, accessLevel, active, password } = req.body;

    // Verificar se o email já está em uso
    const existingUser = await UserModel.findOne({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    // Hash da senha
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Criação inicial do usuário sem a imagem
    const user = await UserModel.create({
      firstName,
      lastName,
      fingerPrint,
      nfcTag,
      email,
      phone,
      accessLevel,
      active,
      password: hashedPassword,
    });

    // Update the filename using the username and user ID
    const username = user.firstName.toLowerCase();
    const newFilename = `${username}_${user.id}${path.extname(req.file.originalname)}`;

    // Move the file to the desired directory and update the user's photopath
    const oldPath = `../../Interface_web/img/User/${req.file.filename}`;
    const newPath = `../../Interface_web/img/User/${newFilename}`;
    fs.renameSync(oldPath, newPath);

    // Update the user's photopath in the database
    await user.update({ photopath: newFilename });

    return res.json({ message: "User created successfully" });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ message: 'Failed to create user', error });
  }
};


  export const getAllUsers = async (req, res) => {
    try {
      const users = await UserModel.findAll({
        attributes: { exclude: ["fingerPrint", "nfcTag"] }
      });

      return res.json(users);
    } catch (error) {
      console.error("Error retrieving users:", error);
      return res.status(500).json({ message: "Failed to retrieve users" });
    }
  };

  export const updateUser = async (req, res) => {
    try {
      const { id } = req.params;
      const { firstName, lastName, fingerPrint, nfcTag, email, phone, accessLevel, active } = req.body;
      await UserModel.update({ firstName, lastName, fingerPrint, nfcTag, email, phone, accessLevel, active }, { where: { id } });
      return res.json({ message: "User updated successfully" });
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({ message: "Failed to update user" });
    }
  };

  export const getUserProfile = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await UserModel.findByPk(id, {
        attributes: { exclude: ["fingerPrint", "nfcTag"] }
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.json(user);
    } catch (error) {
      console.error("Error retrieving user:", error);
      return res.status(500).json({ message: "Failed to retrieve user" });
    }
  };



  
  
  export const authenticateUser = async (req, res) => {
    try {
    
      const { roomId, fingerPrintId } = JSON.parse(Object.keys(req.body)[0]);
  
      
      // Encontrar a sala pelo ID
      const room = await RoomModel.findByPk(roomId);
  
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }
  
      // Encontrar o usuário pelo fingerPrintId
      const user = await UserModel.findOne({ where: { fingerPrintId } });
      console.log("User: ", user);
  
      // Obter o timestamp atual
      const entryTimestamp = new Date();
  
      // Criar um registro de acesso
      const access = await AcessesModel.create({
        id_user: user ? user.id : null,
        id_area: roomId,
        metodo_auth: 'fingerprint',
        acesso_permitido: user ? user.accessLevel >= room.access_level_required : false,
        data_hora_entrada: entryTimestamp,
      });
  
      // Check authorization status and respond accordingly
      if (!user) {
        return res.status(401).json({ message: 'Unknown' });
      }
  
      if (user.accessLevel < room.access_level_required) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
  
      return res.json({ message: 'Authorized' });
    } catch (error) {
      console.error('Error authenticating user:', error);
      return res.status(500).json({ message: 'Failed to authenticate user' });
    }
  };
  
  
  export const updateUserFingerprint = async (req, res) => {
    try {
      const { userId, fingerPrintId } = JSON.parse(Object.keys(req.body)[0]);
     
      // Encontrar o usuário pelo ID
      const user = await UserModel.findByPk(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Atualizar a impressão digital do usuário
      await user.update({ fingerPrintId });
  
      // Recarregar o usuário para obter os dados atualizados
      const updatedUser = await UserModel.findByPk(userId);
  
      return res.json({
        message: 'User fingerPrintId updated successfully',
        user: updatedUser,
      });
    } catch (error) {
      console.error('Error updating user fingerPrintId:', error);
      return res.status(500).json({ message: 'Failed to update user fingerPrintId' });
    }
  };
  
  
export const updateAllUsersFingerprints = async (req, res) => {
  try {
    // Atualizar a impressão digital de todos os usuários para null
    await UserModel.update({ fingerPrintId: null }, { where: {} });

    return res.json({ message: 'All users fingerPrintId updated to null successfully' });
  } catch (error) {
    console.error('Error updating all users fingerPrintId:', error);
    return res.status(500).json({ message: 'Failed to update all users fingerPrintId' });
  }
};
