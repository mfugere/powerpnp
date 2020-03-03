import Vue from "vue"
import VueRouter from "vue-router"
import App from "./App.vue"
import Register from "./components/Register.vue"
import Login from "./components/Login.vue"

Vue.config.productionTip = false

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: "/Register", component: Register },
    { path: "/Login", component: Login }
  ]
})

new Vue({
  render: h => h(App),
  router
}).$mount("#app")
