import * as express from 'express'
import * as escape from 'escape-html'

type IPatchRequestBody = {
  [idnex: string]: string,
  uuid: string,
  model: string,
  osName: string,
  osVersion: string,
  modifiedDate: string,
}

export const validatePatchRequestBodyOfDevice = (reqBody: IPatchRequestBody) => {
  const requiredFields = [
    'uuid',
    'model',
    'osName',
    'osVersion',
    'modifiedDate',
  ]

  requiredFields.forEach(field => {
    if (reqBody[field] === undefined) throw new Error(`Request does not contain required field: '${field}'.`)
  })

  return {
    uuid: escape(reqBody.uuid),
    model: reqBody.model,
    date: reqBody.modifiedDate,
    os: {
      name: reqBody.osName,
      version: reqBody.osVersion,
    },
  }
}