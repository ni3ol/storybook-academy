import {getClasses} from '../../classes/actions/getClasses'
import {InvalidRequestError} from '../../errors'

export const pairAllChildren = async (classId: string) => {
  const [theClass] = await getClasses({filters: {id: classId}})
  if (!theClass) {
    throw new InvalidRequestError('Class not found')
  }
  if (!theClass.linkedClassId) {
    throw new InvalidRequestError('Class not linked to another class')
  }

  const [linkedClass] = await getClasses({
    filters: {id: theClass.linkedClassId},
  })
  if (!linkedClass) {
    throw new InvalidRequestError('Linked class not found')
  }
}
