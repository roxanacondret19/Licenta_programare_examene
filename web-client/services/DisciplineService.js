export default {
    async getAllDiscipline(Api) {
        const response = await Api.get(`discipline`);
        return response.data;
    },
    async getDisciplineByAnSectie(Api, an, sectie) {
        const response = await Api.get(`discipline/an/${an}/sectie/${sectie}`);
        return response.data;
    },
   async getDisciplinaByAnId(Api, id) {
      const response = await Api.get(`discipline/${id}`);
      return response.data;
   },

   async deleteDisciplina(Api, id) {
      const response = await Api.delete(`discipline/${id}`);
      return response.data;
   },

   async createDisciplina(Api, sala) {
      const response = await Api.post(`discipline/create`, sala);
      return response.data;
   },
}
