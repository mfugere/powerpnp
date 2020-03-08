import Vue from "vue"
import VueRouter from "vue-router"
import * as AmazonCognitoIdentity from "amazon-cognito-identity-js"
import Config from "aws-sdk"
import App from "./App.vue"
import Register from "./components/Register.vue"
import Login from "./components/Login.vue"
import Menu from "./components/Menu.vue"
import CognitoConfig from "./config.js"

Vue.config.productionTip = false

var poolData = {
  UserPoolId: CognitoConfig.cognito.userPoolId,
  ClientId: CognitoConfig.cognito.userPoolClientId
}
var userPool
userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData)
if (typeof Config !== "undefined") {
  Config.region = CognitoConfig.cognito.region;
}

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: "/Register", component: Register, props: { userPool: userPool }},
    { path: "/Login", component: Login, props: { userPool: userPool }},
    { path: "/Menu", component: Menu, props: { userPool: userPool }}
  ]
})

new Vue({
  render: h => h(App),
  router
}).$mount("#app")
