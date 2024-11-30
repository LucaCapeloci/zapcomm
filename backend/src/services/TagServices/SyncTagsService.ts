import Tag from "../../models/Tag";
import Ticket from "../../models/Ticket";
import TicketTag from "../../models/TicketTag";

import * as Yup from "yup";
import { logger } from "../../utils/logger";
import AppError from "../../errors/AppError";

interface Request {
  tags: Tag[];
  ticketId: number;
}

const SyncTags = async ({
  tags,
  ticketId
}: Request): Promise<Ticket | null> => {
  const schema = Yup.object().shape({
    tags: Yup.array()
      .required("O array das tags é obrigatório"),
    ticketId: Yup.number()
    .required("O ID do ticket é obrigatório")
    .positive("O ID do ticket deve ser um número positivo")
    .integer("O ID do ticket deve ser um número inteiro")
  });

  try {
    await schema.validate({ tags, ticketId }, { abortEarly: false });

    const ticket = await Ticket.findByPk(ticketId, { include: [Tag] });

    const tagList = tags.map(t => ({ tagId: t.id, ticketId }));

    await TicketTag.destroy({ where: { ticketId } });
    await TicketTag.bulkCreate(tagList);

    ticket?.reload();

    logger.info(`Tags do ticket ID ${ticketId} foram sincronizadas com sucesso`);

    return ticket;
  } catch (err) {
    if (err instanceof Yup.ValidationError) {
      throw new AppError(`Erro de validação: ${err.errors.join(", ")}`, 400);
    }

    throw new AppError("Erro interno ao sincronizar tags", 500);
  }
};

export default SyncTags;
