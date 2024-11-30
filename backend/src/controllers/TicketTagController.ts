import { Request, Response } from "express";
import TicketTag from '../models/TicketTag';
import Tag from '../models/Tag'

import * as Yup from "yup";
import AppError from "../errors/AppError";
import { logger } from "../utils/logger";

export const store = async (req: Request, res: Response): Promise<Response> => {
  const { ticketId, tagId } = req.params;

  const schema = Yup.object().shape({
    ticketId: Yup.number()
      .required("O ID do ticket é obrigatório")
      .positive("O ID do ticket deve ser um número positivo")
      .integer("O ID do ticket deve ser um número inteiro"),
    tagId: Yup.number()
      .required("O ID da tag é obrigatório")
      .positive("O ID da tag deve ser um número positivo")
      .integer("O ID da tag deve ser um número inteiro")
  });

  try {
    await schema.validate({ ticketId, tagId }, { abortEarly: false });

    const ticketTag = await TicketTag.create({ ticketId, tagId });
    
    logger.info(`Ticket Tag armazenado com sucesso: ticket ID ${ticketId}, tag ID ${tagId}`);

    return res.status(201).json(ticketTag);
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      throw new AppError(`Erro de validação: ${error.errors.join(", ")}`, 400);
    }

    throw new AppError("Erro interno ao armazenar ticket tag", 500);
  }
};

/*
export const remove = async (req: Request, res: Response): Promise<Response> => {
  const { ticketId } = req.params;



  try {
    await TicketTag.destroy({ where: { ticketId } });
    return res.status(200).json({ message: 'Ticket tags removed successfully.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to remove ticket tags.' });
  }
};
*/
export const remove = async (req: Request, res: Response): Promise<Response> => {
  const { ticketId } = req.params;

  const schema = Yup.object().shape({
    ticketId: Yup.number()
      .required("O ID do ticket é obrigatório")
      .positive("O ID do ticket deve ser um número positivo")
      .integer("O ID do ticket deve ser um número inteiro")
  });

  try {
    await schema.validate({ ticketId }, { abortEarly: false });

    // Retrieve tagIds associated with the provided ticketId from TicketTags
    const ticketTags = await TicketTag.findAll({ where: { ticketId } });
    const tagIds = ticketTags.map((ticketTag) => ticketTag.tagId);

    // Find the tagIds with kanban = 1 in the Tags table
    const tagsWithKanbanOne = await Tag.findAll({
      where: {
        id: tagIds,
        kanban: 1,
      },
    });

    // Remove the tagIds with kanban = 1 from TicketTags
    const tagIdsWithKanbanOne = tagsWithKanbanOne.map((tag) => tag.id);
    if (tagIdsWithKanbanOne)
    await TicketTag.destroy({ where: { ticketId, tagId: tagIdsWithKanbanOne } });
    
    logger.info(`Ticket Tags removido com sucesso: ticket ID ${ticketId}`);    

    return res.status(200).json({ message: 'Ticket tags removed successfully.' });
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      throw new AppError(`Erro de validação: ${error.errors.join(", ")}`, 400);
    }

    throw new AppError("Erro interno ao remover ticket tags", 500);
  }
};
