/* eslint-disable import/first */
/* eslint-disable import/newline-after-import */
/* eslint-disable @typescript-eslint/no-floating-promises */
import dotenv from 'dotenv'
dotenv.config()

import {db} from '../db/db'
import {dropAllTables} from '../db/utils'

// eslint-disable-next-line prettier/prettier
(async () => {
  await dropAllTables(db)
  process.exit(0)
})()
