import {Knex} from 'knex'
import {z} from 'zod'
import {db, useOrCreateTransaction} from '../../db/db'
import {sendEmail} from '../../emails/actions/sendEmail'
import {InvalidRequestError} from '../../errors'
import {getUuid, utcNow} from '../../shared/utils'
import {getUsers} from '../../users/actions/getUsers'
import {User} from '../../users/model'
import {passwordResetRequestSchema} from '../model'

export const createPasswordResetRequestSchema = z.object({
  emailAddress: z.string(),
})

export type CreatePasswordResetRequestInputData = z.infer<
  typeof createPasswordResetRequestSchema
>

export const createPasswordResetRequest = async (
  data: CreatePasswordResetRequestInputData,
  params?: {trx?: Knex.Transaction; as?: {user?: User}; skipAuth?: boolean},
) => {
  const asOf = utcNow()

  const [user] = await getUsers({
    filters: {emailAddress: data.emailAddress},
    trx: params?.trx,
  })
  if (!user) {
    throw new InvalidRequestError('No such user found')
  }

  const parsedData = createPasswordResetRequestSchema.parse(data)
  const id = getUuid()
  const passwordResetRequest = passwordResetRequestSchema.parse({
    ...parsedData,
    id,
    createdAt: asOf,
    updatedAt: asOf,
    userId: user.id,
    token: getUuid(),
  })

  await useOrCreateTransaction(params?.trx, async (trx) => {
    await db('passwordResetRequests')
      .insert(passwordResetRequest)
      .returning('*')
      .transacting(trx)
  })

  if (user.emailAddress) {
    await sendEmail({
      data: {
        to: user.emailAddress,
        subject: 'Recover your account',
        body: `
      Hi ${user.firstName},

      We received a request to recover your Storybook-Academy account.

      If you initiated this request, please follow this link to reset your account password: http://localhost:3000/new-password?token=${passwordResetRequest.token}

      If you did not initiate this request, please ignore this email.

      Thank you.
    `,
      },
    })
  }

  return passwordResetRequest
}
