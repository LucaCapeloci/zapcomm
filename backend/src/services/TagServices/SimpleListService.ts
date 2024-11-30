import { Op, Sequelize } from "sequelize";
import Tag from "../../models/Tag";
import Ticket from "../../models/Ticket";
import TicketTag from "../../models/TicketTag";

import * as Yup from "yup";
import { logger } from "../../utils/logger";
import AppError from "../../errors/AppError";

interface Request {
  companyId: number;
  searchParam?: string;
}

const ListService = async ({
  companyId,
  searchParam
}: Request): Promise<Tag[]> => {
  const schema = Yup.object().shape({
    companyId: Yup.number()
      .required("O ID da empresa é obrigatório")
      .positive("O ID da empresa deve ser um número positivo")
      .integer("O ID da empresa deve ser um número inteiro"),
    searchParam: Yup.string()
      .optional()
      .max(255, "O parâmetro de busca deve ter no máximo 255 caracteres")
  });

  try {
    await schema.validate({ companyId, searchParam }, { abortEarly: false });
    
    let whereCondition = {};

    if (searchParam) {
      whereCondition = {
        [Op.or]: [
          { name: { [Op.like]: `%${searchParam}%` } },
          { color: { [Op.like]: `%${searchParam}%` } }
        ]
      };
    }

    const tags = await Tag.findAll({
      where: { ...whereCondition, companyId },
      order: [["name", "ASC"]]
    });

    logger.info(`Tags listadas com sucesso para a empresa ID ${companyId}`);

    return tags;
  } catch (err) {
    if (err instanceof Yup.ValidationError) {
      throw new AppError(`Erro de validação: ${err.errors.join(", ")}`, 400);
    }

    throw new AppError(`Erro interno ao listar tags`, 500);
  }
};

export default ListService;
