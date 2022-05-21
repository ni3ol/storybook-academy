import {z} from 'zod'
import {useOrCreateTransaction} from '../../db/db'
import {InvalidRequestError} from '../../errors'
import {getPasswordResetRequests} from '../../passwordResetRequests/actions/getPasswordResetRequests'
import {updatePasswordResetRequest} from '../../passwordResetRequests/actions/updatePasswordResetRequest'
import {getUsers} from '../../users/actions/getUsers'
import {resetPassword} from '../../users/actions/resetPassword'

export const setNewPasswordSchema = z.object({
  newPassword: z.string(),
  passwordResetRequestToken: z.string(),
})

type Data = z.infer<typeof setNewPasswordSchema>

export const setNewPassword = async ({data}: {data: Data}) => {
  return useOrCreateTransaction(undefined, async (trx) => {
    const [passwordResetRequest] = await getPasswordResetRequests({
      filters: {token: data.passwordResetRequestToken, usable: true},
      trx,
    })
    if (!passwordResetRequest) {
      throw new InvalidRequestError('Password reset request not found.')
    }

    const [user] = await getUsers({
      filters: {id: passwordResetRequest.userId},
      trx,
    })
    if (!user) {
      throw new InvalidRequestError('User not found.')
    }

    const updatedUser = await resetPassword({
      data: {userId: user.id, newPassword: data.newPassword},
      trx,
    })

    await updatePasswordResetRequest(
      passwordResetRequest.id,
      {usedOn: new Date()},
      {trx},
    )

    return updatedUser
  })
}
