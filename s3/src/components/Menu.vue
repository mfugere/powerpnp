<template>
  <section class="container">
    <h1>What would'st thou deau?</h1>
    <div>
      <h2>My Characters</h2>
      <ul class="list-group list-group-horizontal" v-if="account && Object.keys(account).length > 0">
        <template v-for="(character, index) in account.CHARACTERS">
          <li class="list-group-item borderless card content-card text-dark bg-light" :key="character.REF">
            <img class="card-img-top" src="@/assets/menu_icon_char.png" alt="character.NAME"
              @click="editCharacter('view/' + index + character.REF)">
            <div class="card-body">{{character.NAME}}</div>
          </li>
        </template>
        <li class="list-group-item borderless card content-card text-dark bg-light">
          <img class="card-img-top" src="@/assets/menu_icon_add.png" alt="Create a new character"
            @click="editCharacter('create')">
          <div class="card-body">Create a new character</div>
        </li>
      </ul>
    </div>
    <div>
      <h2>My Campaigns</h2>
      <ul class="list-group list-group-horizontal" v-if="account && Object.keys(account).length > 0">
        <template v-for="campaign in createdCampaigns">
          <li class="list-group-item borderless card content-card text-dark bg-light" :key="campaign.REF">
            <img class="card-img-top" src="@/assets/menu_icon_game.png" alt="campaign.NAME">
            <div class="card-body">{{campaign.NAME}}</div>
          </li>
        </template>
        <li class="list-group-item borderless card content-card text-dark bg-light">
          <img class="card-img-top" src="@/assets/menu_icon_add.png" alt="Create a new campaign">
          <div class="card-body">Create a new campaign</div>
        </li>
      </ul>
    </div>
    <div>
      <h2>Join a Campaign</h2>
      <ul class="list-group list-group-horizontal" v-if="account && Object.keys(account).length > 0">
        <template v-for="campaign in joinedCampaigns">
          <li class="list-group-item borderless card content-card text-dark bg-light" :key="campaign.REF">
            <img class="card-img-top" src="@/assets/menu_icon_game.png" alt="campaign.NAME">
            <div class="card-body">{{campaign.NAME}}</div>
          </li>
        </template>
        <li class="list-group-item borderless card content-card text-dark bg-light">
          <img class="card-img-top" src="@/assets/menu_icon_add.png" alt="Join a new campaign">
          <div class="card-body">Join a new campaign</div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import { mapMutations } from "vuex"

export default {
  name: "Menu",
  props: [ "account" ],
  computed: {
    createdCampaigns: function () {
      return this.account.GAMES.filter(game => game.role === "gm")
    },
    joinedCampaigns: function () {
      return this.account.GAMES.filter(game => game.role === "player")
    }
  },
  methods: {
    ...mapMutations([ "setCharacterEditMode" ]),
    editCharacter: function (mode) {
      this.setCharacterEditMode(mode)
      this.$emit("setView", this.$event, "Character")
    }
  }
}
</script>

<style>
li.borderless {
  border: 0 none;
}
.content-card {
  width: 12em;
}
</style>
