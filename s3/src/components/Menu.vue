<template>
  <section class="container">
    <h1>What would'st thou deau?</h1>
    <button class="btn btn-primary" v-on:click="initCreateCampaign">Create New Campaign</button>
  </section>
</template>

<script>
export default {
  name: "Menu",
  methods: {
    initCreateCampaign: function () {
      console.log("Campaign creator launched")
    }
  }
}
</script>
