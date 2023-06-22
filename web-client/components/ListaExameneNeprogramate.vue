<template>
  <div class="container">
    <div class="header">
      <p class="dark"> Disciplina </p>
      <p class="light"> Profesor </p>
      <p class="dark"> Sef de an </p>
      <p v-if="currentUser.rol !== 'Profesor'" class="light"> Actiune </p>
    </div>
    <div class="lista">
    <div v-for="(examen, index) in listaExamene.slice(0,5)" :key="index" :class="['row', {'bg-gray': index % 2 === 0}]">
      <p>{{ examen.nume }}</p>
      <p>{{ getNumeProfesor(examen) }}</p>
      <p>{{ examen.sefAn }}</p>
      <div v-if="currentUser.rol !== 'Profesor'" class="container-button">
        <div @click="goToProgrameazaExamen(examen)" class="button">
          Programeaza
        </div>
      </div>
    </div>
    </div>
  </div>
</template>
<script>
import Header from "~/components/Header.vue";

export default {
  components: { Header },
  props: {
    listaExamene: { type: Array, default: () => [] },
    currentUser: { type: Object, default: () => {} },
  },
  methods: {
    getNumeProfesor(examen) {
      return `${examen.profesor.user.nume} ${examen.profesor.user.prenume}`;
    },
    goToProgrameazaExamen(examen) {
      this.$router.push({ path: 'programeaza', query: { disciplinaId: examen.id } });
    },
  }
}
</script>
<style scoped>
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
  width: 240px;
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
  width: 240px;
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
  width: 240px;
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
</style>
