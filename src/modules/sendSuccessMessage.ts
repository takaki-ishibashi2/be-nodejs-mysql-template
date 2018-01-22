import * as express from 'express'

export const sendSuccessMessage = (res: express.Response, code: number, msg: any): void => {
  res.status(code).end(JSON.stringify({
    msg: msg,
  }))
}