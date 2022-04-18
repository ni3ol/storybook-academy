import {createUser} from '../../src/users/actions/createUser'

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
}
