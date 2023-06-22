export default {
    async getAllUsers(Api) {
        const response = await Api.get("users/")
        return response.data;
    },

    async getAllProfesors(Api) {
        const response = await Api.get("profesors/")
        return response.data;
    },

   async deleteUser(Api, id) {
      const response = await Api.delete(`users/${id}`);
      return response.data;
   },

   async createNewUser(Api, userData) {
      const response = await Api.post(`users/register/`, userData);
      return response.data;
   },

    async getUserByAnAndSectie(Api, an, sectie) {
      const response = await Api.get(`users/an/${an}/sectie/${sectie}`);
      return response.data;
    },
}
