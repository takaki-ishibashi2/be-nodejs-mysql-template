import * as express from 'express'

export const sendErrorMessage = (res: express.Response, code: number, msg: any): void => {
  res.status(code).end(JSON.stringify({
    msg: msg,
  }))
}