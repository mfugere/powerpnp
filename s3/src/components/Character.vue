<template>
  <CharacterView v-if="baseMode === 'view' && character.REF"
    :character="character" @deleteChar="deleteChar" @updateMode="updateMode" @goBack="$emit('setView', $event, 'Menu')"  />
  <CharacterForm v-else-if="baseMode === 'create' || (baseMode === 'edit' && character.REF)"
    :character="character" @updateChar="updateChar" @deleteChar="deleteChar" @goBack="$emit('setView', $event, 'Menu')" />
</template>

<script>
import { mapActions, mapMutations } from "vuex"
import CharacterForm from "./CharacterForm.vue"
import CharacterView from "./CharacterView.vue"

export default {
  name: "Character",
  components: {
    "CharacterForm": CharacterForm,
    "CharacterView": CharacterView
  },
  data: function () {
    return {
      character: {},
      cindex: -1,
      ref: ""
    }
  },
  mounted: function () {
    if (this.baseMode !== "create") {
      var editModeArr = this.$store.state.characterEditMode.split("/")
      this.cindex = editModeArr[1]
      this.ref = editModeArr[3]
      this.getCharacter({ ref: this.ref }).then(result => {
        this.character = result.data.Item
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
    ...mapMutations([ "setCharacterEditMode" ]),
    deleteChar: function () {
      var charObj = {
        ref: this.ref,
        cindex: this.cindex
      }
      this.deleteCharacter(charObj)
        .then((result) => this.$emit("setView", this.$event, "Menu", result.data))
    },
    updateChar: function (event, char) {
      if (this.cindex >= 0) char.cindex = this.cindex
      this.updateCharacter(char)
        .then((result) => {
          if (result) this.$emit("setView", this.$event, "Menu", result.data)
          else this.$emit("setView", this.$event, "Menu")
        })
    },
    updateMode: function (event, mode) {
      this.setCharacterEditMode(mode)
    }
  }
}
</script>
