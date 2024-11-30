import Tag from "../../models/Tag";

import * as Yup from "yup";
import { logger } from "../../utils/logger";
import AppError from "../../errors/AppError";

const DeleteService = async (id: string | number): Promise<void> => {
  const schema = Yup.number()
    .required("O ID da tag é obrigatório")
    .positive("O ID da tag deve ser um número positivo")
    .integer("O ID da tag deve ser um número inteiro");

  try {
    await schema.validate(id, { abortEarly: false });
    
    const tag = await Tag.findOne({
      where: { id }
    });

    if (!tag) {
      logger.warn(`Nenhuma tag encontrada com o ID ${id}`);
      throw new AppError("ERR_NO_TAG_FOUND", 404);
    }

    await tag.destroy();

    logger.info(`Tag com ID ${id} deletada com sucesso`);
  } catch(err) {
    if (err instanceof Yup.ValidationError) {
      throw new AppError(`Erro de validação: ${err.errors.join(", ")}`, 400);
    }

    if (err instanceof AppError) {
      throw err;
    }

    throw new AppError("Erro interno ao deletar tag", 500);
  }
};

export default DeleteService;
