import * as express from 'express'
import * as validations from '../validations'
import * as database from '../database'
import * as modules from '../modules'
import { logger } from '../logger'
import { config } from '../config'
import { DEVICE_ROUTE_PATH } from '../constans'
import { NextFunction } from 'express';

export const deviceRoute = (server: express.Application) => {
  server.route(`${DEVICE_ROUTE_PATH}`)
    .post((req: express.Request, res: express.Response, next: express.NextFunction) => {
      try {
        logger.info(`POST for '${DEVICE_ROUTE_PATH}'`)
        if (validations.isValidApiKey(req)) {
          const validated = validations.validateRequestBodyOfPostingDevice(req.body)

          if(!validations.isValidDeviceUuid(validated.uuid)) {
            return modules.sendErrorMessage(res, 400, 'Bad request')
          } else {
            database.insertOrUpdateDevice(validated.uuid, validated.model, validated.os, validated.date)
              .then(() => { return modules.sendSuccessMessage(res, 200, '') })
              .catch((err) => {
                logger.error(`Issue handling ${DEVICE_ROUTE_PATH}`, err)
                return modules.sendErrorMessage(res, 500, '')
              })
          }
        } else {
          return modules.sendErrorMessage(res, 403, 'Access not allowed')
        }
      } catch (err) {
        logger.error(`Issue handling ${DEVICE_ROUTE_PATH}`, err, req.headers, req.body);
        return modules.sendErrorMessage(res, 400, 'Bad request')
      }
    })
    .get((req: express.Request, res: express.Response, next: express.NextFunction) => {
      try {
        logger.info(`GET for '${DEVICE_ROUTE_PATH}'`)
        if (validations.isValidApiKey(req)) {
          const validated = validations.validateRequestBodyOfGettingDevice(req.body)

          if (!validations.isValidDeviceUuid(validated.uuid)) {
            return modules.sendErrorMessage(res, 400, 'Bad request')
          } else {
            database.selectDevice(validated.uuid)
              .then(result => {
                if (!Array.isArray(result) || result.length == 0) {
                  return modules.sendErrorMessage(res, 400, 'Bad request')
                } else {
                  return modules.sendSuccessMessage(res, 200, JSON.stringify(result))
                }
              })
              .catch(err => {
                return modules.sendErrorMessage(res, 500, 'Internal error')
              })
          }
        } else {
          return modules.sendErrorMessage(res, 403, 'Access not allowed')
        }
      } catch (err) {
        logger.error(`Issue handling ${DEVICE_ROUTE_PATH}`, err, req.headers, req.body)
        return modules.sendErrorMessage(res, 403, 'Access not allowed')
      }
    })
    .delete((req: express.Request, res: express.Response, next: NextFunction) => {
      const uuid = req.body.uuid
      database.removeDevice(uuid)
        .then(() => { return modules.sendSuccessMessage(res, 200, '')})
        .catch((err) => {
          logger.error(`Issue handling ${DEVICE_ROUTE_PATH}`, err)
          return modules.sendErrorMessage(res, 500, 'Failed to delete device information')
        })
    })
}
