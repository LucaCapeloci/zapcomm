import Tag from "../../models/Tag";
import ShowService from "./ShowService";

import * as Yup from "yup";
import { logger } from "../../utils/logger";
import AppError from "../../errors/AppError";

interface TagData {
  id?: number;
  name?: string;
  color?: string;
  kanban?: number;
}

interface Request {
  tagData: TagData;
  id: string | number;
}

const UpdateUserService = async ({
  tagData,
  id
}: Request): Promise<Tag | undefined> => {
  const schema = Yup.object().shape({
    name: Yup.string()
      .optional()
      .min(3, "O nome da tag deve ter pelo menos 3 caracteres"),
    /* color: Yup.string()
      .optional()
      .matches(/^#([0-9A-F]{3}|[0-9A-F]{6})$/i, "A cor deve estar no formato hexadecimal (ex: #A4CCCC ou #FFF)"), */
    kanban: Yup.number()
      .optional()
      .integer("O valor de kanban deve ser um número inteiro")
      .oneOf([0, 1], "O valor de kanban deve ser 0 ou 1")
  });

  const tag = await ShowService(id);

  const { name, color, kanban } = tagData;

  try {
    await schema.validate({ name, kanban }, { abortEarly: false });

    await tag.update({
      name,
      color,
      kanban
    });

    await tag.reload();
    
    logger.info(`Tag atualizada com sucesso: ${tag.name}`);

    return tag;
  } catch(err) {
    if (err instanceof Yup.ValidationError) {
      throw new AppError(`Erro de validação: ${err.errors.join(", ")}`, 400);
    }
    
    throw new AppError("Erro interno ao atualizar tag", 500);
  }
};

export default UpdateUserService;
