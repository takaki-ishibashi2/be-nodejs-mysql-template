import * as express from 'express'
import * as validations from '../validations'
import * as database from '../database'
import * as modules from '../modules'
import { logger } from '../logger'
import { config } from '../config'

export const deviceRoute = (server: express.Application) => {
  const path = '/device'

  server.route(`/v${config.apiVersion}${path}`)
    .post((req: express.Request, res: express.Response, next: express.NextFunction) => {
      try {
        if (validations.validateApiKey(req)) {
          const reqBoy = validations.validateDevicePostRequestBody(req.body)

          if(!validations.validateDeviceUuid(reqBoy.uuid)) {
            return modules.sendErrorMessage(res, 400, 'Bad request.')
          } else {
            database.insertDevice(reqBoy.uuid)
              .then(() => res.status(200).end())
              .catch((err) => {
                logger.error(`Issu handling ${path}`, err)
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
        if (validations.validateApiKey(req)) {
          const reqBoy = validations.validateDeviceGetRequestBody(req)

          if (!validations.validateDeviceUuid(reqBoy.uuid)) {
            return modules.sendErrorMessage(res, 400, 'Bad request.')
          } else {
            database.selectDevice(reqBoy.uuid)
              .then(result => {
                if (!Array.isArray(result) || result.length == 0) {
                  return modules.sendErrorMessage(res, 400, 'Bad request.')
                } else if (result.length > 1) {
                  return modules.sendErrorMessage(res, 400, 'Multiple results matching to UUID found.')
                } else {
                  return res.status(200).end(JSON.stringify(result))
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
