import * as winston from "winston"
import { config } from "./config"

const levelValue = config.runEnv === 'production' ? 'warn' : 'debug'

export const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      "timestamp": true,
      "level": levelValue,
      })
  ],
})
