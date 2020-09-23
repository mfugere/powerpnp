<template>
  <div id="app">
    <div class="container" id="nav">
      <div v-if="account && Object.keys(account).length > 0" class="row justify-content-center">Welcome, {{account.USERNAME}}!</div>
      <ul class="row nav justify-content-center">
        <template v-for="link in activeLinks">
          <li class="nav-item" :key="link.componentName">
            <a class="nav-link" href="#" @click="setView(link.componentName)">{{link.title}}</a>
          </li>
        </template>
      </ul>
    </div>
    <div class="container" id="main">
      <component :is="currentView" :account="account" @login="login" @setView="setViewFromEvent"></component>
    </div>
  </div>
</template>

<script>
import "bootstrap-css-only"
import Welcome from "./components/Welcome.vue"
import Register from "./components/Register.vue"
import Login from "./components/Login.vue"
import Menu from "./components/Menu.vue"
import Faq from "./components/Faq.vue"
import Character from "./components/Character.vue"
import { mapActions } from "vuex"

export default {
  name: "App",
  components: {
    "Welcome": Welcome,
    "Register": Register,
    "Login": Login,
    "Menu": Menu,
    "Faq": Faq,
    "Character": Character
  },
  created: function () {
    this.initUserPool()
  },
  mounted: function () {
    this.initUser().then((account) => {
      this.account = account
    })
  },
  data: function () {
    return {
      account: null,
      currentView: "Welcome",
      links: [ // renderKey values: -1 (not logged in), 0 (either), 1 (logged in)
        { title: "Home", componentName: "Welcome", renderKey: 0 },
        { title: "Register", componentName: "Register", renderKey: -1 },
        { title: "Log in", componentName: "Login", renderKey: -1 },
        { title: "Main menu", componentName: "Menu", renderKey: 1 },
        { title: "FAQ", componentName: "Faq", renderKey: 0 },
        { title: "Sign out", componentName: "Signout", renderKey: 1 }
      ]
    }
  },
  computed: {
    activeLinks: function () {
      var loggedIn = (this.account && Object.keys(this.account).length > 0) ? 1 : -1
      return this.links.filter(link => (loggedIn * link.renderKey) >= 0)
    }
  },
  methods: {
    ...mapActions([
      "initUserPool",
      "initUser",
      "signout"
    ]),
    setViewFromEvent: function (event, componentName, dirty) {
      if (dirty) this.initUser().then((result) => {
        this.account = result
        this.setView(componentName)
      })
      else this.setView(componentName)
    },
    setView: function (componentName) {
      if (componentName === "Signout") {
        this.signout().then(() => {
          this.account = this.$store.state.account
          this.currentView = "Login"
        })
      } else this.currentView = componentName
    },
    login: function (event, sessionToken) {
      this.initUser({ sessionToken: sessionToken }).then((account) => {
        this.account = account
        this.setView("Menu")
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
