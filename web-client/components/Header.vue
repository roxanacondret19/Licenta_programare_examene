<template>
  <div class="header">
    <div class="logo" @click="goToHome">
        <img src="../static/IconUniveristy.png" alt="logo" />
      <div>
        <p>Universitatea</p>
        <p>Politehnica</p>
        <p>Timisoara</p>
      </div>
    </div>
    <div class="actions">
      <p class="text">{{ user.prenume.toUpperCase() }}</p>
      <div class="logout" @click="logout">LOGOUT</div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.getters.getUserInfo;
    }
  },
  methods: {
    async logout() {
      await this.$auth.logout();
      this.$router.push("/login");
    },
    goToHome() {
      this.$router.push("/");
    }
  }
}

</script>

<style scoped>
.header {
  height: 104px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background-color: #1d2c7d;
}

.logo {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.actions {
  display: flex;
  align-items: center;
  gap: 20px;
  text-transform: uppercase;
  color: white;
  font-size: 16px;
  font-weight: 600;
}

.text {
  color: white;
  font-size: 18px;
  font-weight: 800;
}

.logout {
  padding: 8px 16px;
  border-radius: 4px;
  background-color: #fef9f4;
  color: #1d2c7d;
  cursor: pointer;
}

.logout:hover {
    background-color: #2148a5;
    color: #fef9f4;
}
</style>
