import * as escape from 'escape-html'

export const isValidRequestBodyOfGettingDevice = (reqBody: any) => {
  const requiredFields = [
    'uuid',
  ]

  requiredFields.forEach(field => {
    if (reqBody[field] === undefined) throw new Error(`Request does not contain required field: '${field}'.`)
  })

  return {
    uuid: escape(reqBody.uuid),
  }
}