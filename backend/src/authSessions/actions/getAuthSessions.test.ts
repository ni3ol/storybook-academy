import test from 'ava'
import {getUuid} from '../../shared/utils'
import {withTempTransaction} from '../../tests/utils'
import {createAuthSession} from './createAuthSession'
import {getAuthSessions} from './getAuthSessions'

test('getAuthSessions gets authSessions', async (t) => {
  await withTempTransaction(async (trx) => {
    const authSession = await createAuthSession(
      {
        token: 'abc',
        userId: getUuid(),
      },
      {trx, skipAuth: true},
    )

    const authSessions = await getAuthSessions({trx, skipAuth: true})
    t.is(authSessions.length, 1)
    t.truthy(authSessions[0].id)
    t.is(authSessions[0].token, authSession.token)
  })
})

test('getAuthSessions gets authSessions filtered by token', async (t) => {
  await withTempTransaction(async (trx) => {
    const authSession = await createAuthSession(
      {
        token: 'abc',
        userId: getUuid(),
      },
      {trx, skipAuth: true},
    )
    await createAuthSession(
      {
        token: 'xyc',
        userId: getUuid(),
      },
      {trx, skipAuth: true},
    )

    const allAuthSessions = await getAuthSessions({
      trx,
      skipAuth: true,
    })
    t.is(allAuthSessions.length, 2)

    const filteredAuthSessions = await getAuthSessions({
      trx,
      skipAuth: true,
      filters: {token: 'abc'},
    })
    t.is(filteredAuthSessions.length, 1)
    t.truthy(filteredAuthSessions[0].id)
    t.is(filteredAuthSessions[0].token, authSession.token)
  })
})
