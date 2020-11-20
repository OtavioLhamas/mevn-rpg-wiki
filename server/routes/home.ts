import express, { Request, Response } from 'express'

export class Home {
  /**
   * Sets up the home routes
   *
   * @param {express.Application} The express application that the routes will be applied on
   */
  public routes (app: express.Application): void {
    // API home GET for testing purposes
    app.get('/', (req: Request, res: Response) => {
      res.status(200).json({
        title: 'API Initialized'
      })
    })
  }
}
