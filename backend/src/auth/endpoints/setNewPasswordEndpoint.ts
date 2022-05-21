import {Endpoint} from '../../http/endpoint'
import {serializeUser} from '../../users/actions/serializeUser'
import {setNewPassword, setNewPasswordSchema} from '../actions/setNewPassword'

export const setNewPasswordEndpoint: Endpoint<any, any, any> = {
  method: 'post',
  path: '/setNewPassword',
  requireAuth: false,
  validation: {
    body: setNewPasswordSchema,
  },
  handler: async ({body}) => {
    const user = await setNewPassword({data: body})

    return serializeUser(user)
  },
}
