<template>
  <div class="sidebar">
    <p class="subtitle">Actiuni: </p>
    <div class="content">
      <a href="/">
        <p>Pagina principala</p>
      </a>
      <a href="/examene">
        <p>{{ user.rol === 'Admin' ? "Examene" : "Examenele mele" }}</p>
      </a>
      <a v-if="user.rol === 'Admin'" href="/utilizatori">
        <p>Utilizatori</p>
      </a>
      <a v-if="user.rol === 'Admin'" href="/discipline">
        <p>Discipline</p>
      </a>
      <a v-if="user.rol === 'Admin'" href="/sali">
        <p>Sali</p>
      </a>
      <div @click="goToProgrameazaExamen" class="button">Programeaza examen</div>
      <div class="button" @click="genereazaListaExamene">Genereaza lista examene</div>
    </div>
  </div>
</template>

<script>
import ExamsService from "~/services/ExamsService";

export default {
  methods: {
    async genereazaListaExamene() {
    let examene;
     switch (this.user.rol) {
        case "Sef_An":
          examene = await ExamsService.getAllFutureScheduledExamsForUser(this.$api, this.user.id);
          break;
        case "Profesor":
          examene = await ExamsService.getAllFutureScheduledExamsForProfesor(this.$api, this.user.id);
          break;
        case "Admin":
          examene = await ExamsService.getAllFutureScheduledExamsForAdmin(this.$api, this.user.id);
          break;
        default:
          break;
     }
      this.download(this.makeCsv(examene));
    },
    download(data) {
    const blob = new Blob([data], { type: 'text/csv' });

    const url = window.URL.createObjectURL(blob)

    const a = document.createElement('a')

    a.setAttribute('href', url)

    a.setAttribute('download', 'download.csv');

    a.click()
    },
    makeCsv(data) {
    const csvRows = [];

    const headers = Object.keys(data[0]);

    csvRows.push(headers.join(','));

    for (const row of data) {
        const values = headers.map(e => {
            return row[e]
        })
        csvRows.push(values.join(','))
    }

    return csvRows.join('\n')
    },
    goToProgrameazaExamen() {
      this.$router.push("/programeaza");
    },
  },
  computed: {
    user() {
      return this.$store.getters.getUserInfo;
    }
  },
};
</script>

<style scoped>
.sidebar {
  position: relative;
  height: calc(100vh - 104px);
  background-color: #22263a;
  width: 280px;
  padding: 20px;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin-top: 20px;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
}

.content p {
  cursor: pointer;
}

.content p:hover {
    color: #01adef;
}

.subtitle {
  color: #01adef;
  font-size: 18px;
  font-weight: 600;
}

.button {
  padding: 12px 16px;
  border-radius: 8px;
  background-color: #fef9f4;
  color: #1d2c7d;
  cursor: pointer;
}

.button:hover {
    background-color: #2148a5;
    color: #fef9f4;
}

a {
  text-decoration: none;
  color: #fef9f4;
}
</style>
