<template>
  <div>
    <section class="container">
      <h1>Character</h1>
      <div class="form-group row">
        <label for="cname" class="col-sm-2 col-form-label text-right">Character name</label>
        <input type="text" id="cname" class="col-sm-10 form-control" v-model="cname">
      </div>
      <button class="btn btn-primary" @click="update" :disabled="cname.length === 0">Save</button>
    </section>
  </div>
</template>

<script>
export default {
  name: "Character",
  data: function () {
    return {
      cname: "",
      race: null,
      class: null,
      stats: {
        str: 0,
        dex: 0,
        con: 0,
        int: 0,
        wis: 0,
        cha: 0
      }
    }
  },
  methods: {
    update: function () {
      var charObj = {
        cname: this.cname
      }
      this.$store.dispatch("updateCharacter", charObj)
        .then(() => this.$emit("setView", this.$event, "Menu"))
    }
  }
}
</script>
