import { App } from '@/../server/setup'
import Register from '@/components/register.vue'
import { createLocalVue, mount, Wrapper } from '@vue/test-utils'
import express from 'express'
import mongoose, { Mongoose } from 'mongoose'
import request from 'supertest'
import Vuetify from 'vuetify'
import axios from 'axios'
import { UserInterface } from '@/../server/models/users'

/*************************************
 * All user registration related tests
 *************************************/
describe('User registration API endpoint', () => {
  const app = new App()
  let express: express.Application

  const dbName = 'test'
  let dbConnect: Mongoose
  let dbConnection: mongoose.Connection

  beforeAll(async () => {
    // Connects to the temporary test database
    dbConnect = await mongoose.connect(`mongodb://localhost/${dbName}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    dbConnection = dbConnect.connection
  })

  beforeEach(async () => {
    express = await app.expressSetup()
  })

  afterEach(async () => {
    // Clear all collections in the database after tests are done
    const collections = Object.keys(dbConnection.collections)
    collections.forEach(async (collectionName: string) => {
      const collection = dbConnection.collection(collectionName)
      await collection.deleteMany({})
    })
  })

  it('POST /users/register', async (done) => {
    const result = await request(express).post('/users/register').send({
      name: {
        firstName: 'John',
        lastName: 'Doe'
      },
      username: 'JohnDoe',
      email: 'john.doe@mail.com',
      password: 'p455w0rd'
    })

    expect(!result.error)
    // Makes sure it returns a user
    expect(result.text).toMatch('user')
    expect(result.status).toEqual(200)

    const user = await dbConnection.collection('users').findOne({ email: 'john.doe@mail.com' })
    expect(user)
    // The password should be hashed
    expect(user.password).not.toEqual('p455w0rd')

    done()
  })
})

/*********************************
 * User registration Vue component
 *********************************/
describe('User registration Vue component', () => {
  const localVue = createLocalVue()
  let vuetify: Vuetify
  let wrapper: Wrapper<Vue>

  jest.mock('axios', () => ({
    post: (_url: string, _body: Record<string, string>) => new Promise((resolve, reject) => {
      if (!_body.name) {
        return reject
      }
    })
  }))

  beforeEach(() => {
    vuetify = new Vuetify()

    const elem = document.createElement('div')
    if (document.body) {
      document.body.appendChild(elem)
    }
    wrapper = mount(Register, {
      localVue,
      vuetify,
      attachTo: elem
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('should have a valid registration form', async () => {
    await wrapper.find('button#submitBtn').trigger('click')

    expect(axios.post).toHaveBeenCalledTimes(1)
    expect(axios.post).toHaveBeenCalledWith('users/register')
  })
})
