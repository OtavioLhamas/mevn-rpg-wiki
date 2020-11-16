import express, { Request, Response } from 'express'

export class Home {
  public routes (app: express.Application): void {
    // API home GET for testing purposes
    app.get('/', (req: Request, res: Response) => {
      res.status(200).json({
        title: 'API Initialized'
      })
    })
  }
}
