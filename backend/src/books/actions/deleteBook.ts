import {Knex} from 'knex'
import {db, useOrCreateTransaction} from '../../db/db'
import {AuthorizationError} from '../../errors'
import {User, UserRole} from '../../users/model'

export const deleteBook = async (
  id: string,
  params?: {trx?: Knex.Transaction; as?: {user?: User}; skipAuth?: boolean},
) => {
  if (params?.skipAuth !== true && params?.as?.user?.role !== UserRole.Admin) {
    throw new AuthorizationError()
  }

  await useOrCreateTransaction(params?.trx, async (trx) => {
    await db('books').delete().where('id', '=', id).transacting(trx)
  })
}
