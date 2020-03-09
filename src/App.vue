<template>
  <div id="app">
    <router-link v-if="!loggedIn" to="/Register">Register</router-link><br />
    <router-link v-if="!loggedIn" to="/Login">Log in</router-link><br />
    <router-link v-if="loggedIn" to="/Menu">Main menu</router-link><br />
    <a href="#" @click="signout" v-if="loggedIn">Sign out</a>
    <router-view></router-view>
  </div>
</template>

<script>
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
  color: #2c3e50;
  margin-top: 60px;
}
</style>
