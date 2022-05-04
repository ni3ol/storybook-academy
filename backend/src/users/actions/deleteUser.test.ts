import test from 'ava'
import {withTempTransaction} from '../../tests/utils'
import {createUser} from './createUser'
import {deleteUser} from './deleteUser'
import {getUsers} from './getUsers'

test('deleteUser deletes user', async (t) => {
  //  await withTempTransaction(async (trx) => {
  // const user = await createUser(
  //   {
  //     emailAddress: 'user@app.com',
  //     firstName: 'Normal',
  //     lastName: 'User',
  //     password: '123',
  //   },
  //   {trx, skipAuth: true},
  // )
  // const users = await getUsers({trx, skipAuth: true})
  // t.is(users.length, 1)
  // t.truthy(users[0].id)
  // t.is(users[0].emailAddress, 'user@app.com')
  // await deleteUser(user.id, {trx, skipAuth: true})
  // const usersAfterDelete = await getUsers({trx, skipAuth: true})
  // t.is(usersAfterDelete.length, 0)
  //  })
})
