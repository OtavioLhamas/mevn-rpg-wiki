import router from '@/router'
import axios from 'axios'
import { UserInterface } from 'server/models/users'

const user = window.localStorage.getItem('user')

const state = () => ({
  user,
  status: {
    loggedIn: user !== null,
    registering: false
  }
})

const actions = {
  /**
   * Registers a new user on the database
   * @param {UserInterface} User object
   */
  register: ({ commit }: any, user: UserInterface) => {
    commit('registerRequest', user)

    axios.post('http://localhost:8081/users/register', user, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(
      user => {
        console.log(user)
        commit('registerSuccess', user)
        router.push('/login')
        setTimeout(() => {
        // TODO a global alert store module
        // dispatch('alert/success', 'Registration successful', { root: true })
        })
      }
    ).catch(
      (error) => {
        console.log(error.response.data.message)
        commit('registerFailure', error)
        // TODO a global alert store module
        // dispatch('alert/error', error, { root: true })
      }
    )
  }
}

const mutations = {
  // Disables the submit button while awaiting for the registration
  registerRequest: (state: any) => {
    state.status.registering = true
  },
  registerSuccess: (state: any) => {
    state.status.registering = false
  },
  registerFailure: (state: any) => {
    state.status.registering = false
  }
}

export const account = {
  namespaced: true,
  state,
  actions,
  mutations
}
