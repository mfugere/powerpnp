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
        <h1>Sign In</h1>
        <p>Please enter your user name and password. Then click 'Log in' to continue.</p>
    </section>
  </div>
</template>

<script>
export default {
  name: "Login",
  props: {},
  methods: {}
}
</script>
