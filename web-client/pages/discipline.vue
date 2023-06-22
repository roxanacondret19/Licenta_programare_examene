<template>
  <div>
    <div class="discipline">
      <div class="title">
        <h2>Creeaza o disciplina</h2>
      </div>
      <form @submit.prevent="createDisciplina">
        <input v-model="disciplinaData.nume" placeholder="Nume" />
        <br />
        <br />
        <select v-model="disciplinaData.an">
          <option disabled value="">Selecteaza un an</option>
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
        </select>
        <br />
        <br />
        <select v-model="disciplinaData.sectie">
          <option disabled value="">Selecteaza o sectie</option>
          <option>CTI</option>
          <option>IS</option>
        </select>
        <br />
        <br />
        <select v-model="disciplinaData.profesorId">
          <option disabled value="">Selecteaza un profesor</option>
          <option v-for="(profesor, index) in profesori" :key="index" :value="profesor.id">{{ profesor?.user?.nume }} {{ profesor?.user?.prenume }}</option>
        </select>
        <br />
        <br />
        <button type="submit">Submit</button>
      </form>
      <hr class="line"/>
      <div class="title">
        <h2>Discipline:</h2>
      </div>
      <div class="container">
        <div class="header">
          <p class="dark"> Id </p>
          <p class="light"> Nume </p>
          <p class="dark"> Sectie </p>
          <p class="light"> An </p>
          <p class="dark"> Profesor </p>
          <p class="light"> Actiune </p>
        </div>
        <div class="lista">
          <div v-for="(disciplina, index) in discipline" :key="index" :class="['row', {'bg-gray': index % 2 === 0}]">
            <p>{{ disciplina.id }}</p>
            <p>{{ disciplina?.nume }}</p>
            <p>{{ disciplina.sectie }}</p>
            <p>{{ disciplina.an }}</p>
            <p>{{ disciplina.profesor?.user?.nume }} {{ disciplina.profesor?.user?.prenume }}</p>
            <div class="container-button">
              <div @click="stergeDisciplina(disciplina.id)" class="button">
                Sterge
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import DisciplineService from "@/services/DisciplineService";
import UsersService from "@/services/UsersService";

export default {
  layout: "basic",
  middleware: "auth",
  data: () => {
    return {
      discipline: [],
      disciplinaData: {
        nume: "",
        an: "",
        sectie: "",
        profesorId: ""
      },
      profesori: [],
    };
  },
  async mounted() {
    this.discipline = await DisciplineService.getAllDiscipline(this.$api);
    this.profesori = await UsersService.getAllProfesors(this.$api);
  },
  methods: {
    async stergeDisciplina(id) {
      try {
        await DisciplineService.deleteDisciplina(this.$api, id);
        this.discipline = await DisciplineService.getAllDiscipline(this.$api);
      } catch (error) {
        console.log(error);
      }
    },
    async createDisciplina() {
      try {
        await DisciplineService.createDisciplina(this.$api, this.disciplinaData);
        this.discipline = await DisciplineService.getAllDiscipline(this.$api);
      } catch (error) {
        console.log(error);
      } finally {
        this.disciplinaData = {
          nume: "",
          an: "",
          sectie: "",
          profesorId: ""
        }
      }
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
.line {
  width: 80%;
}

.discipline h2 {
  color: #1d2c7d;
}

.discipline {
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

.container{
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  border: 2px solid black;
  border-radius: 4px;
}

.lista {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}

.lista .row {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid #0000001a;
}

.lista .row p {
  width: 180px;
  text-align: center;
  padding: 20px
}

.bg-gray {
  background-color: #f0f0f0;
}

.header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.header p {
  font-size: 20px;
  font-weight: 600;
  color: white;
  width: 180px;
  text-align: center;
  padding: 12px 16px;
}

.light {
  background-color: #01adef5c;
}

.dark {
  background-color: #1d2c7dc9;
}

.container-button {
  width: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.button {
  cursor: pointer;
  padding: 12px 16px;
  color: #fef9f4;
  font-size: 14px;
  font-weight: 600;
  border-radius: 4px;
  background-color: #1d2c7d;
}

.button:hover {
    background-color: #2148a5;
    color: #fef9f4;
}

select {
  width: 280px;
  border: 3px solid #1d2c7d;
  padding: 8px;
  border-radius: 4px;
}

input {
  width: 280px;
  border: 3px solid #1d2c7d;
  padding: 8px;
  border-radius: 4px;
}

button {
  width: 140px;
  border: none;
  border-radius: 4px;
  background-color: #1d2c7d;
  padding: 8px;
  color: #ffffff;
  font-weight: 800;
  font-size: 14px;
  cursor: pointer;
}

button:hover {
    background-color: #2148a5;
}

</style>
