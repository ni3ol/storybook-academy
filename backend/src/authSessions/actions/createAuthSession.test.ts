import test from 'ava'
import {getUuid} from '../../shared/utils'
import {withTempTransaction} from '../../tests/utils'
import {createAuthSession} from './createAuthSession'

test('createAuthSession creates authSession', async (t) => {
  await withTempTransaction(async (trx) => {
    const authSession = await createAuthSession(
      {
        token: 'abc',
        userId: getUuid(),
      },
      {trx, skipAuth: true},
    )
    t.truthy(authSession.id)
    t.is(authSession.token, 'abc')
  })
})
