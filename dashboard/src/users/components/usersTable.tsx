import NextLink from 'next/link'
import {DataTable} from '../../shared/components/dataTable'
import {User, UserRole} from '../model'
import {usePromise} from '../../shared/hooks'
import {getSchools} from '../../schools/actions/getSchools'
import {Auth} from '../../auth/hooks'

export const UsersTable = ({rows, auth}: {rows: User[]; auth: Auth}) => {
  const schoolsAction = usePromise(() => {
    return getSchools({authToken: auth.authSession.token})
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
        ...(auth.user.role !== UserRole.Educator
          ? [
              {
                key: 'school',
                title: 'School',
                resolve: (user: User) => {
                  const school = schools.find((s) => s.id === user.schoolId)
                  return (
                    school && (
                      <NextLink passHref href={`/schools/${school?.id}`}>
                        {school?.name}
                      </NextLink>
                    )
                  )
                },
              },
              {
                key: 'role',
                title: 'Role',
                resolve: (user: User) =>
                  user.role.charAt(0).toUpperCase() + user.role.slice(1),
              },
            ]
          : []),

        ...(auth.user.role === UserRole.Educator
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
