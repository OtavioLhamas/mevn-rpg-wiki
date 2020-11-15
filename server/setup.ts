import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import { Home } from './routes/home'
import mongoose from 'mongoose'

class App {
  public express: express.Application
  public routeHome: Home = new Home()
  public mongoUrl = 'mongodb://localhost/rpg-wiki'

  constructor () {
    this.express = express()
    this.config()
    this.routeHome.routes(this.express)
    this.mongoSetup()
  }

  private config (): void {
    this.express.use(morgan('combined'))
    this.express.use(bodyParser.json())
    this.express.use(bodyParser.urlencoded({ extended: false }))
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

export default new App().express
