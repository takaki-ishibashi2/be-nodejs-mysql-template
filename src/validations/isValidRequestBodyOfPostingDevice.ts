import * as express from 'express'
import * as escape from 'escape-html'

export const isValidRequestBodyOfPostingDevice = (reqBody: any) => {
  const requiredFields = [
    'uuid',
    'model',
    'os_name',
    'os_version',
    'date',
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