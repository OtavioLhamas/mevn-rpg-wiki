import HelloWorld from '@/components/hello-world.vue'
import { createLocalVue, mount } from '@vue/test-utils'
import express from 'express'
import request from 'supertest'
import Vuetify from 'vuetify'
import { App } from '@/../server/setup'

describe('HelloWorld.vue', () => {
  const localVue = createLocalVue()
  let vuetify: Vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it('renders props.msg when passed', () => {
    const msg = 'new message'
    const wrapper = mount(HelloWorld, {
      localVue,
      vuetify,
      propsData: {
        msg
      }
    })
    expect(wrapper.text()).toMatch(msg)
  })
})

describe('GET /', () => {
  const app = new App()
  let express: express.Application

  beforeEach(async () => {
    express = await app.expressSetup()
  })

  it('Home API Request', async () => {
    // When App is instantiated the constructor runs mongoSetup(), trying to mount MongoDB after the tests are done
    const result = await request(express).get('/')
    expect(result.body.title).toEqual('API Initialized')
    expect(result.status).toEqual(200)
  })
})
