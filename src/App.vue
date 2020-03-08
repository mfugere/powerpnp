<template>
  <div id="app">
    <router-link v-if="!loggedIn" to="/Register">Register</router-link><br />
    <router-link v-if="!loggedIn" to="/Login">Log in</router-link><br />
    <router-link v-if="loggedIn" to="/Menu">Main menu</router-link><br />
    <a href="#" @click="signout" v-if="loggedIn">Sign out</a>
    <router-view @logged-in="loggedIn = true"></router-view>
  </div>
</template>

<script>

export default {
  name: "App",
  data: function () {
    return {
      loggedIn: false
    }
  },
  computed: {
    //TODO: Switch to Cognito session lookup for loggedIn vs. potentially-misleading Vue events
  },
  methods: {
    signout: function () {
      // TODO: Cognito signout hook
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
  color: #2c3e50;
  margin-top: 60px;
}
</style>
