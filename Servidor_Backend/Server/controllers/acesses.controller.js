import { AcessesModel } from "../models/access.model.js";
import { Op } from "sequelize";


export const createAccess = async (req, res) => {
    try {
        const { id_area, id_user, data_hora_entrada, metodo_auth, acesso_permitido } = req.body;

        const access = await AcessesModel.create({ id_area, id_user, data_hora_entrada, metodo_auth, acesso_permitido })
        
    return res.json(access);
  } catch (error) {
    console.error("Error registering access:", error);
    return res.status(500).json({ message: "Failed to register access" });
  }
}

export const getAccessesByUser = async (req, res) => {
  try {
    const userId = req.params.userId; // Assumindo que você está passando o ID do usuário como parâmetro

    const accesses = await AcessesModel.findAll({
      where: { id_user: userId },
    });

    return res.json(accesses);
  } catch (error) {
    console.error("Error fetching accesses by user:", error);
    return res.status(500).json({ message: "Failed to fetch accesses by user" });
  }
};

export const getAccessesByDate = async (req, res) => {
  try {
    const date = req.params.date; // Assumindo que você está passando a data como parâmetro

    const accesses = await AcessesModel.findAll({
      where: { data_hora_entrada: { [Op.startsWith]: date } }, // Usando Operador Sequelize para buscar datas que começam com a data fornecida
    });

    return res.json(accesses);
  } catch (error) {
    console.error("Error fetching accesses by date:", error);
    return res.status(500).json({ message: "Failed to fetch accesses by date" });
  }
};

export const getAccessesByHour = async (req, res) => {
  try {
    const hour = req.params.hour; // Assumindo que você está passando a hora como parâmetro

    const accesses = await AcessesModel.findAll({
      where: { data_hora_entrada: { [Op.like]: `%${hour}:%` } }, // Usando Operador Sequelize para buscar horas que contenham a hora fornecida
    });

    return res.json(accesses);
  } catch (error) {
    console.error("Error fetching accesses by hour:", error);
    return res.status(500).json({ message: "Failed to fetch accesses by hour" });
  }
};

export const getAccessesByArea = async (req, res) => {
  try {
    const areaId = req.params.areaId; // Assumindo que você está passando o ID da área como parâmetro

    const accesses = await AcessesModel.findAll({
      where: { id_area: areaId },
    });

    return res.json(accesses);
  } catch (error) {
    console.error("Error fetching accesses by area:", error);
    return res.status(500).json({ message: "Failed to fetch accesses by area" });
  }
};

export const getAllAccesses = async (req, res) => {
  try {
    const accesses = await AcessesModel.findAll();

    return res.json(accesses);
  } catch (error) {
    console.error("Error fetching all accesses:", error);
    return res.status(500).json({ message: "Failed to fetch all accesses" });
  }
};