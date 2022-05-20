import {z} from 'zod'
import {InvalidRequestError} from '../../errors'
import {getPasswordResetRequests} from '../../passwordResetRequests/actions/getPasswordResetRequests'
import {getUsers} from '../../users/actions/getUsers'
import {resetPassword} from '../../users/actions/resetPassword'

export const setNewPasswordSchema = z.object({
  newPassword: z.string(),
  passwordResetRequestToken: z.string(),
})

type Data = z.infer<typeof setNewPasswordSchema>

export const setNewPassword = async ({data}: {data: Data}) => {
  const [passwordResetRequest] = await getPasswordResetRequests({
    filters: {token: data.passwordResetRequestToken},
  })
  if (!passwordResetRequest) {
    throw new InvalidRequestError('Password reset request not found.')
  }

  const [user] = await getUsers({filters: {id: passwordResetRequest.userId}})
  if (!user) {
    throw new InvalidRequestError('User not found.')
  }

  const updatedUser = await resetPassword({
    data: {userId: user.id, newPassword: data.newPassword},
  })

  return updatedUser
}
