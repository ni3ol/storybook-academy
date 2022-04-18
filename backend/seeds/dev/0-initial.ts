import {Knex} from 'knex'
import {truncateAllTables} from '../../src/db/utils'

export async function seed(knex: Knex): Promise<void> {
  await truncateAllTables(knex)
}
