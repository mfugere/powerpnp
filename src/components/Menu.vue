<template>
  <div class="menu">
    <h1>{{ msg }}</h1>
    <button class="btn" v-on:click="initCreateCampaign">Create New Campaign</button>
  </div>
</template>

<script>
export default {
  name: "Menu",
  props: {
    msg: String
  },
  methods: {
    initCreateCampaign: function () {
      console.log("Campaign creator launched")
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
