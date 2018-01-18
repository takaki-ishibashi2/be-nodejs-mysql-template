import * as express from 'express'
import * as escape from 'escape-html'

export const validateDevicePostRequestBody = (reqBody: any) => {
  const requiredFields = [
    'uuid',
    'model',
    'date',
    'os_name',
    'os_version',
  ]

  requiredFields.forEach(field => {
    if (reqBody[field] === undefined) throw new Error(`Request does not contain required field: '${field}'.`)
  })

  return {
    uuid: escape(reqBody.uuid),
    model: reqBody.model,
    date: reqBody.date,
    os: {
      name: reqBody.os_name,
      version: reqBody.os_version,
    }
  }
}