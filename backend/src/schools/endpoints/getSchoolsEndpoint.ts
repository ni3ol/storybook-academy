/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {Endpoint} from '../../http/endpoint'
import {getSchools, schoolFiltersSchema} from '../actions/getSchools'
import {serializeSchool} from '../actions/serializeSchool'

export const getSchoolsEndpoint: Endpoint<any, any, any> = {
  method: 'get',
  path: '/schools',
  requireAuth: true,
  validation: {
    queryParams: schoolFiltersSchema,
  },
  handler: async ({queryParams, user: authedUser}) => {
    const schools = await getSchools({
      filters: queryParams,
      as: {user: authedUser},
    })
    const data = schools.map((school) =>
      serializeSchool(school, {as: {user: authedUser}}),
    )
    return {entities: data}
  },
}
