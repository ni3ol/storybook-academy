# Issues

## 1. Adding username to user still requires email address to be present

Users are still required to have an email address even when a username is present. If I remove from seed data and run `npm run reset` I get the following error:

```bash
Error while executing "/Users/nicol/repos/storybook-academy/backend/seeds/dev/1-createData.ts" seed: Undefined binding(s) detected when compiling SELECT. Undefined column(s): [emailAddress] query: select * from "users" where "emailAddress" = ? order by "createdAt" desc
Error: Error while executing "/Users/nicol/repos/storybook-academy/backend/seeds/dev/1-createData.ts" seed: Undefined binding(s) detected when compiling SELECT. Undefined column(s): [emailAddress] query: select * from "users" where "emailAddress" = ? order by "createdAt" desc
    at Seeder._waterfallBatch (/Users/nicol/repos/storybook-academy/backend/node_modules/knex/lib/migrations/seed/Seeder.js:118:23)
Error: Undefined binding(s) detected when compiling SELECT. Undefined column(s): [emailAddress] query: select * from "users" where "emailAddress" = ? order by "createdAt" desc
    at QueryCompiler_PG.toSQL (/Users/nicol/repos/storybook-academy/backend/node_modules/knex/lib/query/querycompiler.js:110:13)
    at QueryBuilder_PostgreSQL.toSQL (/Users/nicol/repos/storybook-academy/backend/node_modules/knex/lib/query/querybuilder.js:83:44)
    at ensureConnectionCallback (/Users/nicol/repos/storybook-academy/backend/node_modules/knex/lib/execution/internal/ensure-connection-callback.js:4:30)
    at Runner.ensureConnection (/Users/nicol/repos/storybook-academy/backend/node_modules/knex/lib/execution/runner.js:307:20)
    at processTicksAndRejections (node:internal/process/task_queues:96:5)
    at async Runner.run (/Users/nicol/repos/storybook-academy/backend/node_modules/knex/lib/execution/runner.js:30:19)
```
