/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {Endpoint} from '../../http/endpoint'
import {createSchool, createSchoolInputSchema} from '../actions/createSchool'
import {serializeSchool} from '../actions/serializeSchool'

export const createSchoolEndpoint: Endpoint<any, any, any> = {
  method: 'post',
  path: '/schools',
  requireAuth: true,
  validation: {
    body: createSchoolInputSchema,
  },
  handler: async ({body, user: authedUser}) => {
    const school = await createSchool(
      {...body, createdByUserId: authedUser!.id},
      {as: {user: authedUser}},
    )
    const serializedEntity = await serializeSchool(school, {
      as: {user: authedUser},
    })
    return serializedEntity
  },
}
