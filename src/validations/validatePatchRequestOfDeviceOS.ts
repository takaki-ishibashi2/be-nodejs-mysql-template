import * as escape from 'escape-html'

type IPatchRequestOfDeviceOS = {
  [index: string]: string,
  uuid: string,
  osName: string,
  osVersion: string,
}
export const validatePatchRequestOfDeviceOS = (reqParams: IPatchRequestOfDeviceOS) => {
  const requiredFields = [
    'uuid',
    'osName',
    'osVersion',
  ]

  requiredFields.forEach(field => {
    if (reqParams[field] === undefined) throw new Error(`Request does not contain required field: '${field}'`)
  })

  return {
    uuid: escape(reqParams.uuid),
    os: {
      name: reqParams.osName,
      version: reqParams.osVersion,
    },
    date: reqParams.modifiedDate,
  }
}