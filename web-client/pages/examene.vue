<template>
  <div>
    <div class="examene">
      <div class="title">
        <h2>Examene programate:</h2>
      </div>
      <ListaExameneProgramate v-if="exameneProgramate.length > 0" :listaExamene="exameneProgramate" />
      <h2 v-else>Nu exista examene programate.</h2>
      <hr class="line"/>
      <div class="title-neprogramate">
        <h2>Examene neprogramate:</h2>
      </div>
      <ListaExameneNeprogramate v-if="exameneNeprogramate.length > 0" :listaExamene="exameneNeprogramate" :current-user="user"/>
      <h2 v-else>Nu exista examene neprogramate.</h2>
    </div>
  </div>
</template>
<script>
import ListaExameneProgramate from "../components/ListaExameneProgramate.vue";
import ListaExameneNeprogramate from "../components/ListaExameneNeprogramate.vue";
import ExamsService from "~/services/ExamsService";
import UsersService from "@/services/UsersService";

export default {
  layout: "basic",
  middleware: "auth",
  components: { ListaExameneProgramate, ListaExameneNeprogramate },
  data: () => {
    return {
      exameneProgramate: [],
      exameneNeprogramate: [],
    };
  },
  async mounted() {
     switch (this.user.rol) {
      case "Sef_An":
        this.exameneProgramate = await ExamsService.getAllFutureScheduledExamsForUser(this.$api, this.user.id);
        this.exameneNeprogramate = await ExamsService.getAllUnscheduledExamsForUser(this.$api, this.user.id);
        break;
      case "Profesor":
        this.exameneProgramate = await ExamsService.getAllFutureScheduledExamsForProfesor(this.$api, this.user.id);
        this.exameneNeprogramate = await ExamsService.getAllUnscheduledExamsForProfesor(this.$api, this.user.id);
        break;
      case "Admin":
        this.exameneProgramate = await ExamsService.getAllFutureScheduledExamsForAdmin(this.$api, this.user.id);
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
  methods: {
    async getNumeSefAn(examen) {
      const sefAn = await UsersService.getUserByAnAndSectie(this.$api, examen.an, examen.sectie)
      return `${sefAn.nume} ${sefAn.prenume}`;
    }
  },
  computed: {
    user() {
      return this.$store.getters.getUserInfo;
    }
  },
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
</style>
