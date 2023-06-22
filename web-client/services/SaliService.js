export default {
    async getAllSali(Api) {
        const response = await Api.get(`sali`);
        return response.data;
    },

   async deleteSala(Api, id) {
      const response = await Api.delete(`sali/${id}`);
      return response.data;
   },

  async createSala(Api, sala) {
      const response = await Api.post(`sali/create`, sala);
      return response.data;
   },
}
