import { AcessesModel } from "../models/access.model.js";
import { Op } from "sequelize";


export const createAccess = async (req, res) => {
  try {
      // Extracting relevant information from the request body
      const { id_area, id_user,  metodo_auth, acesso_permitido } = JSON.parse(Object.keys(req.body)[0]);
    
      // Creating a timestamp for the entry time
      const entryTimestamp = new Date();
      const data_hora_entrada = entryTimestamp;

      // Creating a new access record using Sequelize
      const access = await AcessesModel.create({ id_area, id_user, data_hora_entrada, metodo_auth, acesso_permitido })
      
      // Returning the created access record as a JSON response
      return res.json(access);
  } catch (error) {
      // Handling errors and returning an appropriate response
      console.error("Error registering access:", error);
      return res.status(500).json({ message: "Failed to register access" });
  }
}

export const getAccessesByUser = async (req, res) => {
  try {
    const userId = req.params.userId; // Assumindo que você está passando o ID do utilizador como parâmetro

    const accesses = await AcessesModel.findAll({
      where: { id_user: userId },
    });
    return res.json(accesses);
  } catch (error) {
    console.error("Error fetching accesses by user:", error);
    return res.status(500).json({ message: "Failed to fetch accesses by user" });
  }
};
export const getAllAccesses = async (req, res) => {
    try {
        // Obtenha parâmetros de consulta
        const { userId, date, authenticationMethod, areaId, accessState, sortColumn, sortOrder } = req.query;

        // Construa o objeto de condição com base nos parâmetros de consulta
        const condition = {};

        if (userId) condition.id_user = userId;
        if (date) condition.data_hora_entrada = { [Op.startsWith]: date };
        if (authenticationMethod) condition.metodo_auth = authenticationMethod;
        if (areaId) condition.id_area = areaId;
        if (accessState) condition.acesso_permitido = accessState;

        // Adicione opções de ordenação
        const order = sortColumn ? [[sortColumn, sortOrder || 'ASC']] : [];

        // Consulte o banco de dados com base nos parâmetros de consulta
        const accesses = await AcessesModel.findAll({
            where: condition,
            order: order,
        });

        return res.json(accesses);
    } catch (error) {
        console.error("Error fetching all accesses:", error);
        return res.status(500).json({ message: "Failed to fetch all accesses" });
    }
};

export const getRecentAccesses = async (req, res) => {
  try {
    const recentAccesses = await AcessesModel.findAll({
      order: [['data_hora_entrada', 'DESC']], // Ordena pela coluna 'data_hora_entrada' em ordem decrescente
      limit: 10, // Retorna apenas os 10 últimos registros
    });
    return res.json(recentAccesses);
  } catch (error) {
    console.error("Error fetching recent accesses:", error);
    return res.status(500).json({ message: "Failed to fetch recent accesses" });
  }
};

