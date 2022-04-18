/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable import/first */
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({path: path.join(__dirname, '../../.env.test')})

import {db} from '../db/db'
import {dropAllTables} from '../db/utils'

// eslint-disable-next-line prettier/prettier
(async () => {
  await dropAllTables(db)
  await db.migrate.up()
  process.exit(0)
})()
