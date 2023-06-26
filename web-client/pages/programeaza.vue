<template>
  <div>
     <div class="titlu">
        <h2>Programeaza un examen</h2>
     </div>
      <div class="listaSali">
         <h2>Alege sala: </h2>
         <div v-for="(sala, index) in listaSali" :key="index" @click="selecteazaSala(sala)"
              :class="['sala', {'sala__selectata': isSalaSelectata(sala)}]">
            <p :class="['sala__title', {'sala__title-selectata': isSalaSelectata(sala)}]">{{ sala.nume }} ({{ sala.nrLocuri }} locuri)</p>
         </div>
      </div>

     <Calendar
       v-if="!loading"
       :lista-examene="listaExamene"
       :lista-sali="saliSelectate.length > 0 ? saliSelectate : listaSali"
       :lista-discipline="listaDiscipline"
       :selected-exam="selectedExam"
       :current-user="user"
       @creeaza-examen="creeazaExamen"
       @editeaza-examen="editeazaExamen"
       @get-by-id="getById"
     />
  </div>
</template>

<script>
import Calendar from "../components/Calendar.vue";
import ExamsService from "@/services/ExamsService";
import SaliService from "@/services/SaliService";
import DisciplineService from "@/services/DisciplineService";

export default {
  layout: "basic",
  components: { Calendar },
  data: () => {
    return {
      listaExamene: [],
      loading: true,
      listaSali: [],
      saliSelectate: [],
      listaDiscipline: [],
      selectedExam: null,
    };
  },
  async mounted() {
    try {
      this.loading = true;
      this.listaExamene = await ExamsService.getAllExams(this.$api);
      this.listaSali = await SaliService.getAllSali(this.$api);
      if (this.$route.query?.disciplinaId) {
        const disciplina = await DisciplineService.getDisciplinaByAnId(this.$api, this.$route.query?.disciplinaId);
        this.listaDiscipline.push(disciplina);
      } else {
         switch (this.user.rol) {
            case "Sef_An":
              this.listaDiscipline = await DisciplineService.getDisciplineByAnSectie(this.$api, this.user.an, this.user.sectie);
              break;
            case "Profesor":
              this.listaDiscipline = await DisciplineService.getDisciplineByAnSectie(this.$api, this.user.an, this.user.sectie);
              break;
            case "Admin":
              this.listaDiscipline = await DisciplineService.getAllDiscipline(this.$api);
              break;
            default:
              break;
         }
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.loading = false;
    
    }
  },
  computed: {
    user() {
      return this.$store.getters.getUserInfo;
    }
  },
  watch: {
    async saliSelectate() {
      if (this.saliSelectate.length === 0) {
        this.listaExamene = await ExamsService.getAllExams(this.$api);
        return;
      }
      this.listaExamene = await ExamsService.getAllExamsBySala(this.$api, this.saliSelectate.map((s) => s.id));
    },
    async $route(to, from) {
      if("disciplinaId" in from.query) {
         switch (this.user.rol) {
            case "Sef_An":
              this.listaDiscipline = await DisciplineService.getDisciplineByAnSectie(this.$api, this.user.an, this.user.sectie);
              break;
            case "Profesor":
              this.listaDiscipline = await DisciplineService.getDisciplineByAnSectie(this.$api, this.user.an, this.user.sectie);
              break;
            case "Admin":
              this.listaDiscipline = await DisciplineService.getAllDiscipline(this.$api);
              break;
            default:
              break;
         }
      }
    }
  },
  methods: {
    isSalaSelectata(sala) {
      return this.saliSelectate.includes(sala);
    },
    selecteazaSala(sala) {
      if (this.isSalaSelectata(sala)) {
        this.saliSelectate = this.saliSelectate.filter((s) => s.id !== sala.id);
        return;
      }
      this.saliSelectate.push(sala);
    },
    async creeazaExamen(data) {
      try {
        const disciplina = await DisciplineService.getDisciplinaByAnId(this.$api, data.disciplinaId);
        await ExamsService.createExam(this.$api, {
          nume: data.nume,
          startDate: data.startDate,
          endDate: data.endDate,
          disciplinaId: data.disciplinaId,
          salaId: data.salaId,
          tip: data.tip,
          prezentare: data.prezentare,
          an: disciplina.an,
          sectie: disciplina.sectie,
          creatorId: this.user.id
        });
        if (this.$route.query?.disciplinaId) {
          await this.$router.replace({query: {}})
        }
      } catch (error) {
        console.log(error);
      }
    },
    async editeazaExamen(id, data) {
      try {
        await ExamsService.editExam(this.$api, id, {
          nume: data.nume,
          startDate: data.startDate,
          endDate: data.endDate,
          disciplinaId: data.disciplinaId,
          salaId: data.salaId,
          tip: data.tip,
          prezentare: data.prezentare,
          an: this.user.an,
          sectie: this.user.sectie,
          creatorId: this.user.id
        });
      } catch (error) {
        console.log(error);
      }
    },
    async getById(id) {
      try {
        this.selectedExam = (await ExamsService.getById(this.$api, id));
      } catch (error) {
        console.log(error);
      }
    }
  }
}
</script>

<style scoped>

.titlu {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
}

h2 {
  color: #1d2c7d;
}

.listaSali {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}


.sala {
  width: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  border: 2px solid #1d2c7d;
  cursor: pointer;
  color: #1d2c7d;
}

.sala:hover {
  background-color: #2148a5;
  color: #ffffff;
}

.sala__selectata {
    background-color: #2148a5;
}

.sala__title {
  font-weight: 600;
  padding: 12px 8px;
}

.sala__title:hover {
  color: #ffffff;
}

.sala__title-selectata {
  color: #ffffff;
}
</style>
