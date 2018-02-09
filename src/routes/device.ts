import * as express from 'express'
import * as validations from '../validations'
import * as database from '../database'
import * as modules from '../modules'
import { logger } from '../logger'
import { config } from '../config'
import { 
  DEVICE_ROUTE_PATH,
  DEVICE_PUT_PATH,
  PATCH_DEVICE_MODEL_PATH,
  PATCH_DEVICE_OS_PATH,
 } from '../constans'
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
              .then(() => { return modules.sendSuccessMessage(res, 200, 'Successfully') })
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
      try {
        logger.info(`DELETE for '${DEVICE_ROUTE_PATH}'`)
        if (validations.isValidApiKey(req)) {
          const validated = validations.validateRequestBodyOfDeletingDevice(req.body)
          if (!validations.isValidDeviceUuid(validated.uuid)) {
            return modules.sendSuccessMessage(res, 400, 'Bad request')
          } else {
            database.removeDevice(validated.uuid)
            .then(() => {
              return modules.sendSuccessMessage(res, 200, 'Successfully')
            })
            .catch((err) => {
              logger.error(`Issue handling ${DEVICE_ROUTE_PATH}`, err)
              return modules.sendErrorMessage(res, 500, 'Failed to delete device information')
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

  server.route(`${DEVICE_PUT_PATH}`)
    .put((req: express.Request, res: express.Response, next: NextFunction) => {
      try {
        logger.info(`PUT for '${DEVICE_PUT_PATH}'`)
        if (validations.isValidApiKey(req)) {
          const validated = validations.validatePatchRequestBodyOfDevice(req.params)

          if(!validations.isValidDeviceUuid(validated.uuid)) {
            return modules.sendErrorMessage(res, 400, 'Bad request')
          } else {
            database.updateDevice(validated.uuid, validated.model, validated.os, validated.date)
              .then(() => {
                return modules.sendSuccessMessage(res, 201, 'Successfully')
              })
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

  server.route(`${PATCH_DEVICE_MODEL_PATH}`)
    .patch((req: express.Request, res: express.Response) => {
      try {
        logger.info(`PATCH for '${PATCH_DEVICE_MODEL_PATH}'`)
        if (validations.isValidApiKey(req)) {
          const validated = validations.validatePatchRequestOfDeviceModel(req.params)
          if (!validations.isValidDeviceUuid(validated.uuid)) {
            return modules.sendErrorMessage(res, 400, 'Bad request')
          } else {
            database.updateDeviceModel(validated.uuid, validated.model, validated.date)
            .then(() => {
              return modules.sendSuccessMessage(res, 200, 'Successfully')
            })
            .catch(err => {
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

  server.route(`${PATCH_DEVICE_OS_PATH}`)
    .patch((req: express.Request, res: express.Response) => {
      try {
        logger.info(`PATCH for '${PATCH_DEVICE_OS_PATH}'`)
        if (validations.isValidApiKey(req)) {
          const validated = validations.validatePatchRequestOfDeviceOS(req.params)
          if (!validations.isValidDeviceUuid(validated.uuid)) {
            return modules.sendErrorMessage(res, 400, 'Bad request')
          } else {
            database.updateDeviceOS(validated.uuid, validated.os, validated.date)
              .then(() => {
                return modules.sendSuccessMessage(res, 200, 'Successfully')
              })
              .catch(err => {
                logger.error(`Issue handling ${DEVICE_ROUTE_PATH}`, err)
                return modules.sendErrorMessage(res, 500, '')
              })
          }
        } else {
          return modules.sendErrorMessage(res, 403, 'Access not allowed')
        }
      } catch (err) {
        logger.error(`Issue handling ${PATCH_DEVICE_OS_PATH}`, err, req.headers, req.body);
        return modules.sendErrorMessage(res, 400, 'Bad request')
      }
    })
}
