<template>
  <v-app>
    <NavHeader />

    <v-main>
      <HelloWorld msg="Welcome to Vuetify" />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import HelloWorld from '@/components/HelloWorld.vue'
import NavHeader from '@/components/nav-header.vue'

export default Vue.extend({
  name: 'App',

  components: {
    HelloWorld,
    NavHeader
  },

  data: () => ({
    //
  })
})
</script>
