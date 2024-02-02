import { UserModel } from "../models/user.model.js";
import { RoomModel } from '../models/room.model.js';
import { AcessesModel } from "../models/access.model.js";
 // npm install googleapis
import { google } from 'googleapis';
import { createToken } from "../utils/jwt.js";
import path from 'path';
import bcrypt from 'bcrypt';
import fs from 'fs';

import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit';

/*
var transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "e7652be716bf2b",
    pass: "6d6f20f0a792f3"
  }
});
*/


const REDIRECT_URI = "https://developers.google.com/oauthplayground"; 


const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  REDIRECT_URI
);






const ACCESS_TOKEN ="ya29.a0AfB_byCEXU5akS94IVYHXk2LSjFp7dcq7tApTv9RIORPFMhZWpfc1JT_eUyBT4FaYKvTSQhc-7aIVxGZda6B2YNGN1Geq6kTSSoX-borvCtTkAYgbd7TMzuXTB6jbaltnyJYWOwddb_OIuwS7iuXoohRtxNZvHS-23TtaCgYKAbESARASFQHGX2Mi-nGD7vyTh8tyWztQkN4B4A0171"
 const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
    accessToken:  ACCESS_TOKEN,
  },
  tls: {
    rejectUnauthorized: true,
  },
}); 


const sendWelcomeEmail = async (user, resetLink) => {
  const emailBody = `
    <html>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css" integrity="sha512-6A9+uyZsOJjbk6I1vtrL00xnt7fA+rB/bvmBHtwZx6vrkdK7EGdVmFt34PMsTtxwa4vBCmcwyBUuN5blFOeC29A==" crossorigin="anonymous" />
        <style>
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            background-color: #f4f4f4;
          }

          .container {
            width: 80%;
            margin: 20px auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
            background-color: white;
          }

          .header {
            text-align: center;
            background-color: #004d99;
            color: white;
            padding: 20px;
            border-radius: 5px 5px 0 0;
          }

          .content {
            margin-top: 20px;
          }

          .footer {
            margin-top: 40px;
            font-size: 0.8em;
            text-align: center;
            color: #666;
          }

          .button {
            color: white;
            text-color: white;
            padding: 15px 30px;
            text-align: center;
            border-radius: 5px;
            display: inline-block;
            text-decoration: none;
            margin-top: 20px;
            transition: background-color 0.3s ease;
            cursor: pointer;
          }

          .button i {
            margin-right: 10px;
          }

          .button a {
            color: white;
            text-decoration: none;
          }

          .reset-password-button {
            background-color: #ff0000;
          }

          .reset-password-button:hover {
            background-color: #a52a35;
          }

          .download-app-button {
            background-color: #004d99;
          }

          .download-app-button:hover {
            background-color: #0056b3;
          }

          .user-info {
            background-color: #f9f9f9;
            padding: 20px;
            margin-top: 20px;
            border-radius: 5px;
          }

          img {
            max-width: 100px;
            margin-bottom: 20px;
          }

          .icon {
            margin-right: 10px;
          }
        </style>
      </head>

      <body>
        <div class="container">
          <div class="header">
            <h1><i class="fas fa-shield-alt icon"></i>Bem-vindo ao Multi-Acess</h1>
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
            <p><a class="button reset-password-button" href="${resetLink}"><i class="fas fa-lock icon"></i>Redefinir Senha</a></p>
            <p>Se clicar em Repor palavra-passe não funcionar, copie e cole esta ligação no seu browser: ${resetLink}</p>

            <p>Após configurar sua senha, você poderá usar todas as funcionalidades do sistema, incluindo controle de acesso via NFC e impressão digital.</p>
            
            <p>Baixe nosso aplicativo para gerenciar suas presenças e acessos facilmente:</p>
            <p><a class="button download-app-button" href="LINK_PARA_BAIXAR_APP"><i class="fas fa-cloud-download-alt icon"></i>Baixar Aplicativo</a></p>
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



const createResetToken = (userId) => {
  return jwt.sign({ userId }, 'seu', { expiresIn: '1h' });
};



export const changePassword = async (req, res) => {
  const { token, newPassword } = req.body;
  console.log("newPsasword: ",  newPassword);
  
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
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("email: ", email);
  console.log("password: ", password);  
  console.log("hashedPassword: ", hashedPassword);
  




  const user = await UserModel.findOne({ where: { email } });

  if (!user) {
    return res.status(401).json({ message: 'Admin not found' });
  }

  
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({ message: 'Invalid password' });
  }


  const token = createToken({
    id: user.id,
    email: user.email,
    batatas: 2,
  });

  //excluir password do user
  user.password = undefined;
  return res.json({ user, token });
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
    const resetLink = `http://${process.env.SERVER_HOST}:5501/Interface_web/HTML/changePWD.html?token=${resetToken}`;
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



// return just user info esclude password
    return res.json({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        fingerPrint: user.fingerPrint,
        nfcTag: user.nfcTag,
        email: user.email,
        phone: user.phone,
        accessLevel: user.accessLevel,
        active: user.active,
        photopath: user.photopath,
     
    });

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
      attributes: { exclude: ["password"] },
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
      metodo_auth: 'FINGER',
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

    console.log("userId: ", userId);
    console.log("fingerPrintId: ", fingerPrintId);

    // Encontrar o usuário pelo ID
    const user = await UserModel.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if fingerPrintId is less than zero, and set it to null
    const updatedFingerPrintId = fingerPrintId < 0 ? null : fingerPrintId;

    // Atualizar a impressão digital do usuário
    await user.update({ fingerPrintId: updatedFingerPrintId });

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
      metodo_auth: 'NFC',
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
    return res.json({ authorized: true, name: user.firstName + " " + user.lastName });
  } catch (error) {
    console.error('Error authenticating user:', error);
    return res.status(500).json({ message: 'Failed to authenticate user' });
  }
};