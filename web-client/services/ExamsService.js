export default {
    async getAllFutureScheduledExamsForUser(Api, userId) {
        const response = await Api.get(`examene/user/${userId}/programate/viitoare`)
        return response.data;
    },

    async getAllFutureScheduledExamsForProfesor(Api, userId) {
        const response = await Api.get(`examene/profesor/${userId}/programate/viitoare`)
        return response.data;
    },

    async getAllFutureScheduledExamsForAdmin(Api, userId) {
        const response = await Api.get(`examene/admin/${userId}/programate/viitoare`)
        return response.data;
    },

    async getAllUnscheduledExamsForUser(Api, userId) {
        const response = await Api.get(`examene/user/${userId}/neprogramate`)
        return response.data;
    },

    async getAllUnscheduledExamsForProfesor(Api, userId) {
        const response = await Api.get(`examene/profesor/${userId}/neprogramate`)
        return response.data;
    },

    async getAllUnscheduledExamsForAdmin(Api, userId) {
        const response = await Api.get(`examene/admin/${userId}/neprogramate`)
        return response.data;
    },

    async getAllExams(Api) {
        const response = await Api.get(`examene`);
        return response.data;
    },

    async getById(Api, id) {
        const response = await Api.get(`examene/${id}`);
        return response.data;
    },

    async getAllExamsBySala(Api, sali) {
        const response = await Api.get(`examene/sali`, {
          params: {
            sali: sali.toString()
          },
        });
        return response.data;
    },

    async createExam(Api, exam) {
        const response = await Api.post(`examene/create`, exam);
        return response.data;
    },

    async editExam(Api, id, data) {
        const response = await Api.patch(`examene/edit/${id}`, data);
        return response.data;
    }
}
