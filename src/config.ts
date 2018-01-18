import * as dotenv from 'dotenv'
import { logger } from './logger'

dotenv.config()

type Config = {
  readonly runEnv: string,
  readonly authKey: string,
  readonly port: number,
  readonly databaseHost: string,
  readonly databasePort: number,
  readonly databaseUser: string,
  readonly databasePass: string,
  readonly databaseName: string,
  readonly apiVersion: number,
  readonly basicAuthUser: string,
  readonly basicAuthPass: string,
}

enum Environment {
  LOCAL = 'local',
  PRODUCTION = 'production',
}

function getStringValueOfRequiredEnvVariable(key: string): string {
  const value = process.env[key]
  if (value == undefined) throw new Error(`Required environment variable '${key}' was not found.`)

  if (value == '') logger.warn(`Required environment variable '${key}' is defined as empty string.`)

  return value
}

function getNumberValueOfRequiredEnvVariable(key: string): number {
  const stringValue = getStringValueOfRequiredEnvVariable(key)
  const numberValue = parseInt(stringValue, 10)

  if (!numberValue) throw new Error(`Required environment variable '${key}' is not of correct number format '${stringValue}'.`)

  return numberValue
}

const runEnvs: Record<Environment, () => Config> = {
  [Environment.LOCAL]: () => ({
    runEnv: Environment.LOCAL.toString(),
    authKey: '1234567890abcdefg',
    port: 8080,
    databaseHost: 'localhost',
    databasePort: 3306,
    databaseUser: 'root',
    databasePass: '',
    databaseName: 'rssi',
    apiVersion: 1,
    basicAuthUser: 'admin',
    basicAuthPass: 'admin',
  }),
  [Environment.PRODUCTION]: () => ({
    runEnv: Environment.PRODUCTION.toString(),
    authKey: getStringValueOfRequiredEnvVariable('AUTH_KEY'),
    port: getNumberValueOfRequiredEnvVariable('PORT'),
    databaseHost: getStringValueOfRequiredEnvVariable('DB_HOST'),
    databasePort: getNumberValueOfRequiredEnvVariable('DB_PORT'),
    databaseUser: getStringValueOfRequiredEnvVariable('DB_USR'),
    databasePass: getStringValueOfRequiredEnvVariable('DB_USR_PW'),
    databaseName: getStringValueOfRequiredEnvVariable('DB_NAME'),
    apiVersion: getNumberValueOfRequiredEnvVariable('API_VERSION'),
    basicAuthUser: getStringValueOfRequiredEnvVariable('AUTH_USER'),
    basicAuthPass: getStringValueOfRequiredEnvVariable('AUTH_PW'),
  })
}

function validateEnvironment(envString: string): Environment {
  switch(envString) {
    case 'local': return Environment.LOCAL
    case 'production': return Environment.PRODUCTION
  }
  throw new Error(`Unknow runtime environment '${envString}'`)
}

function getConfig(env: string) {
  return runEnvs[validateEnvironment(env)]()
}

export const config = getConfig(process.env.RUN_ENV || 'local')
