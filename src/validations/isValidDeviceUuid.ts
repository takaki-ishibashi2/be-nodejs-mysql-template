import { DEVICE_UUID_LENGTH } from '../constans'

export const isValidDeviceUuid = (uuid: string) => {
  if (
    uuid
    && typeof uuid !== 'undefined'
    && uuid.length === DEVICE_UUID_LENGTH
  ) {
    return true
  }
  return false
}