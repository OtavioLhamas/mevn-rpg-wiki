<template>
  <v-app>
    <NavHeader />

    <v-main>
      <HelloWorld msg="Welcome to Vuetify" />

      <v-container fluid fixed>
        <div id="app">
          <router-view />
        </div>
      </v-container>

    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import HelloWorld from '@/components/hello-world.vue'
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
