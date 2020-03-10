<template>
  <div id="app">
    <div class="container" id="nav">
      <ul class="row nav justify-content-center">
        <li class="nav-item">
          <router-link class="nav-link" v-if="!loggedIn" to="/Register">Register</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" v-if="!loggedIn" to="/Login">Log in</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" v-if="loggedIn" to="/Menu">Main menu</router-link>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link" @click="signout" v-if="loggedIn">Sign out</a>
        </li>
      </ul>
    </div>
    <div class="container" id="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import "bootstrap-css-only"
import * as AmazonCognitoIdentity from "amazon-cognito-identity-js"
import Config from "aws-sdk"
import CognitoConfig from "./config.js"

export default {
  name: "App",
  beforeCreate: function () {
    var poolData = {
      UserPoolId: CognitoConfig.cognito.userPoolId,
      ClientId: CognitoConfig.cognito.userPoolClientId
    }
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData)
    if (typeof Config !== "undefined") {
      Config.region = CognitoConfig.cognito.region
    }
    this.$store.commit("setUserPool", userPool)
    this.$store.commit("setCurrentUser", userPool.getCurrentUser())
  },
  computed: {
    userPool: function () {
      return this.$store.state.userPool
    },
    currentUser: function () {
      return this.$store.state.currentUser
    },
    loggedIn: function () {
      return this.$store.getters.loggedIn
    }
  },
  methods: {
    signout: function () {
      this.currentUser.signOut()
      this.$store.commit("setCurrentUser", this.userPool.getCurrentUser())
      this.$router.push("/Login")
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
