/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {Endpoint} from '../../http/endpoint'
import {classFiltersSchema, getClasses} from '../actions/getSchools'
import {serializeClass} from '../actions/serializeClass'

export const getClassesEndpoint: Endpoint<any, any, any> = {
  method: 'get',
  path: '/classes',
  requireAuth: true,
  validation: {
    queryParams: classFiltersSchema,
  },
  handler: async ({queryParams, user: authedUser}) => {
    const classes = await getClasses({
      filters: queryParams,
      as: {user: authedUser},
    })
    const data = classes.map((theClass) =>
      serializeClass(theClass, {as: {user: authedUser}}),
    )
    return {entities: data}
  },
}
