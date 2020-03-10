<template>
  <div>
    <header>
    </header>

    <section class="container">
      <h1>Sign In</h1>
      <p>Please enter your user name and password. Then click 'Log in' to continue.</p>
      <div class="form-group row">
        <label for="logUsername" class="col-sm-2 col-form-label text-right">User name</label>
        <input type="text" id="logUsername" class="col-sm-10 form-control" v-model="username">
      </div>
      <div class="form-group row">
        <label for="logPassword" class="col-sm-2 col-form-label text-right">Password</label>
        <input type="password" id="logPassword" class="col-sm-10 form-control" v-model="password">
      </div>
      <button class="btn btn-primary" v-on:click="signin" :disabled="!formComplete">Log in</button>
    </section>
  </div>
</template>

<script>
import * as AmazonCognitoIdentity from "amazon-cognito-identity-js"

export default {
  name: "Login",
  data: function () {
    return {
      username: "",
      password: "",
    }
  },
  computed: {
    userPool: function () {
      return this.$store.state.userPool
    },
    formComplete: function () {
      return (this.username.length !== 0 && this.password.length !== 0)
    }
  },
  methods: {
    signin: function () {
      var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username: this.username,
        Password: this.password
      })

      var cognitoUser = new AmazonCognitoIdentity.CognitoUser({ Username: this.username, Pool: this.userPool })
      var data = this
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function () {
          data.$store.commit("setCurrentUser", data.userPool.getCurrentUser())
          data.$router.push("/Menu")
        },
        onFailure: function (err) {
          console.error(err)
        }
      })
    }
  }
}
</script>
