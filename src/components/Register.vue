<template>
  <div>
    <div id="noCognitoMessage" class="configMessage" style="display: none;">
        <div class="backdrop"></div>
        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title">No Cognito User Pool Configured</h3>
            </div>
            <div class="panel-body">
                <p>There is no user pool configured.</p>
            </div>
        </div>
    </div>

    <header>
    </header>

    <section class="form-wrap">
        <h1>Register</h1>
        <p>Please enter your desired user name, email address, and password. Then confirm your password and click 'Register' to sign up!</p>
    </section>
  </div>
</template>

<script>
export default {
  name: "Register",
  props: {},
  methods: {}
}
</script>
