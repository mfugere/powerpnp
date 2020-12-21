<template>
  <div>
    <section class="container" v-if="baseMode === 'create' || baseMode === 'edit'">
      <h1>Character</h1>
      <div class="form-group row">
        <label for="cname" class="col-sm-2 col-form-label text-right">Character name</label>
        <input type="text" id="cname" class="col-sm-10 form-control" v-model="cname">
      </div>
      <div class="form-group row justify-content-around">
        <select id="race" class="form-control col-sm-3" aria-label="Race selection" v-model="race">
          <option disabled value="">Character race</option>
          <option value="1">Human</option>
        </select>
        <select id="cclass" class="form-control col-sm-3" aria-label="Class selection" v-model="cclass">
          <option disabled value="">Character class</option>
          <option value="1">Warrior</option>
        </select>
        <select id="alignment" class="form-control col-sm-3" aria-label="Alignment selection" v-model="alignment">
          <option disabled value="">Character alignment</option>
          <option v-for="alignment in alignments" :key="alignment.REF" :value="alignment.NAME">{{alignment.NAME}}</option>
        </select>
      </div>
      <button class="btn btn-primary" @click="update" :disabled="cname.length === 0">Save</button>
    </section>
    <section class="container" v-if="baseMode === 'view'">
      <div class="card">
        <h3 class="card-header">{{cname}}</h3>
        <ul class="list-group list-group-flush">
          <li class="list-group-item"><b>Alignment</b>&nbsp;{{alignment}}</li>
        </ul>
        <div class="card-footer">
          <button class="btn btn-secondary btn-lg" @click="$emit('setView', $event, 'Menu')">Back</button>
          <button class="btn btn-danger btn-lg" @click="deleteChar" v-if="baseMode !== 'create' && cname">Delete</button>
          <button class="btn btn-primary btn-lg" @click="update" v-if="baseMode === 'edit' && cname">Save</button>
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
      race: "",
      cclass: "",
      alignment: "",
      avatar: "",
      cindex: 0,
      ref: "",
      infoText: "",
      alignments: []
    }
  },
  mounted: function () {
    if (this.$store.state.characterEditMode !== "create") {
      var arrMode = this.$store.state.characterEditMode.split("/")
      this.cindex = arrMode[1]
      this.ref = arrMode[3]
      this.getCharacter({ ref: this.ref }).then(result => {
        var character = result.data.Item
        this.cname = character.NAME
        this.alignment = character.ALIGNMENT
      })
    } else {
      this.getAlignments().then(result => {
        this.alignments = result.data.Items.sort((a, b) => a.REF - b.REF)
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
      "deleteCharacter",
      "getAlignments"
    ]),
    update: function () {
      var charObj = {
        cname: this.cname,
        alignment: this.alignment
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
