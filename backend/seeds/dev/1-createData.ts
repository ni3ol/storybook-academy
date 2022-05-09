import {createUser} from '../../src/users/actions/createUser'
import {UserRole} from '../../src/users/model'

export async function seed(): Promise<void> {
  await createUser(
    {
      emailAddress: 'user@app.com',
      firstName: 'Normal',
      lastName: 'User',
      password: '123',
    },
    {skipAuth: true},
  )
  await createUser(
    {
      emailAddress: 'admin@app.com',
      firstName: 'Michele',
      lastName: 'Lemonius',
      password: '123',
      role: UserRole.Admin,
    },
    {skipAuth: true},
  )
  await createUser(
    {
      emailAddress: 'principal@app.com',
      firstName: 'George',
      lastName: 'Principal',
      password: '123',
      role: UserRole.Principal,
    },
    {skipAuth: true},
  )
  await createUser(
    {
      emailAddress: 'teacher@app.com',
      firstName: 'Nicol',
      lastName: 'Teacher',
      password: '123',
      role: UserRole.Teacher,
    },
    {skipAuth: true},
  )
  await createUser(
    {
      emailAddress: 'child@app.com',
      username: 'child123',
      firstName: 'Tuan',
      lastName: 'Child',
      password: '123',
      role: UserRole.Child,
    },
    {skipAuth: true},
  )
}
