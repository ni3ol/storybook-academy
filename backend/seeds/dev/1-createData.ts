import {createClass} from '../../src/classes/actions/createClass'
import {createSchool} from '../../src/schools/actions/createSchool'
import {createUser} from '../../src/users/actions/createUser'
import {UserRole} from '../../src/users/model'

export async function seed(): Promise<void> {
  const bishops = await createSchool(
    {
      name: 'Bishops',
    },
    {skipAuth: true},
  )
  const herschel = await createSchool(
    {
      name: 'Herschel',
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
      emailAddress: 'administrator@app.com',
      firstName: 'George',
      lastName: 'Administrator',
      password: '123',
      role: UserRole.Administrator,
    },
    {skipAuth: true},
  )
  const bishopsEducator = await createUser(
    {
      emailAddress: 'bisheducator@app.com',
      firstName: 'Nicol',
      lastName: 'Educator',
      password: '123',
      role: UserRole.Educator,
      schoolId: bishops.id,
    },
    {skipAuth: true},
  )
  const herschelEducator = await createUser(
    {
      emailAddress: 'hersheducator@app.com',
      firstName: 'Jason',
      lastName: 'Educator',
      password: '123',
      role: UserRole.Educator,
      schoolId: herschel.id,
    },
    {skipAuth: true},
  )
  const class4a = await createClass(
    {
      name: '4a',
      schoolId: bishops.id,
      password: '123',
      educatorId: bishopsEducator.id,
    },
    {skipAuth: true},
  )
  const class4b = await createClass(
    {
      name: '6b',
      schoolId: herschel.id,
      password: '123',
      educatorId: herschelEducator.id,
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
      schoolId: bishops.id,
      role: UserRole.Child,
      classId: class4a.id,
    },
    {skipAuth: true},
  )
  await createUser(
    {
      emailAddress: 'child2@app.com',
      username: 'child123',
      firstName: 'Jasssoonn',
      lastName: 'Child',
      password: '123',
      schoolId: herschel.id,
      role: UserRole.Child,
      classId: class4b.id,
    },
    {skipAuth: true},
  )
}
