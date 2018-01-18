import * as express from 'express'
import { config } from '../config'
export const validateApiKey = (req: express.Request) => {
  const providedKey = req.header("X-API-Key")
  return providedKey === config.authKey
}