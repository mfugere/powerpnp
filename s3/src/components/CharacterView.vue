<template>
  <div>
    <section class="container">
      <div class="card">
        <h3 class="card-header">{{cname}}</h3>
        <ul class="list-group list-group-flush">
          <li class="list-group-item"><h5 class="mb-1">Race</h5><p class="mb-1">{{race}}</p></li>
          <li class="list-group-item"><h5 class="mb-1">Class</h5><p class="mb-1">{{cclass}}</p></li>
          <li class="list-group-item"><h5 class="mb-1">Alignment</h5><p class="mb-1">{{alignment}}</p></li>
        </ul>
        <div class="card-footer">
          <button class="btn btn-secondary btn-lg" @click="$emit('goBack')">Back</button>
          <button class="btn btn-primary btn-lg" @click="$emit('updateMode', $event, 'edit')">Edit</button>
          <button class="btn btn-danger btn-lg" @click="$emit('deleteChar')">Delete</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "CharacterView",
  props: [ "character" ],
  data: function () {
    return {
      cname: this.character.NAME,
      race: this.character.RACE.NAME,
      cclass: this.character.CLASS.NAME,
      alignment: this.character.ALIGNMENT,
      avatar: ""
    }
  }
}
</script>
