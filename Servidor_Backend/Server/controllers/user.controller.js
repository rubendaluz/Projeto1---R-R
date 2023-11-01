import { UserModel } from "../models/user.model.js";
import { createToken } from "../utils/jwt.js";


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
    const { firstName, lastName, fingerPrint, nfcTag,  email, phone ,accessLevel, active  } = req.body;

    const existingUser = await UserModel.findOne({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const user = await UserModel.create({  firstName, lastName, fingerPrint, nfcTag,  email, phone, accessLevel, active });

    return res.json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Failed to create user" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.findAll({
      attributes: { exclude: [ "fingerPrint", "nfcTag"] }});

    return res.json(users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    return res.status(500).json({ message: "Failed to retrieve users" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, fingerPrint, nfcTag,  email, phone, accessLevel, active } = req.body;
    await UserModel.update({ firstName, lastName, fingerPrint, nfcTag,  email, phone, accessLevel, active }, { where: { id } });
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
      attributes: { exclude: [ "fingerPrint", "nfcTag"] }  });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    console.error("Error retrieving user:", error);
    return res.status(500).json({ message: "Failed to retrieve user" });
  }
};
