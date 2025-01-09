<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <ul>
      <li v-for="person in people" :key="person.id">{{ person.name }}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import Person from '../../models/Person'

export default {
  name: 'HelloWorld',

  props: {
    msg: String,
    fatherId: String,
  },

  computed: {
    people() {
      const { fatherId } = this
      if (fatherId) {
        return Person.reactiveManyByIndex('fatherId', fatherId)
      }
      return Person.reactiveFilter({})
    },
  },
}
</script>
