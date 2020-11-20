import { App } from '@/../server/setup'
import Register from '@/components/register.vue'
import { createLocalVue, mount } from '@vue/test-utils'
import express from 'express'
import mongoose, { Mongoose } from 'mongoose'
import request from 'supertest'
import Vuetify from 'vuetify'
import Vuex, { ActionTree, Store } from 'vuex'

/*
 * Initial test application setup
 */
const app = new App()
let expressApp: express.Application

// Connects to the temporary test database
const dbName = 'test'
let dbConnect: Mongoose
let dbConnection: mongoose.Connection

// Creates and configures a local Vue instance
let vuetify: Vuetify
let div: HTMLDivElement
const localVue = createLocalVue()
let state: any
let actions: ActionTree<any, any>
let store: Store<any>
localVue.use(Vuex)

// Mocks axios functions
jest.mock('axios', () => ({
  post: (_url: string, _body: Record<string, string>) => new Promise((resolve, reject) => {
    // A list of fake invalid usernames
    const invalidUsername = ['Bob_Smith', 'NoobMaster69']
    // A list of fake invalid emails
    const invalidEmail = ['bob_smith@mail.com', 'noobmaster69@mail.com']

    // If the provided username is invalid, return an error
    if (_body.username in invalidUsername) {
      return reject(new Error(`Username ${_body.username} is already taken`))
    }

    // If the provided email is invalid, return an error
    if (_body.email in invalidEmail) {
      return reject(new Error('This email already has an account'))
    }

    resolve({
      data: _body,
      status: 200,
      statusText: 'OK'
    })
  })
}))

/*************************************
 * All user registration related tests
 *************************************/
describe('User Registration', () => {
  beforeAll(async () => {
    dbConnect = await mongoose.connect(`mongodb://localhost/${dbName}`, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    dbConnection = dbConnect.connection
  })

  beforeEach(async () => {
    expressApp = await app.expressSetup()
    vuetify = new Vuetify()
    div = document.createElement('div')

    if (document.body) {
      document.body.appendChild(div)
    }

    state = {
      status: {
        loggedIn: false,
        registering: false
      },
      user: null
    }

    actions = {
      register: jest.fn()
    }

    store = new Vuex.Store({
      modules: {
        account: {
          namespaced: true,
          state,
          actions
        }
      }
    })
  })

  afterAll(async () => {
    // Clear all collections in the database after tests are done
    const collections = Object.keys(dbConnection.collections)
    collections.forEach(async (collectionName: string) => {
      const collection = dbConnection.collection(collectionName)
      await collection.deleteMany({})
    })
  })

  it('POST /users/register', async (done) => {
    const user = {
      name: {
        firstName: 'John',
        lastName: 'Doe'
      },
      username: 'John_Doe',
      email: 'john_doe@mail.com',
      password: 'p455w0rd'
    }

    const result = await request(expressApp).post('/users/register').send(user)

    expect(!result.error)
    // Makes sure it returns a user
    expect(result.text).toMatch('user')
    expect(result.status).toEqual(200)

    const findUser = await dbConnection.collection('users').findOne({ email: user.email })
    expect(findUser)
    // The password should be hashed
    expect(findUser.password).not.toEqual('p455w0rd')

    done()
  })

  it('Vue component should have a valid registration form', async () => {
    // Mounts the component
    const wrapper = mount(Register, {
      store,
      localVue,
      vuetify,
      attachTo: div
    })

    // Get the elements that need to be filled
    const firstName = wrapper.find('input#firstNameInput')
    const lastName = wrapper.find('input#lastNameInput')
    const email = wrapper.find('input#emailInput')
    const username = wrapper.find('input#usernameInput')
    const password = wrapper.find('input#passwordInput')
    const confirmPassword = wrapper.find('input#confirmPasswordInput')
    // Fill those elements with valid user info
    firstName.setValue('Bob')
    lastName.setValue('Smith')
    email.setValue('bob_smith@mail.com')
    username.setValue('Bob_Smith')
    password.setValue('secretPassword')
    confirmPassword.setValue('secretPassword')

    await wrapper.find('button#submitBtn').trigger('click')

    expect(actions.register).toHaveBeenCalled()
  })
})
