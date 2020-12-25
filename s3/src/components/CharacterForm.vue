<template>
  <div>
    <section class="container">
      <h1>Character</h1>
      <div class="form-group row">
        <label for="cname" class="col-sm-2 col-form-label text-right">Character name</label>
        <input type="text" id="cname" class="col-sm-10 form-control" v-model="cname">
      </div>
      <div class="form-group row justify-content-around">
        <select id="race" class="form-control col-sm-3" aria-label="Race selection" v-model="race">
          <option disabled value="">Character race</option>
          <option v-for="race in races" :key="race.REF"
            :value="race">{{race.NAME}}</option>
        </select>
        <select id="cclass" class="form-control col-sm-3" aria-label="Class selection" v-model="cclass">
          <option disabled value="">Character class</option>
          <option v-for="cclass in classes" :key="cclass.REF"
            :value="cclass">{{cclass.NAME}}</option>
        </select>
        <select id="alignment" class="form-control col-sm-3" aria-label="Alignment selection" v-model="alignment">
          <option disabled value="">Character alignment</option>
          <option v-for="alignment in alignments" :key="alignment.REF" :value="alignment.NAME">{{alignment.NAME}}</option>
        </select>
      </div>
      <button class="btn btn-secondary btn-lg" @click="$emit('goBack')">Back</button>
      <button class="btn btn-primary btn-lg" @click="update" :disabled="cname.length === 0 || !race || !cclass || !alignment">Save</button>
      <button class="btn btn-danger btn-lg" v-if="character.REF" @click="$emit('deleteChar')">Delete</button>
      <hr />
      <div class="row justify-content-around">
        <div class="alert alert-info col-sm-5" role="alert" v-if="race">
          <h4 class="alert-heading">About the {{race.NAME}} race</h4>
          <p>{{race.DESCRIPTION}}</p>
          <hr />
          <h5>Stat modifiers</h5>
          <ul class="list-group list-group-horizontal justify-content-around">
            <li class="list-group-item list-group-item-light" v-for="(value, name) in race.MODIFIERS" :key="name">{{name}}: {{value}}</li>
          </ul>
        </div>
        <div class="alert alert-info col-sm-5" role="alert" v-if="cclass">
          <h4 class="alert-heading">About the {{cclass.NAME}} class</h4>
          <p>{{cclass.DESCRIPTION}}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapActions } from "vuex"

export default {
  name: "CharacterForm",
  props: [ "character" ],
  data: function () {
    return {
      ref: this.character.REF || "",
      cname: this.character.NAME || "",
      race: "",
      cclass: "",
      alignment: this.character.ALIGNMENT || "",
      avatar: "",
      alignments: [],
      races: [],
      classes: []
    }
  },
  mounted: function () {
    this.getRaces().then(result => {
      this.races = result.data.Items.sort((a, b) => a.REF - b.REF)
      if (this.character.REF) this.race = this.races.find(race => race.REF === this.character.RACE.REF)
    })
    this.getClasses().then(result => {
      this.classes = result.data.Items.sort((a, b) => a.REF - b.REF)
      if (this.character.REF) this.cclass = this.classes.find(cclass => cclass.REF === this.character.CLASS.REF)
    })
    this.getAlignments().then(result => {
      this.alignments = result.data.Items.sort((a, b) => a.REF - b.REF)
    })
  },
  methods: {
    ...mapActions([
      "getRaces",
      "getClasses",
      "getAlignments"
    ]),
    update: function () {
      var charObj = {
        cname: this.cname,
        race: { REF: this.race.REF, NAME: this.race.NAME },
        cclass: { REF: this.cclass.REF, NAME: this.cclass.NAME },
        alignment: this.alignment
      }
      if (this.ref) charObj.ref = this.ref
      this.$emit("updateChar", this.$event, charObj)
    }
  }
}
</script>
