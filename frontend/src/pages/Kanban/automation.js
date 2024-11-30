
import api from "../../services/api";
import { defaultTags } from "./config";

class KanbanAutomation {
  async createDefaultTags(userId) {
    try {
      for (const tagKey in defaultTags) {
        const tag = defaultTags[tagKey];
        const name = tag.name;
        const color = tag.color;
        const kanban = tag.kanban;
        await this.saveNewTag(name, color, kanban, userId)
      }
    } 
    catch (err) {
      if (err.response) {
        console.error(`Erro na resposta ao criar tags padrões: ${err.response.status} - ${err.response.data}`);
      } else if (err.request) {
        console.error("Erro de rede ao criar tags padrões: a requisição não foi recebida pela API");
      } else {
        console.error("Erro desconhecido ao criar tags padrões:", err.message);
      }
    }
  }

  async automaticCardMove(ticketId, status) {
    try {
      let tagId = null;

      for (const tagKey in defaultTags) {
        const tag = defaultTags[tagKey];
        const name = tag.name;
        const color = tag.color;
        const matchingStatus = tag.matchingStatus;
        if (matchingStatus === status) {
          tagId = await this.getTagId(name, color);
          break;
        }
      }

      await api.delete(`/ticket-tags/${ticketId}`);
      await api.put(`/ticket-tags/${ticketId}/${tagId}`);
    } catch (err) {
      if (err.response) {
        console.error(`Erro na resposta ao mover ticket: ${err.response.status} - ${err.response.data}`);
      } else if (err.request) {
        console.error("Erro de rede ao mover ticket: a requisição não foi recebida pela API");
      } else {
        console.error("Erro desconhecido ao mover ticket:", err.message);
      }
    }
  }

  async needsDefaultTags() {
    try {
      for (const tagKey in defaultTags) {
        const tag = defaultTags[tagKey];
        const name = tag.name;
        const color = tag.color;
        let exists = await this.getTagId(name, color);
        if (exists == null) {
          return true;
        }
      }
      
      return false;
    } catch (err) {
      console.error("Erro ao verificar a existência das tags padrão:", err);

      return true;
    }
  }

  async saveNewTag(name, color, kanban, userId) {
    const tagData = { name, color, kanban, userId };
    try {
      await api.post("/tags", tagData);
    } 
    catch (err) {
      if (err.response) {
        console.error(`Erro na resposta ao salvar tag: ${err.response.status} - ${err.response.data}`);
      } else if (err.request) {
        console.error("Erro de rede ao salvar tag: a requisição não foi recebida pela API");
      } else {
        console.error("Erro desconhecido ao salvar tag:", err.message);
      }
    }
  }

  async getTagId(name, color) {
    const tagData = { name, color };

    try {
      const { data } = await api.get("/tags/");

      const matchingTags = data.tags.filter(
        (tag) => tag.name === tagData.name && tag.color === tagData.color
      );

      const tagId = matchingTags.length > 0 ? matchingTags[0].id : null;

      return tagId;
    } 

    catch (err) {
      if (err.response) {
        console.error(`Erro na resposta da API: ${err.response.status} - ${err.response.data}`);
      } else if (err.request) {
        console.error("Erro de rede: a requisição não foi recebida pela API");
      } else {
        console.error("Erro desconhecido:", err.message);
      }

      return null;
    }
  }
}
  
export default new KanbanAutomation();

