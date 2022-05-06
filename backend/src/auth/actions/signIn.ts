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
  password: z.string(),
  username: z.string().optional(),
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
    let filterData = {}
    if (data.emailAddress) {
      filterData = {...filterData, emailAddress: data.emailAddress}
    }
    if (data.username) {
      filterData = {...filterData, username: data.username}
    }
    const [user] = await getUsers({
      filters: filterData,
      skipAuth: true,
    })

    if (!user || !(await checkPassword(data.password, user.passwordHash))) {
      throw new AuthenticationError('Invalid email or password.')
    }

    const authSession = await createAuthSession(
      {userId: user.id},
      {skipAuth: true},
    )

    return {user, authSession}
  },
)
