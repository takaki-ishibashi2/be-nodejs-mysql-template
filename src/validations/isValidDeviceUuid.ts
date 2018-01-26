import * as escape from 'escape-html'
import { DEVICE_UUID_LENGTH } from '../constans'

export const isValidDeviceUuid = (uuid: string) => {
  const escaped = escape(uuid)
  return (
    !!escaped
    && typeof escaped !== 'undefined'
    && escaped.length === DEVICE_UUID_LENGTH
  )
}