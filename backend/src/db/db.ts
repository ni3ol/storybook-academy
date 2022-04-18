import knex, {Knex} from 'knex'
import {parseISO} from 'date-fns'
import {parse} from 'pg-connection-string'
import {types} from 'pg'
import {requireEnvVar} from '../shared/utils'

// Convert db dates to UTC, not local time.
const TIMESTAMP_OID = 1114
types.setTypeParser(TIMESTAMP_OID, (val) => {
  const date = parseISO(`${val}+00:00`)
  return date
})

const databaseUri = requireEnvVar('DATABASE_URI')

const postgresConfig = parse(databaseUri)

export const config: Knex.Config = {
  client: 'pg',
  connection: {
    ...(postgresConfig as any),
    timezone: 'Etc/UTC',
  },
  migrations: {
    tableName: 'migrations',
  },
  seeds: {
    directory: './seeds/dev',
  },
}

export const db = knex(config)

export const useOrCreateTransaction = <T>(
  trx: Knex.Transaction | undefined,
  f: (trx: Knex.Transaction) => Promise<T>,
): Promise<T> => {
  if (trx) {
    return f(trx)
  }
  return db.transaction((newTrx) => f(newTrx))
}
