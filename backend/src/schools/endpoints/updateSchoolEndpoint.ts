/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {z} from 'zod'
import {Endpoint} from '../../http/endpoint'
import {serializeSchool} from '../actions/serializeSchool'
import {updateSchool, updateSchoolInputSchema} from '../actions/updateSchool'

export const updateSchoolEndpoint: Endpoint<any, any, any> = {
  method: 'patch',
  path: '/schools/:id',
  requireAuth: true,
  validation: {
    body: updateSchoolInputSchema,
    params: z.object({id: z.string().uuid()}),
  },
  handler: async ({body, user: authedUser, params}) => {
    const school = await updateSchool(params.id, body, {
      as: {user: authedUser},
    })
    const serializedEntity = await serializeSchool(school, {
      as: {user: authedUser},
    })
    return serializedEntity
  },
}
