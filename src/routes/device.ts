import * as express from 'express'
import * as validations from '../validations'
import * as database from '../database'
import * as modules from '../modules'
import { logger } from '../logger'
import { config } from '../config'
import { DEVICE_ROUTE_PATH } from '../constans'
import { sendErrorMessage } from '../modules';

export const deviceRoute = (server: express.Application) => {
  const path = DEVICE_ROUTE_PATH

  server.route(`/v${config.apiVersion}${path}`)
    .post((req: express.Request, res: express.Response, next: express.NextFunction) => {
      try {
        if (validations.isValidApiKey(req)) {
          const validated = validations.validateRequestBodyOfPostingDevice(req.body)

          if(!validations.isValidDeviceUuid(validated.uuid)) {
            return modules.sendErrorMessage(res, 400, 'Bad request.')
          } else {
            database.insertOrUpdateDevice(validated.uuid, validated.model, validated.os, validated.date)
              .then(() => { return sendErrorMessage(res, 200, '') })
              .catch((err) => {
                logger.error(`Issue handling ${path}`, err)
                return modules.sendErrorMessage(res, 500, '')
              })
          }
        } else {
          return modules.sendErrorMessage(res, 403, 'Access not allowed.')
        }
      } catch (err) {
        logger.error(`Issue handling ${path}`, err, req.headers, req.body);
        return modules.sendErrorMessage(res, 400, 'Bad request.')
      }
    })
    .get((req: express.Request, res: express.Response, next: express.NextFunction) => {
      try {
        if (validations.isValidApiKey(req)) {
          const validated = validations.validateRequestBodyOfGettingDevice(req)

          if (!validations.isValidDeviceUuid(validated.uuid)) {
            return modules.sendErrorMessage(res, 400, 'Bad request.')
          } else {
            database.selectDevice(validated.uuid)
              .then(result => {
                if (!Array.isArray(result) || result.length == 0) {
                  return modules.sendErrorMessage(res, 400, 'Bad request.')
                } else {
                  return modules.sendSuccessMessage(res, 200, JSON.stringify(result))
                }
              })
              .catch(err => {
                return modules.sendErrorMessage(res, 500, 'Internal error.')
              })
          }
        } else {
          return modules.sendErrorMessage(res, 403, 'Access not allowed.')
        }
      } catch (err) {
        logger.error(`Issue handling ${path}`, err, req.headers, req.body)
        return modules.sendErrorMessage(res, 403, 'Access not allowed.')
      }
    })
}
