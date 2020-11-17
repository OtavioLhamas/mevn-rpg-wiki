import { App } from '@/../server/setup'
import Register from '@/components/register.vue'
import { createLocalVue, mount, Wrapper } from '@vue/test-utils'
import express from 'express'
import mongoose, { Mongoose } from 'mongoose'
import request from 'supertest'
import Vuetify from 'vuetify'

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
