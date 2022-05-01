/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {Endpoint} from '../../http/endpoint'
import {createUser, createUserInputSchema} from '../actions/createUser'
import {serializeUser} from '../actions/serializeUser'

export const createUserEndpoint: Endpoint<any, any, any> = {
  method: 'post',
  path: '/users',
  requireAuth: true,
  validation: {
    body: createUserInputSchema,
  },
  handler: async ({body, user: authedUser}) => {
    const user = await createUser(body, {as: {user: authedUser}})
    const serializedEntity = await serializeUser(user, {as: {user: authedUser}})
    return serializedEntity
  },
}
