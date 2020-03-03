<template>
  <div id="app">
    <router-link to="/Register">Register</router-link>
    &nbsp;|&nbsp;
    <router-link to="/Login">Log in</router-link>
    <Menu msg="What would you like to do?"/>
    <router-view></router-view>
  </div>
</template>

<script>
import Menu from "./components/Menu.vue"

export default {
  name: "App",
  components: {
    Menu
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
