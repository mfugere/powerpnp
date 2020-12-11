<template>
  <div>
    <section class="container" v-if="baseMode === 'create' || baseMode === 'edit'">
      <h1>Character</h1>
      <div class="form-group row">
        <label for="cname" class="col-sm-2 col-form-label text-right">Character name</label>
        <input type="text" id="cname" class="col-sm-10 form-control" v-model="cname">
      </div>
      <button class="btn btn-primary" @click="update" :disabled="cname.length === 0">Save</button>
    </section>
    <section class="container" v-if="baseMode === 'view'">
      <div class="card">
        <h3 class="card-header">{{activeCharacter.NAME}}</h3>
        <div class="card-body">Here are some details about your character.</div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "Character",
  props: [ "account" ],
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
  computed: {
    baseMode: function () {
      return this.$store.state.characterEditMode.split("/")[0]
    },
    activeCharacter: function () {
      if (this.$store.state.characterEditMode === "create") return ""
      else {
        var ref = this.$store.state.characterEditMode.split("/")[2]
        return this.account.CHARACTERS.find((character => character.REF === "/character/" + ref))
      }
    }
  },
  methods: {
    update: function () {
      var charObj = {
        cname: this.cname
      }
      this.$store.dispatch("updateCharacter", charObj)
        .then((result) => this.$emit("setView", this.$event, "Menu", result.data))
    }
  }
}
</script>
