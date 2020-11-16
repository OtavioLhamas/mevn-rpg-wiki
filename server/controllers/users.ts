import { UserModel } from '../models/users'
import express, { Request, Response } from 'express'

export class UserController {
  /**
   * routes
   */
  public routes (app: express.Application): void {
    app.post('/users/register', (req: Request, res: Response) => {
      const newUser = new UserModel({
        name: {
          firstName: req.body.name.firstName,
          lastName: req.body.name.lastName
        },
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      })

      newUser.save((error, user) => {
        if (error) { console.log(error) }
        res.status(200).send({ user })
      })
    })
  }
}
