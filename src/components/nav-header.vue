<template>
  <v-app-bar color="grey darken-3" dark app>
    <v-layout row wrap>

      <v-flex xs5 md4>
        <v-toolbar color="grey darken-3" dark flat class="pl-3">
          <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
          <v-toolbar-title
            :class="{
              'mx-3': $vuetify.breakpoint.mdAndUp,
              'mx-1': $vuetify.breakpoint.smAndDown,
            }"
          >
            Home
          </v-toolbar-title>
        </v-toolbar>
      </v-flex>

      <v-flex xs7 md8>
        <v-toolbar color="grey darken-3" dark flat class="pr-4">
          <v-spacer></v-spacer>

          <v-toolbar-items>
            <v-btn
              text
              small
              id="registerBtn"
            >Register</v-btn>

            <v-btn
              text
              small
              id="loginBtn"
            >Login</v-btn>

            <v-btn
              text
              small
              id="logoutBtn"
            >Logout</v-btn>
          </v-toolbar-items>

        </v-toolbar>
      </v-flex>

    </v-layout>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({})
</script>
