<template>
  <v-form v-model="valid" ref="form" lazy-validation>
    <v-text-field
      label="First Name"
      v-model="firstName"
      :rules="nameRules"
      required
      id="firstNameInput"
    ></v-text-field>
    <v-text-field
      label="Last Name"
      v-model="lastName"
      :rules="nameRules"
      required
      id="lastNameInput"
    ></v-text-field>
    <v-text-field
      label="E-mail"
      v-model="email"
      :rules="emailRules"
      required
      type="email"
      id="emailInput"
    ></v-text-field>
    <v-text-field
      label="Username"
      v-model="username"
      :rules="usernameRules"
      required
      id="usernameInput"
    ></v-text-field>
    <v-text-field
      label="Password"
      hint="At least 8 characters"
      v-model="password"
      :rules="passwordRules"
      required
      type="password"
      id="passwordInput"
    ></v-text-field>
    <v-text-field
      name="input-7-1"
      label="Confirm your password"
      min="8"
      v-model="confirmPassword"
      :rules="confirmPasswordRules"
      required
      type="password"
      id="confirmPasswordInput"
    ></v-text-field>

    <v-btn
      @click="submit"
      :disabled="(!valid || status.registering)"
      id="submitBtn"
    >
      Submit
    </v-btn>
    <v-btn @click="clear">Clear</v-btn>
  </v-form>
</template>

<script>
import Vue from 'vue'
import { mapState, mapActions } from 'vuex'

export default Vue.extend({
  name: 'Register',

  data: () => ({
    // Starts the component with a valid form to enable the submit button
    valid: true,
    // Empty input fields value
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    // Validation rules
    nameRules: [v => !!v || 'Name is required'],
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v) || 'E-mail must be valid'],
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
    passwordRules: [
      v => !!v || 'Password is required',
      v => v.length >= 8 || 'Password must be at least 8 characters'
    ],
    confirmPasswordRules: [
      v => !!v || 'Confirm your password'
    ]
  }),

  computed: {
    // Maps the state from the account module store
    ...mapState('account', ['status', 'user'])
  },

  methods: {
    // Maps the actions from the account module store
    ...mapActions('account', ['register']),
    async submit () {
      // Validates the form and makes sure the password confirmation is the same
      if (this.$refs.form.validate() && this.password === this.confirmPassword) {
        this.register({
          name: {
            firstName: this.firstName,
            lastName: this.lastName
          },
          email: this.email,
          username: this.username,
          password: this.password
        })
      }
    },
    clear () {
      this.$refs.form.reset()
    }
  }
})
</script>
