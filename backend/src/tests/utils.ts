import {Knex} from 'knex'
import {useOrCreateTransaction} from '../db/db'

export const withTempTransaction = <R>(
  f: (trx: Knex.Transaction) => Promise<R>,
) => {
  return useOrCreateTransaction(undefined, async (trx) => {
    await f(trx)
    await trx.rollback()
  })
}
