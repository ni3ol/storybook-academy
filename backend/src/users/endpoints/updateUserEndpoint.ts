import {Endpoint} from '../../http/endpoint'
import {serializeUser} from '../actions/serializeUser'
import {updateUser, updateUserInputSchema} from '../actions/updateUser'

export const updateUserEndpoint: Endpoint<any, any, any> = {
  method: 'patch',
  path: '/user/:id',
  requireAuth: true,
  validation: {
    body: updateUserInputSchema,
  },
  handler: async ({body, user: authedUser, params}) => {
    const user = await updateUser(params.id, body, {
      as: {user: authedUser},
    })
    const serializedEntity = await serializeUser(user, {as: {user: authedUser}})
    return serializedEntity
  },
}
