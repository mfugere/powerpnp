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
        <h3 class="card-header">{{cname}}</h3>
        <div class="card-body">Here are some details about your character.</div>
        <div class="card-footer">
          <button class="btn btn-secondary btn-lg" @click="$emit('setView', $event, 'Menu')">Back</button>
          <button class="btn btn-danger btn-lg" @click="deleteChar" v-if="baseMode !== 'create'">Delete</button>
          <button class="btn btn-primary btn-lg" @click="update" v-if="baseMode === 'edit'">Save</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapActions } from "vuex"

export default {
  name: "Character",
  props: [ "account" ],
  data: function () {
    return {
      cname: "",
      race: null,
      class: null,
      alignment: "",
      avatar: null,
      cindex: 0,
      ref: ""
    }
  },
  mounted: function () {
    if (this.$store.state.characterEditMode !== "create") {
      var arrMode = this.$store.state.characterEditMode.split("/")
      this.cindex = arrMode[1]
      this.ref = arrMode[3]
      this.getCharacter({ ref: this.ref }).then((result) => {
        var character = result.data.Item
        this.cname = character.NAME
      })
    }
  },
  computed: {
    baseMode: function () {
      return this.$store.state.characterEditMode.split("/")[0]
    }
  },
  methods: {
    ...mapActions([
      "getCharacter",
      "updateCharacter",
      "deleteCharacter"
    ]),
    update: function () {
      var charObj = {
        cname: this.cname
      }
      this.updateCharacter(charObj)
        .then((result) => this.$emit("setView", this.$event, "Menu", result.data))
    },
    deleteChar: function () {
      var charObj = {
        ref: this.ref,
        cindex: this.cindex
      }
      this.deleteCharacter(charObj)
        .then((result) => this.$emit("setView", this.$event, "Menu", result.data))
    }
  }
}
</script>
