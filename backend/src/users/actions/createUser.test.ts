import test from 'ava'
import {withTempTransaction} from '../../tests/utils'
import {createUser} from './createUser'

test('createUser creates user', async (t) => {
  await withTempTransaction(async (trx) => {
    const user = await createUser(
      {
        emailAddress: 'user@app.com',
        firstName: 'Normal',
        lastName: 'User',
        password: '123',
      },
      {trx, skipAuth: true},
    )
    t.truthy(user.id)
    t.is(user.emailAddress, 'user@app.com')
    t.is(user.firstName, 'Normal')
    t.is(user.lastName, 'User')
  })
})
