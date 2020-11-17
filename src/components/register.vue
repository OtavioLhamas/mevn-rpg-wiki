<template>
  <v-form v-model="valid" ref="form" lazy-validation>
    <v-text-field
      label="First Name"
      v-model="firstName"
      :rules="nameRules"
      required
    ></v-text-field>
    <v-text-field
      label="Last Name"
      v-model="lastName"
      :rules="nameRules"
      required
    ></v-text-field>
    <v-text-field
      label="E-mail"
      v-model="email"
      :rules="emailRules"
      required
      type="email"
    ></v-text-field>
    <v-text-field
      label="Username"
      v-model="username"
      :rules="usernameRules"
      required
    ></v-text-field>
    <v-text-field
      label="Password"
      hint="At least 8 characters"
      v-model="password"
      :rules="passwordRules"
      required
      type="password"
    ></v-text-field>
    <v-text-field
      name="input-7-1"
      label="Confirm your password"
      min="8"
      v-model="confirmPassword"
      :rules="confirmPasswordRules"
      required
      type="password"
    ></v-text-field>

    <v-btn
      @click="submit"
      :disabled="!valid"
      id="submitBtn"
    >
      Submit
    </v-btn>
    <v-btn @click="clear">Clear</v-btn>
  </v-form>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'

export default Vue.extend({
  name: 'Register',

  data: () => ({
    valid: true,
    firstName: '',
    lastName: '',
    nameRules: [v => !!v || 'Name is required'],
    email: '',
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v) || 'E-mail must be valid'],
    username: '',
    usernameRules: [
      v => !!v || 'Username is required',
      v => v.length <= 20 || 'Username must be less than 20 characters',
      /**
       * (?=.{8,20}$) username is 8-20 characters long
       * (?![_.]) no _ or . at the beginning
       * (?!.*[_.]{2}) no __ or _. or ._ or .. inside
       * [a-zA-Z0-9._] allowed characters
       * (?<![_.]) no _ or . at the end
       * https://stackoverflow.com/a/12019115/11744642
       */
      v => /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/.test(v) || 'Invalid username. Number of characters must be between 8 to 20. Only contains alphanumeric characters, underscore and dot. Underscore and dot can\'t be at the end or start of a username. Underscore and dot can\'t be next to each other. Underscore or dot can\'t be used multiple times in a row'
    ],
    password: '',
    passwordRules: [
      v => !!v || 'Password is required',
      v => v.length >= 8 || 'Password must be at least 8 characters'
    ],
    confirmPassword: '',
    confirmPasswordRules: [
      v => !!v || 'Confirm your password'
    ]
  }),

  methods: {
    async submit () {
      if (this.$refs.form.validate() && this.password === this.confirmPassword) {
        return axios.post('http://localhost:8081/users/register', {
          name: {
            firstName: this.firstName,
            lastName: this.lastName
          },
          email: this.email,
          username: this.username,
          password: this.password
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
      }
    },
    clear () {
      this.$refs.form.reset()
    }
  }
})
</script>
