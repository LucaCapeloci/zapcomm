import Tag from "../../models/Tag";

import * as Yup from "yup";
import { logger } from "../../utils/logger";
import AppError from "../../errors/AppError";

const TagService = async (id: string | number): Promise<Tag> => {
  const schema = Yup.number()
    .required("O ID da tag é obrigatório")
    .positive("O ID da tag deve ser um número positivo")
    .integer("O ID da tag deve ser um número inteiro");

  try {  
    await schema.validate(id, { abortEarly: false });

    const tag = await Tag.findByPk(id);

    if (!tag) {
      logger.warn(`Nenhuma tag encontrada com o ID ${id}`);
      throw new AppError("ERR_NO_TAG_FOUND", 404);
    }

    logger.info(`Tag com ID ${id} encontrada com sucesso`);

    return tag;
  } catch(err) {
    if (err instanceof Yup.ValidationError) {
      throw new AppError(`Erro de validação: ${err.errors.join(", ")}`, 400);
    }

    if (err instanceof AppError) {
      throw err;
    }

    logger.error(`Erro inesperado ao buscar tag com ID ${id}: ${err.message}`);
    throw new AppError("Erro interno ao buscar tag", 500);
  }
};

export default TagService;
