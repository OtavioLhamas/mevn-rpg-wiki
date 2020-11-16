import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import fs from 'fs'
import mongoose from 'mongoose'
import morgan from 'morgan'
import passport from 'passport'
import passportJwt from 'passport-jwt'
import config from './config/Config'
import { UserModel } from './models/users'
import { Home } from './routes/home'
import { UserController } from './controllers/users'

export class App {
  public express: express.Application
  public mongoUrl = 'mongodb://localhost/rpg-wiki'

  public routeHome: Home = new Home()
  public usersControler: UserController = new UserController()

  constructor () {
    this.passportSetup()

    this.express = express()
    this.expressSetup()

    this.routeHome.routes(this.express)
    this.usersControler.routes(this.express)

    this.mongoSetup()
  }

  private passportSetup (): void {
    // Prepares variables that will be needed later on
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

  private expressSetup (): void {
    this.express.use(morgan('combined'))

    this.express.use(bodyParser.json())
    this.express.use(bodyParser.urlencoded({ extended: false }))

    this.express.use(cors())

    this.express.use(passport.initialize())
  }

  private mongoSetup (): void {
    mongoose.connect(this.mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then(() => {
      console.log('Connection to MongoDB stablished')
    }, (err) => {
      console.error('MongoDB starting error:', err.stack)
      process.exit(1)
    })
  }
}
