import {z} from 'zod'
import {createAuthSession} from '../../authSessions/actions/createAuthSession'
import {authSessionSchema} from '../../authSessions/model'
import {AuthenticationError} from '../../errors'
import {createCreateAction} from '../../shared/actionUtils'
import {getUsers} from '../../users/actions/getUsers'
import {userSchema} from '../../users/model'
import {checkPassword} from '../utils'

export const signInInputSchema = z.object({
  emailAddress: z.string().email(),
  password: z.string(),
})

export type SignInInputData = z.infer<typeof signInInputSchema>

export const signInOutputSchema = z.object({
  user: userSchema,
  authSession: authSessionSchema,
})

export const [signIn] = createCreateAction(
  {
    authorization: false,
    inputSchema: signInInputSchema,
    outputSchema: signInOutputSchema,
  },
  async ({emailAddress, password}) => {
    const [user] = await getUsers({filters: {emailAddress}, skipAuth: true})

    if (!user || !(await checkPassword(password, user.passwordHash))) {
      throw new AuthenticationError('Invalid email or password.')
    }

    const authSession = await createAuthSession(
      {userId: user.id},
      {skipAuth: true},
    )

    return {user, authSession}
  },
)
