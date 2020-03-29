<template>
  <div id="app">
    <nav-menu :current-user="currentUser" @signout="signout"></nav-menu>
    <div class="container" id="main">
      <router-view @login="login"></router-view>
    </div>
  </div>
</template>

<script>
import "bootstrap-css-only"
import Nav from "./components/Nav.vue"

export default {
  name: "App",
  components: { "nav-menu": Nav },
  beforeCreate: function () {
    this.$store.dispatch("initUserPool")
  },
  mounted: function () {
    this.$store.dispatch("initUser").then((currentUser) => { this.currentUser = currentUser })
  },
  data: function () {
    return { currentUser: {} }
  },
  methods: {
    login: function (event, username, password) {
      this.$store.dispatch("login", { username: username, password: password }).then(() => {
        this.currentUser = this.$store.state.currentUser
        this.$router.push("/Menu")
      })
    },
    signout: function () {
      this.$store.dispatch("signout").then(() => {
        this.currentUser = this.$store.state.currentUser
        this.$router.push("/Login")
      })
    }
  }
}
</script>

<style>
#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin-top: 20px;
}
</style>
