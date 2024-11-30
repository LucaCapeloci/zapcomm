import { Op, literal, fn, col } from "sequelize";
import Tag from "../../models/Tag";
import Ticket from "../../models/Ticket";
import TicketTag from "../../models/TicketTag";

import * as Yup from "yup";
import { logger } from "../../utils/logger";
import AppError from "../../errors/AppError";

interface Request {
  companyId: number;
  searchParam?: string;
  pageNumber?: string | number;
}

interface Response {
  tags: Tag[];
  count: number;
  hasMore: boolean;
}

const ListService = async ({
  companyId,
  searchParam,
  pageNumber = "1"
}: Request): Promise<Response> => {
  const schema = Yup.object().shape({
    companyId: Yup.number()
      .required("O ID da empresa é obrigatório")
      .positive("O ID da empresa deve ser um número positivo")
      .integer("O ID da empresa deve ser um número inteiro"),
    searchParam: Yup.string()
      .optional()
      .max(255, "O parâmetro de busca deve ter no máximo 255 caracteres"),
    pageNumber: Yup.number()
      .optional()
      .positive("O número da página deve ser um valor positivo")
      .integer("O número da página deve ser um valor inteiro")
  });

  try {  
    await schema.validate({ companyId, searchParam, pageNumber }, { abortEarly: false });

    let whereCondition = {};
    const limit = 5000;
    const offset = limit * (+pageNumber - 1);

    if (searchParam) {
      whereCondition = {
        [Op.or]: [
          { name: { [Op.like]: `%${searchParam}%` } },
          { color: { [Op.like]: `%${searchParam}%` } }
        ]
      };
    }

    const { count, rows: tags } = await Tag.findAndCountAll({
      where: { ...whereCondition, companyId },
      limit,
      offset,
      order: [["name", "ASC"]],
      subQuery: false,
      include: [{
        model: TicketTag,
        as: 'ticketTags',
        attributes: [],
        required: false
      }],
      attributes: [
        'id',
        'name',
        'color',
        [fn('count', col('ticketTags.tagId')), 'ticketsCount']
      ],
      group: ['Tag.id']
    });

    const hasMore = count > offset + tags.length;

    logger.info(`Tags listadas com sucesso para a empresa ID ${companyId}, página ${pageNumber}`);

    return {
      tags,
      count,
      hasMore
    };
  } catch(err) {
    if (err instanceof Yup.ValidationError) {
      throw new AppError(`Erro de validação: ${err.errors.join(", ")}`, 400);
    }

    throw new AppError(`Erro interno ao listar tags`, 500);
  }
};

export default ListService;
