import { isNotEmptyString } from './isNotEmptyString'
import { isValidApiKey } from './isValidApiKey'
import { isValidDeviceUuid } from './isValidDeviceUuid'
import { validateRequestBodyOfDeletingDevice } from './validateRequestBodyOfDeletingDevice'
import { validateRequestBodyOfGettingDevice } from './validateRequestBodyOfGettingDevice'
import { validatePatchRequestBodyOfDevice} from './validatePatchRequestBodyOfDevice'
import { validateRequestBodyOfPostingDevice } from './validateRequestBodyOfPostingDevice'

export {
  isNotEmptyString,
  isValidApiKey,
  isValidDeviceUuid,
  validateRequestBodyOfDeletingDevice,
  validateRequestBodyOfGettingDevice,
  validatePatchRequestBodyOfDevice,
  validateRequestBodyOfPostingDevice,
}