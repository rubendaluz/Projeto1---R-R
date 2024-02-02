import { UserModel } from "../models/user.model.js";
import { RoomModel } from '../models/room.model.js';
import { AcessesModel } from "../models/access.model.js";
const axios = require('axios');

import { createToken } from "../utils/jwt.js";
import path from 'path';
import bcrypt from 'bcrypt';
import fs from 'fs';

import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit';

const transporter  = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "aadcda0b95dfd3",
    pass: "f09446adaeee9f"
  }
});

const sendWelcomeEmail = async (user, resetLink) => {
  const emailBody = `
  <html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f4f4; }
      .container { width: 80%; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; background-color: white; }
      .header { text-align: center; background-color: #004d99; color: white; padding: 10px; }
      .content { margin-top: 20px; }
      .footer { margin-top: 40px; font-size: 0.8em; text-align: center; color: #666; }
      .button { background-color: #007bff; color: white; padding: 10px 20px; text-align: center; border-radius: 5px; display: inline-block; text-decoration: none; }
      .user-info { background-color: #f9f9f9; padding: 10px; margin-top: 20px; }
      img { max-width: 100px; margin-bottom: 20px; }
    </style>
  </head>
  <body>
    <div class="container">
    <div class="header">
    <h1>Bem-vindo ao Multi-Acess</h1>
  </div>
  
  <div class="content">
    <p>Olá ${user.firstName} ${user.lastName},</p>
    <p>Seu registro no nosso sistema de controle de acesso e presença multimodal foi criado com sucesso. Abaixo estão os detalhes da sua conta:</p>
    
    <div class="user-info">
      <p><strong>Nome:</strong> ${user.firstName} ${user.lastName}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Telefone:</strong> ${user.phone}</p>
      <!-- Outras informações relevantes do usuário podem ser adicionadas aqui -->
    </div>

    <p>Se algum destes dados estiver incorreto, por favor entre em contato conosco pelo e-mail <a href="mailto:suporte@multacess.pt">suporte@multacess.pt</a>.</p>

    <p>Para ativar sua conta e definir sua senha, por favor clique no link abaixo:</p>
    <p><a href="${resetLink}">Definir Senha</a></p>
    
    <p>Após configurar sua senha, você poderá usar todas as funcionalidades do sistema, incluindo controle de acesso via NFC e impressão digital.</p>
    <p>Baixe nosso aplicativo para gerenciar suas presenças e acessos facilmente:</p>
    <p><a href="LINK_PARA_BAIXAR_APP">Baixar Aplicativo</a></p>
  </div>
  <div class="footer">
    <p>Este é um e-mail automático, por favor não responda.</p>
    <p>Se você tem alguma dúvida ou precisa de suporte, entre em contato conosco.</p>
  </div>
</div>
</body>
    </html>
  `;

await transporter.sendMail({
    from: 'not-reply@multacess.com',
    to: user.email,
    subject: 'Bem-vindo ao Sistema de Controle de Acesso e Presença',
    html: emailBody
  });
};
// Funções Auxiliares
const createResetToken = (userId) => {
  return jwt.sign({ userId }, 'seu', { expiresIn: '1h' });
};



export const changePassword = async (req, res) => {
  const { token, newPassword } = req.body;
console.log("token: ", token);
  try {
      const decoded = jwt.verify(token, 'seu'); // Use o mesmo segredo usado na criação do token
      console.log("decoded: ", decoded);
      const user = await UserModel.findOne({ where: { id: decoded.userId } });

      if (!user) {
          return res.status(404).send('Usuário não encontrado.');
      }
console.log("user: ", user);
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await UserModel.update({ password: hashedPassword }, { where: { id: user.id } });

      res.send('Senha atualizada com sucesso.');
  } catch (error) {
      res.status(500).send('Erro ao mudar a senha.');
  }
};


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

export const login = async (req, res
  ) => {
console.log("req.body: ", req.body);
  const { email, password } = req.body;
  console.log("email: ", email);  
  console.log("password: ", password);
// encriptar a password e comparar com a da base de dados
const hashedPassword = await bcrypt.hash(password, 10);
const user = await UserModel.findOne({
  where: {
    email: email,
    password: hashedPassword,
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

    const hashedPassword = await bcrypt.hash(password, 10);

    // Criação do usuário
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

    // Geração e envio do link temporário para mudança de senha
    const resetToken = createResetToken(user.id);
    const resetLink = `http://${process.env.SERVER_HOST}:5500/Interface_web/HTML/changePWD.html?token=${resetToken}`;
    await sendWelcomeEmail(user, resetLink);
   
    
  

  // Verificar se o upload foi feito
if (req.file) {
  // Se o upload foi feito, execute a lógica de processamento da imagem

  // Update the filename using the username and user ID
  const username = user.firstName.toLowerCase();
  const newFilename = `${username}_${user.id}${path.extname(req.file.originalname)}`;

  // Move the file to the desired directory and update the user's photopath
  const oldPath = `../../Interface_web/img/User/${req.file.filename}`;
  const newPath = `../../Interface_web/img/User/${newFilename}`;
  fs.renameSync(oldPath, newPath);

  // Update the user's photopath in the database
  await user.update({ photopath: newFilename });

} else {
  // Se nenhum upload foi feito, use a imagem padrão
  const defaultImagePath = 'perfil.jpg';
  
  // Atualize o user's photopath com o caminho da imagem padrão
  await user.update({ photopath: defaultImagePath });
}



    
    return res.json({ message: "User created successfully" });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ message: 'Failed to create user', error });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    const { sortOrder } = req.query;

    // Adicione opções de ordenação
    const order = [['firstName', sortOrder || 'ASC']]; // Substitua 'name' pelo nome real da coluna de nome

    const users = await UserModel.findAll({
      order: order,
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
      console.log("req.body: ", req.body.firstName);
      const { firstName, lastName, fingerPrint, nfcTag, email, phone, accessLevel, active } = req.body;
 
      console.log("req.body: ", req.body.Date);
      // Update the user
      console.log("id: ", id);
      console.log("firstName: ", firstName);
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

export const authenticateUserNFC = async (req, res) => {
    try {
      // const { roomId, nfcTag } = JSON.parse(Object.keys(req.body)[0]);
      const { roomId, nfcTag } = req.body;
      console.log('Received data:', req.body);
      
      // Encontrar a sala pelo ID
      const room = await RoomModel.findByPk(roomId);
  
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }
  
      // Encontrar o usuário pelo fingerPrintId
      const user = await UserModel.findOne({ where: { nfcTag } });
      console.log("User: ", user);
  
      // Obter o timestamp atual
      const entryTimestamp = new Date();
  
      // Criar um registro de acesso
      const access = await AcessesModel.create({
        id_user: user ? user.id : null,
        id_area: roomId,
        metodo_auth: 'nfc',
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
      return res.json({authorized: true, name: user.firstName + " " + user.lastName });
    } catch (error) {
      console.error('Error authenticating user:', error);
      return res.status(500).json({ message: 'Failed to authenticate user' });
    }
  };


  const nfcTagRequest = {
    startNfcRead: async (req, res) => {
        try {
            const espResponse = await axios.get('http://ESP32_IP/startRead');
            res.send(espResponse.data);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error communicating with ESP32');
        }
    }
};