<template>
  <div class="container" id="nav" :key="Object.keys(currentUser).length">
    <div v-if="currentUser.account" class="row justify-content-center">Welcome, {{currentUser.account.USERNAME}}!</div>
    <ul class="row nav justify-content-center">
      <template v-for="link in links">
        <li class="nav-item" :key="link.route" v-if="(loginVal * link.renderKey) >= 0">
          <router-link class="nav-link" :to="link.route">{{link.title}}</router-link>
        </li>
      </template>
      <li class="nav-item" v-if="currentUser.account">
        <a href="#" class="nav-link" @click="$emit('signout')">Sign out</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Nav",
  props: [ "currentUser" ],
  data: function () {
    return {
      links: [
        { title: "Home", route: "/", renderKey: 0 },
        { title: "Register", route: "/Register", renderKey: -1 },
        { title: "Log in", route: "/Login", renderKey: -1 },
        { title: "Main menu", route: "/Menu", renderKey: 1 }
      ]
    }
  },
  computed: {
    loginVal: function () {
      return (this.currentUser.account) ? 1 : -1
    }
  }
}
</script>
