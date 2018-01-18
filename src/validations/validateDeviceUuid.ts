import { DEVICE_UUID_LENGTH } from '../constan'

export const validateDeviceUuid = (uuid: string) => {
  if (
    uuid
    && typeof uuid !== 'undefined'
    && uuid.length === DEVICE_UUID_LENGTH
  ) {
    return true
  }
  return false
}