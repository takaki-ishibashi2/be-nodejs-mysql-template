// TODO: api versioning
// TODO: db schema versioning

import * as mysql from 'mysql'
import * as escape from 'escape-html'
import * as squel from 'squel'
import { logger } from './logger'
import { config } from './config'
import { IOs } from './types'
import { DEVICE_ROUTE_PATH } from './constans'

const DEVICE_TBL_NAME = 'device'
const DEVICE_DESC_TBL_NAME = 'device_desc'

const pool = mysql.createPool({
  host: config.databaseHost,
  port: config.databasePort,
  user: config.databaseUser,
  password: config.databasePass,
  database: config.databaseName,
})

function connectAndQueryWithValues(statement: string, values: any[]) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      if (err) {
        logger.error(`Failed to connect to database (Host: ${config.databaseName}, Port: ${config.databasePort})`, err)
        if (conn) {
          conn.release()
        }
        reject(false)
      } else {
        conn.query(
          statement,
          values,
          (err: any, result: any, fields: any) => {
            if (err) {
              logger.error(`Failed to query database (Query: ${statement})`, err)
              conn.release()
              reject(false)
            } else {
              logger.debug(`Query OK: ${statement}`)
              conn.release()
              resolve(result)
            }
          }
        )
      }
    })
  })
}

export const selectDevice = (uuid: string) => {
  logger.info(`GET for '${DEVICE_ROUTE_PATH}'`)

  const query = squel.select()
    .from(DEVICE_TBL_NAME)
    .where('UUID = ?', uuid)
    .toParam()

  return connectAndQueryWithValues(query.text, query.values)
}

export const insertDevice = (uuid: string, model: string, os: IOs,  date: string) => {
  logger.info(`POST for '${DEVICE_ROUTE_PATH}'`)

  const query = squel.insert()
    .into(DEVICE_TBL_NAME)
    .set('UUID', uuid)
    .set('MODEL', model)
    .set('OS_NAME', os.name)
    .set('OS_VERSION', os.version)
    .set('DATE', date)
    .toParam()

  logger.debug('=> Creating new device')
  logger.debug(query.text)
  return connectAndQueryWithValues(query.text, query.values)
}

export const updateDeviceDesc = (uuid: string, model: string, os: IOs, date: string) => {
  logger.info(`UPDATE for /device/desc`)

  const query = squel.update()
    .table(DEVICE_DESC_TBL_NAME)
    .set('MODEL', model)
    .set('OS_NAME', os.name)
    .set('OS_VERSION', os.version)
    .set('DATE', date)
    .where('DEVICE_UUID = ?', uuid)
    .toParam()

    logger.debug(query.text)
    return connectAndQueryWithValues(query.text, query.values)
}