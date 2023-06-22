<template>
  <div>
    <h1>Bine ai revenit, {{ user.prenume }}!</h1>
    <div class="examene">
      <Calendar v-if="!loading" :is-complex="false" :lista-examene="exameneProgramate"/>
      <hr class="line"/>
      <div class="title-neprogramate">
        <h2>Examene neprogramate:</h2>
        <p v-if="exameneNeprogramate.length > 5" @click="goToExamene" class="link">Vezi mai multe</p>
      </div>
      <ListaExameneNeprogramate v-if="exameneNeprogramate.length > 0" :listaExamene="exameneNeprogramate" :current-user="user"/>
      <h2 v-else>Nu exista examene neprogramate.</h2>
    </div>
  </div>
</template>
<script>
import ListaExameneProgramate from "../components/ListaExameneProgramate.vue";
import ListaExameneNeprogramate from "../components/ListaExameneNeprogramate.vue";
import Calendar from "../components/Calendar.vue";
import ExamsService from "~/services/ExamsService";
import UsersService from "@/services/UsersService";

export default {
  layout: "basic",
  middleware: "auth",
  components: { ListaExameneProgramate, ListaExameneNeprogramate, Calendar },
  data: () => {
    return {
      exameneProgramate: [],
      exameneNeprogramate: [],
      loading: false
    };
  },
  async mounted() {
    try {
      this.loading = true;
      this.exameneProgramate = await ExamsService.getAllExams(this.$api);
    } catch (error) {
      console.log(error);
    } finally {
      this.loading = false;
    }
    switch (this.user.rol) {
      case "Sef_An":
        this.exameneNeprogramate = await ExamsService.getAllUnscheduledExamsForUser(this.$api, this.user.id);
        break;
      case "Profesor":
        this.exameneNeprogramate = await ExamsService.getAllUnscheduledExamsForProfesor(this.$api, this.user.id);
        break;
      case "Admin":
        this.exameneNeprogramate = await ExamsService.getAllUnscheduledExamsForAdmin(this.$api, this.user.id);
        break;
      default:
        break;
    }
    this.exameneNeprogramate = await Promise.all(
      this.exameneNeprogramate.map(async (examen) => {
        const sefAn = await this.getNumeSefAn(examen);
        return {
          ...examen,
          sefAn
        }
      })
    );
  },
  computed: {
    user() {
      return this.$store.getters.getUserInfo;
    }
  },
  methods: {
    async getNumeSefAn(examen) {
      const sefAn = await UsersService.getUserByAnAndSectie(this.$api, examen.an, examen.sectie)
      return `${sefAn.nume} ${sefAn.prenume}`;
    },
    async logout() {
      await this.$auth.logout();
      this.$router.push("/login");
    },
    goToExamene() {
      this.$router.push("/examene");
    },
  }
};
</script>
<style scoped>
.examene h2 {
  color: #1d2c7d;
}

.line {
  width: 80%;
}

.examene {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  margin-top: 40px;
}

.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 1200px;
}

.title-neprogramate {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 720px;
}

.link{
  font-size: 18px;
  font-weight: 600;
  color: #01adef;
  cursor: pointer;
}
</style>
