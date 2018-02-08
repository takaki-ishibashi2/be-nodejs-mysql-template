import * as mysql from 'mysql'
import * as escape from 'escape-html'
import * as squel from 'squel'
import { logger } from './logger'
import { config } from './config'
import * as modules from './modules'

type IOS = {
  name: string,
  version: string,
}

const DEVICE_TBL_NAME = 'device'

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
        logger.error(`Failed to connect to database (Host: ${config.databaseHost}, Port: ${config.databasePort})`, err)
        if (conn) {
          conn.release()
        }
        reject(err)
      } else {
        conn.query(
          statement,
          values,
          (err: any, result: any, fields: any) => {
            if (err) {
              logger.error(`Failed to query database (Query: ${statement})`, err)
              conn.release()
              reject(err)
            } else {
              logger.debug(`Query OK: ${statement}`)
              conn.release()
              resolve(result)
            }
          })
      }
    })
  })
}

export const selectDevice = (uuid: string) => {
  const query = squel.select()
    .from(DEVICE_TBL_NAME)
    .where('UUID = ?', uuid)
    .toParam()

  return connectAndQueryWithValues(query.text, query.values)
}

export const fuzzySelectDevice = (uuid: string) => {
  const query = squel.select()
    .from(DEVICE_TBL_NAME)
    .where('UUID LIKE ?', `${uuid}%`)
    .toParam()
  
  return connectAndQueryWithValues(query.text, query.values)
}

export const insertDevice = (uuid: string, model: string, os: IOS,  date: string) => {
  const query = squel.insert()
    .into(DEVICE_TBL_NAME)
    .set('UUID', uuid)
    .set('MODEL', model)
    .set('OS_NAME', os.name)
    .set('OS_VERSION', os.version)
    .set('CLIENT_DATE', date)
    .toParam()

  logger.debug('=> Creating new device information')
  logger.debug(query.text)
  return connectAndQueryWithValues(query.text, query.values)
}

export const insertOrUpdateDevice = (uuid: string, model: string, os: IOS,  date: string) => {
  return selectDevice(uuid)
    .then((result: any[]) => {
      const hasExistingRow = (result.length > 0)
      
      if (hasExistingRow) {
        const query = squel.update()
        .table(DEVICE_TBL_NAME)
        .set('MODEL', model)
        .set('OS_NAME', os.name)
        .set('OS_VERSION', os.version)
        .set('CLIENT_DATE', date)
        .where('UUID = ?', uuid)
        .toParam()
      logger.debug('=> Updating existing device information')
      logger.debug(query.text)

      return connectAndQueryWithValues(query.text, query.values)
      } else {
      return insertDevice(uuid, model, os, date)
      }
    })
}

export const removeDevice = (uuid: string) => {
  const query = squel.delete()
    .from(DEVICE_TBL_NAME)
    .where('UUID = ?', uuid)
    .toParam()
    logger.debug('=> Deleting existing device information')
    logger.debug(query.text)

  return connectAndQueryWithValues(query.text, query.values)
}

export const updateDevice = (uuid: string, model: string, os: IOS, date: string) => {
  const query = squel.update()
    .table(DEVICE_TBL_NAME)
    .set('MODEL', model)
    .set('OS_NAME', os.name)
    .set('OS_VERSION', os.version)
    .set('CLIENT_DATE', date)
    .where('UUID = ?', uuid)
    .toParam()

    return connectAndQueryWithValues(query.text, query.values)
}