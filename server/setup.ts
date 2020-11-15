import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import { Home } from './routes/home'

class App {
  public express: express.Application
  public routeHome: Home = new Home()

  constructor () {
    this.express = express()
    this.config()
    this.routeHome.routes(this.express)
  }

  private config (): void {
    this.express.use(morgan('combined'))
    this.express.use(bodyParser.json())
    this.express.use(bodyParser.urlencoded({ extended: false }))
  }
}

export default new App().express
