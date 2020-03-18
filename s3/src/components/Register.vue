<template>
  <div>
    <header>
    </header>

    <section class="container">
      <div v-if="registered" class="alert alert-success">Registration successful. Please check your email inbox or spam folder for your verification link.</div>
      <div v-else>
        <h1>Register</h1>
        <p>Please enter your desired user name, email address, and password. Then confirm your password and click 'Register' to sign up!</p>
        <div class="form-group row">
          <label for="regUsername" class="col-sm-2 col-form-label text-right">User name</label>
          <input type="text" id="regUsername" class="col-sm-10 form-control" v-model="username">
        </div>
        <div class="form-group row">
          <label for="regEmail" class="col-sm-2 col-form-label text-right">Email address</label>
          <input type="email" id="regEmail" class="col-sm-10 form-control" v-model="email">
        </div>
        <div class="form-group row">
          <label for="regPassword1" class="col-sm-2 col-form-label text-right">Desired password</label>
          <input type="password" id="regPassword1" class="col-sm-10 form-control" v-model="password1">
          <small id="passwordHelp" class="offset-sm-2 form-text text-muted">Password must be at least 8 characters long.</small>
        </div>
        <div class="form-group row">
          <label for="regPassword2" class="col-sm-2 col-form-label text-right">Confirm password</label>
          <input type="password" id="regPassword2" class="col-sm-10 form-control" v-model="password2">
        </div>
        <button class="btn btn-primary" v-on:click="register" :disabled="!formComplete">Register</button>
      </div>
    </section>
  </div>
</template>

<script>
import * as AmazonCognitoIdentity from "amazon-cognito-identity-js"

export default {
  name: "Register",
  data: function () {
    return {
      username: "",
      email: "",
      password1: "",
      password2: "",
      registered: false
    }
  },
  computed: {
    userPool: function () {
      return this.$store.state.userPool
    },
    formComplete: function () {
      return (this.username.length !== 0 && this.email.length !== 0
        && this.password1.length !== 0 && this.password2.length !== 0)
    }
  },
  methods: {
    register: function () {
      if (this.password1 === this.password2) {
        var data = this
        var emailAttribute = new AmazonCognitoIdentity.CognitoUserAttribute({ Name: "email", Value: this.email })
        this.userPool.signUp(this.username, this.password1, [emailAttribute], null, function (err, result) {
          if (!err) {
            data.registered = true
            data.$store.dispatch("createAccount", { username: result.user.username })
          } else console.error(err)
        })
      } else console.log("Passwords are case-sensitive, and must match.")
    }
  }
}
</script>
