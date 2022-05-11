import {Button} from 'semantic-ui-react'
import {DataTable} from '../../shared/components/dataTable'
import {User} from '../model'
import NextLink from 'next/link'
import {usePromise} from '../../shared/hooks'
import {getSchools} from '../../schools/actions/getSchools'

export const UsersTable = ({
  rows,
  authToken,
}: {
  rows: User[]
  authToken: string
}) => {
  const schoolsAction = usePromise(() => {
    return getSchools({authToken: authToken})
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
        {
          key: 'school',
          title: 'School',
          resolve: (user) =>
            schools.find((school) => school.id === user.schoolId)?.name,
        },
        {
          key: 'role',
          title: 'Role',
          resolve: (user) => user.role,
        },
        {
          key: 'email',
          title: 'Email',
          resolve: (user) => user.emailAddress,
        },
        {
          key: 'username',
          title: 'Username',
          resolve: (user) => user.username,
        },
      ]}
    />
  )
}
