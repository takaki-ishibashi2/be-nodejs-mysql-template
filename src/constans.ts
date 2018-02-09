import { config } from './config'

export const DEVICE_UUID_LENGTH = 32
export const DEVICE_ROUTE_PATH = `/api/v${config.apiVersion}/devices`
export const DEVICE_PUT_PATH = `/api/v${config.apiVersion}/devices/:uuid/model/:model/os/:osName/:osVersion/:modifiedDate`
export const PATCH_DEVICE_MODEL_PATH = `/api/v${config.apiVersion}/devices/:uuid/model/:model/:modifiedDate`
export const PATCH_DEVICE_OS_PATH = `/api/v${config.apiVersion}/devices/:uuid/os/:osName/:osVersion/:modifiedDate`