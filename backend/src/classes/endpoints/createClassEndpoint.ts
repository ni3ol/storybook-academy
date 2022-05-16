import {Endpoint} from '../../http/endpoint'
import {
  createClass,
  CreateClassInputData,
  createClassInputSchema,
} from '../actions/createClass'
import {serializeClass} from '../actions/serializeClass'

export const createClassEndpoint: Endpoint<any, any, any> = {
  method: 'post',
  path: '/classes',
  requireAuth: true,
  validation: {
    body: createClassInputSchema,
  },
  handler: async ({body, user: authedUser}) => {
    const theClass = await createClass(
      {...(body as CreateClassInputData)},
      {as: {user: authedUser}},
    )
    const serializedEntity = await serializeClass(theClass, {
      as: {user: authedUser},
    })
    return serializedEntity
  },
}
