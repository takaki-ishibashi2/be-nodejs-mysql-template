import * as express from 'express'

export const healthRoute = (server: express.Application) => {
  server.route('/health')
  .get((req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(200).end()
  })
}