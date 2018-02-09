import * as escape from 'escape-html'

type IPatchRequestOfDeviceModel = {
  [index: string]: string,
  uuid: string,
  model: string,
  modifiedDate: string,
}

export const validatePatchRequestOfDeviceModel = (reqParams: IPatchRequestOfDeviceModel) => {
  const requiredField = [
    'uuid',
    'model',
    'modifiedDate',
  ]

  requiredField.forEach((field) => {
    if (reqParams[field] === undefined) throw new Error(`Request does not contain required field: '${field}'`)
  })

  return {
    uuid: escape(reqParams.uuid),
    model: reqParams.model,
    date: reqParams.modifiedDate,
  }
}