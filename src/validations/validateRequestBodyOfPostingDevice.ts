import * as express from 'express'
import * as escape from 'escape-html'

export const validateRequestBodyOfPostingDevice = (reqBody: any) => {
  const requiredFields = [
    'uuid',
    'model',
    'os',
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
      name: reqBody.os.name,
      version: reqBody.os.version,
    }
  }
}