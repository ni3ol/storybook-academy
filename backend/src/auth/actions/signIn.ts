import {z} from 'zod'
import {createAuthSession} from '../../authSessions/actions/createAuthSession'
import {authSessionSchema} from '../../authSessions/model'
import {AuthenticationError} from '../../errors'
import {createCreateAction} from '../../shared/actionUtils'
import {getUsers} from '../../users/actions/getUsers'
import {userSchema} from '../../users/model'
import {checkPassword} from '../utils'

export const signInInputSchema = z.object({
  emailAddress: z.string().email().optional(),
  username: z.string().optional(),
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
  async (data) => {
    const filters = {
      emailAddress: data.emailAddress || undefined,
      username: data.username || undefined,
    }
    const [user] = await getUsers({
      filters,
      skipAuth: true,
    })

    if (
      !user ||
      !user.passwordHash ||
      !(await checkPassword(data.password, user.passwordHash))
    ) {
      throw new AuthenticationError('Invalid password.')
    }

    const authSession = await createAuthSession(
      {userId: user.id},
      {skipAuth: true},
    )

    return {user, authSession}
  },
)
