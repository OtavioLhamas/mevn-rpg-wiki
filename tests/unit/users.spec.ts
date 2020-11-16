import { assert } from 'chai'
// import app from '../../server/index'
import { UserController } from '../../server/controllers/users'
import 'mocha'

describe('UserController', () => {
  it('exists', () => {
    const usersControler: UserController = new UserController()
    assert.exists(usersControler.routes)
  })
})
