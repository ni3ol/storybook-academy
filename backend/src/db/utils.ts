/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {Knex} from 'knex'

export const makeList = (items: string[]) =>
  `(${items.map((item) => `'${item}'`).join(', ')})`

export const dropAllTables = async (db: Knex) => {
  const result = await db.raw(`
    SELECT
      CONCAT(table_schema, '.', table_name) AS table_name
    FROM information_schema.tables
    WHERE table_schema IN ('public');
  `)

  const tableNames = result.rows.map((r: any) => r.table_name)
  if (tableNames.length > 0) {
    await db.raw(
      `DROP TABLE ${tableNames.map(() => '??').join(',')}`,
      tableNames,
    )
  }
}

export const truncateAllTables = async (db: Knex) => {
  const result = await db.raw(`
    SELECT
      CONCAT(table_schema, '.', table_name) AS table_name
    FROM information_schema.tables
    WHERE table_schema IN ('public')
      AND table_name NOT LIKE 'knex%'
      AND table_name NOT LIKE '%prisma%'
      AND table_name != 'pg_stat_statements';
  `)

  const tableNames = result.rows.map((r: any) => r.table_name)
  if (tableNames.length > 0) {
    await db.raw(
      `TRUNCATE TABLE ${tableNames.map(() => '??').join(',')}`,
      tableNames,
    )
  }
}
