import {serializeAuthSession} from '../../authSessions/actions/serializeAuthSession'
import {Endpoint} from '../../http/endpoint'
import {serializeUser} from '../../users/actions/serializeUser'
import {signIn, SignInInputData, signInInputSchema} from '../actions/signIn'

export const signInEndpoint: Endpoint<SignInInputData, any, any> = {
  method: 'post',
  path: '/signIn',
  requireAuth: false,
  validation: {
    body: signInInputSchema,
  },
  handler: async ({body}) => {
    const {user, authSession} = await signIn(body as SignInInputData)

    return {
      user: serializeUser(user),
      authSession: serializeAuthSession(authSession),
    }
  },
}
