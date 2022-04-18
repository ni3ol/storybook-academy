import test from 'ava'
import {withTempTransaction} from '../../tests/utils'
import {createUser} from './createUser'
import {updateUser} from './updateUser'

test('updateUser updates user', async (t) => {
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

    const updatedUser = await updateUser(
      user.id,
      {emailAddress: 'user@app2.com'},
      {trx, skipAuth: true},
    )
    t.is(updatedUser.id, user.id)
    t.is(updatedUser.emailAddress, 'user@app2.com')
  })
})
