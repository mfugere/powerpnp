import Vue from "vue"
import VueRouter from "vue-router"
import { store } from "./store/index.js"
import App from "./App.vue"
import Welcome from "./components/Welcome.vue"
import Register from "./components/Register.vue"
import Login from "./components/Login.vue"
import Menu from "./components/Menu.vue"

Vue.config.productionTip = false

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: "/", component: Welcome },
    { path: "/Register", component: Register },
    { path: "/Login", component: Login },
    { path: "/Menu", component: Menu }
  ]
})

new Vue({
  render: h => h(App),
  router,
  store
}).$mount("#app")
