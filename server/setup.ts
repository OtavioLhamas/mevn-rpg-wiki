import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import passport from 'passport'
import passportJwt from 'passport-jwt'
import config from './config/Config'
import { UserModel } from './models/users'
import { Home } from './routes/home'
import { UserController } from './controllers/users'

export class App {
  public mongoUrl = 'mongodb://localhost/rpg-wiki'

  public routeHome: Home = new Home()
  public usersControler: UserController = new UserController()

  /**
   * Sets up the passport package
   */
  public async passportSetup (): Promise<void> {
    const ExtractJwt = passportJwt.ExtractJwt
    const JwtStrategy = passportJwt.Strategy
    const jwtOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
      secretOrKey: config.JWT_SECRET
    }

    passport.use(new JwtStrategy(jwtOptions, (payload, done) => {
      UserModel.findOne({ id: payload.sub }, (err, user) => {
        if (err) {
          return done(err, false)
        }

        if (user) {
          return done(null, user)
        } else {
          return done(null, false)
        }
      })
    }))
  }

  /**
   * Sets up the express app
   */
  public async expressSetup (): Promise<express.Application> {
    await this.passportSetup()

    const e = express()
    e.use(morgan('combined'))

    e.use(bodyParser.json())
    e.use(bodyParser.urlencoded({ extended: false }))

    e.use(cors())

    e.use(passport.initialize())

    this.routeHome.routes(e)
    this.usersControler.routes(e)

    return e
  }

  /**
   * Sets up MongoDB
   */
  public async mongoSetup (): Promise<void> {
    mongoose.connect(this.mongoUrl, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    }, (err) => {
      if (err) {
        console.log(err.message)
      } else {
        console.log('Connection to MongoDB stablished')
      }
    })
  }
}
