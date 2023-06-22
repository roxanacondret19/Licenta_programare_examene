<template>
  <div>
    <div class="sali">
      <div class="title">
        <h2>Creeaza o sala</h2>
      </div>
      <form @submit.prevent="createSala">
        <input v-model="salaData.nume" placeholder="Nume" />
        <br />
        <br />
        <input v-model="salaData.nrLocuri" placeholder="Nr. locuri" />
        <br />
        <br />
        <button type="submit">Submit</button>
      </form>
      <hr class="line"/>
      <div class="title">
        <h2>Sali:</h2>
      </div>
      <div class="container">
        <div class="header">
          <p class="dark"> Id </p>
          <p class="light"> Nume </p>
          <p class="dark"> Nr. locuri </p>
          <p class="light"> Actiune </p>
        </div>
        <div class="lista">
          <div v-for="(sala, index) in sali" :key="index" :class="['row', {'bg-gray': index % 2 === 0}]">
            <p>{{ sala.id }}</p>
            <p>{{ sala.nume }}</p>
            <p>{{ sala.nrLocuri }}</p>
            <div class="container-button">
              <div @click="stergeSala(sala.id)" class="button">
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

import SaliService from "@/services/SaliService";

export default {
  layout: "basic",
  middleware: "auth",
  data: () => {
    return {
      salaData: {
        nume: "",
        nrLocuri: ""
      },
      sali: []
    };
  },
  async mounted() {
    this.sali = await SaliService.getAllSali(this.$api);
  },
  methods: {
    async stergeSala(id) {
      try {
        await SaliService.deleteSala(this.$api, id);
        this.sali = await SaliService.getAllSali(this.$api);
      } catch (error) {
        console.log(error);
      }
    },
    async createSala() {
      try {
        await SaliService.createSala(this.$api, this.salaData);
        this.sali = await SaliService.getAllSali(this.$api);
      } catch (error) {
        console.log(error);
      } finally {
        this.salaData = {
          nume: "",
          nrLocuri: ""
        };
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

.sali h2 {
  color: #1d2c7d;
}

.sali {
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
