import {Knex} from 'knex'
import {db, useOrCreateTransaction} from '../../db/db'
import {AuthorizationError} from '../../errors'
import {User, UserRole} from '../model'

export const deleteUser = async (
  id: string,
  params?: {trx?: Knex.Transaction; as?: {user?: User}; skipAuth?: boolean},
) => {
  if (params?.skipAuth !== true && params?.as?.user?.role !== UserRole.Admin) {
    throw new AuthorizationError()
  }

  await useOrCreateTransaction(params?.trx, async (trx) => {
    await db('users').delete().where('id', '=', id).transacting(trx)
  })
}
