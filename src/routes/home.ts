import * as express from 'express'

export const homeRoute = (server: express.Application) => {
  server.route(`/`)
  .get((req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(200).end('Awesome!')
  })
}