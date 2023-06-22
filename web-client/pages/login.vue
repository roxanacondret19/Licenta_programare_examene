<template>
  <div class="root">
    <div class="bg-image" />
    <div class="login">
      <div class="container">
        <h1>Autentificare</h1>
        <form @submit.prevent="login">
          <input v-model="loginData.email" placeholder="Email" />
          <br />
          <br />
          <input v-model="loginData.parola" placeholder="Parola" type="password" />
          <br />
          <br />
          <button type="submit">Conectare</button>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data: () => {
    return {
      loginData: {
        email: "",
        parola: "",
      }
    };
  },
  methods: {
    async login() {
      try {
        await this.$auth.loginWith('local', { data: this.loginData })
        this.$router.push("/");
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style scoped>
.bg-image {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 1;
  display: block;
  background-image: url("../static/thumbnail2.jpeg");
  background-position: center;
  background-size: cover;
  -webkit-filter: blur(5px);
  -moz-filter: blur(5px);
  height: 100vh;
  -o-filter: blur(5px);
  -ms-filter: blur(5px);
  filter: blur(5px);
}
.login {
    top: 50%;  /* position the top  edge of the element at the middle of the parent */
    left: 50%; /* position the left edge of the element at the middle of the parent */

  transform: translate(-50%, -50%);
  z-index: 999999;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: #ffffff;
  border-radius: 4px;
}
.container {
  padding: 160px;
  border-radius: 4px;
  border: 3px solid #1d2c7d;
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: center;
  align-items: center;
}

input {
  width: 360px;
  border: 3px solid #1d2c7d;
  padding: 8px;
  border-radius: 4px;
}

button {
  width: 200px;
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
