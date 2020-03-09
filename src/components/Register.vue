<template>
  <div>
    <header>
    </header>

    <section class="form-wrap">
      <div v-if="registered" class="alert alert-success">Registration successful. Please check your email inbox or spam folder for your verification link.</div>
      <div v-else>
        <h1>Register</h1>
        <p>Please enter your desired user name, email address, and password. Then confirm your password and click 'Register' to sign up!</p>
        <input type="text" v-model="username" placeholder="User name">
        <input type="email" v-model="email" placeholder="Email address">
        <input type="password" v-model="password1" placeholder="Password">
        <input type="password" v-model="password2" placeholder="Confirm password">
        <button class="btn btn-submit" v-on:click="register" :disabled="!formComplete">Register</button>
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
            this.$store.commit("setCurrentUser", result.user)
          } else console.error(err)
        })
      } else console.log("Passwords are case-sensitive, and must match.")
    }
  }
}
</script>
