import { Op } from "sequelize";
import Tag from "../../models/Tag";
import Ticket from "../../models/Ticket";
import TicketTag from "../../models/TicketTag";

import * as Yup from "yup";
import { logger } from "../../utils/logger";
import AppError from "../../errors/AppError";

interface Request {
  companyId: number;
}

const KanbanListService = async ({
  companyId
}: Request): Promise<Tag[]> => {
  const schema = Yup.object().shape({
    companyId: Yup.number()
      .required("O ID da empresa é obrigatório")
      .positive("O ID da empresa deve ser um número positivo")
      .integer("O ID da empresa deve ser um número inteiro")
  });

  try {
    await schema.validate({ companyId }, { abortEarly: false });
  
    const tags = await Tag.findAll({
      where: {
        kanban: 1,
        companyId: companyId,
      },
      order: [["id", "ASC"]],
      raw: true,
    });

    logger.info(`Tags kanban listadas com sucesso para a empresa ID ${companyId}`)
    
    return tags;
  } catch(err) {
    if (err instanceof Yup.ValidationError) {
      throw new AppError(`Erro de validação: ${err.errors.join(", ")}`, 400);
    } 

    throw new AppError("Erro interno ao listar tags kanban", 500);
  }
};

export default KanbanListService;
