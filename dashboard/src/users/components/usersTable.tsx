import {Button} from 'semantic-ui-react'
import {DataTable} from '../../shared/components/dataTable'
import {User, UserRole} from '../model'
import NextLink from 'next/link'
import {usePromise} from '../../shared/hooks'
import {getSchools} from '../../schools/actions/getSchools'
import {Auth} from '../../auth/hooks'

export const UsersTable = ({rows, auth}: {rows: User[]; auth: Auth}) => {
  const schoolsAction = usePromise(() => {
    return getSchools({authToken: auth.authSession!.token})
  }, [])

  const schools = schoolsAction.result || []

  return (
    <DataTable
      rows={rows}
      headers={[
        {
          key: 'name',
          title: 'Name',
          resolve: (user) => {
            return (
              <NextLink passHref href={`/users/${user.id}`}>
                <a>
                  {user.firstName} {user.lastName}
                </a>
              </NextLink>
            )
          },
        },
        ...(auth.user.role !== UserRole.Teacher
          ? [
              {
                key: 'school',
                title: 'School',
                resolve: (user: User) =>
                  schools.find((school) => school.id === user.schoolId)?.name,
              },
              {
                key: 'role',
                title: 'Role',
                resolve: (user: User) =>
                  user.role.charAt(0).toUpperCase() + user.role.slice(1),
              },
            ]
          : []),
        // {
        //   key: 'email',
        //   title: 'Email',
        //   resolve: (user) => user.emailAddress,
        // },
        ...(auth.user.role === UserRole.Teacher
          ? [
              {
                key: 'username',
                title: 'Username',
                resolve: (user: User) => user.username,
              },
            ]
          : []),
      ]}
    />
  )
}
