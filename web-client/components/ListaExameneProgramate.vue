<template>
  <div class="container">
    <div class="header">
      <p class="dark"> Disciplina </p>
      <p class="light"> Sala </p>
      <p class="dark"> Profesor </p>
      <p class="light"> Data </p>
      <p class="dark"> Ora </p>
    </div>
    <div class="lista">
    <div v-for="(examen, index) in listaExamene.slice(0,5)" :key="index" :class="['row', {'bg-gray': index % 2 === 0}]">
      <p>{{ examen.disciplina }}</p>
      <p>{{ examen.sala }}</p>
      <p>{{ examen.profesor }}</p>
      <p>{{ examen.data }}</p>
      <p>{{ examen.ora }}</p>
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
  },
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
</style>
