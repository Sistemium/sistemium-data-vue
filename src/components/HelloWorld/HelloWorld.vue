<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <ul>
      <li v-for="person in people" :key="person.id">{{ person.name }}</li>
    </ul>
  </div>
</template>

<script>

import Person from '../../models/Person';

export default {

  name: 'HelloWorld',

  props: {
    msg: String,
  },

  computed: {
    people() {
      return Person.reactiveFilter({});
    },
  },

};
</script>
