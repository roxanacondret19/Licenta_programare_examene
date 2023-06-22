<template>
  <div>
    <div class="utilizatori">
      <div class="title">
        <h2>Creeaza un utilizator</h2>
      </div>
      <form @submit.prevent="createUser">
        <div class="form">
          <div class="column">
            <input v-model="userData.nume" placeholder="Nume" />
            <br />
            <br />
            <input v-model="userData.prenume" placeholder="Prenume" />
            <br />
            <br />
            <input v-model="userData.email" placeholder="Email" />
            <br />
            <br />
            <input v-model="userData.parola" placeholder="Parola" />
            <br />
            <br />
          </div>
          <div class="column">
            <select v-model="userData.an">
              <option disabled value="">Selecteaza un an</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
            </select>
            <br />
            <br />
            <select v-model="userData.sectie">
              <option disabled value="">Selecteaza o sectie</option>
              <option>CTI</option>
              <option>IS</option>
            </select>
            <br />
            <br />
            <select v-model="userData.rol">
              <option disabled value="">Selecteaza un rol</option>
              <option value="Sef_An">Sef An</option>
              <option value="Profesor">Profesor</option>
              <option value="Admin">Admin</option>
            </select>
            <br />
            <br />
          </div>
        </div>
        <button type="submit">Submit</button>
      </form>
      <hr class="line"/>
      <div class="title">
        <h2>Utilizatori:</h2>
      </div>
      <div class="container">
        <div class="header">
          <p class="dark"> Id </p>
          <p class="light"> Nume </p>
          <p class="dark"> Email </p>
          <p class="light"> An </p>
          <p class="dark"> Sectie </p>
          <p class="light"> Rol </p>
          <p class="dark"> Actiune </p>
        </div>
        <div class="lista">
          <div v-for="(user, index) in users" :key="index" :class="['row', {'bg-gray': index % 2 === 0}]">
            <p>{{ user.id }}</p>
            <p>{{ user.nume }} {{ user.prenume }}</p>
            <p>{{ user.email }}</p>
            <p>{{ user.an }}</p>
            <p>{{ user.sectie }}</p>
            <p>{{ user.rol }}</p>
            <div class="container-button">
              <div @click="stergeUser(user.id)" class="button">
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
import UsersService from "@/services/UsersService";

export default {
  layout: "basic",
  middleware: "auth",
  data: () => {
    return {
      users: [],
      userData: {
        nume: "",
        prenume: "",
        email: "",
        parola: "",
        an: "",
        sectie: "",
        rol: "",
      },
    };
  },
  async mounted() {
    this.users = await UsersService.getAllUsers(this.$api);
  },
  methods: {
    async stergeUser(id) {
      try {
        await UsersService.deleteUser(this.$api, id);
        this.users = await UsersService.getAllUsers(this.$api);
      } catch (error) {
        console.log(error);
      }
    },
    async createUser() {
      try {
        await UsersService.createNewUser(this.$api, this.userData);
        this.users = await UsersService.getAllUsers(this.$api);
      } catch (error) {
        console.log(error);
      } finally {
        this.userData = {
          nume: "",
          prenume: "",
          email: "",
          parola: "",
          an: "",
          sectie: "",
          rol: "",
        };
      }
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
.form {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 20px;
}

.line {
  width: 80%;
}

.utilizatori h2 {
  color: #1d2c7d;
}

.utilizatori {
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
