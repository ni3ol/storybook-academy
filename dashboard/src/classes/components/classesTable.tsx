import NextLink from 'next/link'
import {Auth, useAuth} from '../../auth/hooks'
import {getBooks} from '../../books/actions/getBooks'
import {getSchools} from '../../schools/actions/getSchools'
import {DataTable} from '../../shared/components/dataTable'
import {usePromise} from '../../shared/hooks'
import {getUsers} from '../../users/actions/getUsers'
import {Class} from '../model'

export const ClassesTable = ({
  rows,
  onUpdateClick,
  onDeleteClick,
  auth,
  basic,
}: {
  rows: Class[]
  onUpdateClick: (theClass: Class) => any
  onDeleteClick: (theClass: Class) => any
  basic: boolean
  auth: Auth
}) => {
  const getSchoolAction = usePromise(async () => {
    const schools = await getSchools({
      authToken: auth.authSession.token,
    })
    return schools
  }, [])
  const schools = getSchoolAction.result

  const getUsersAction = usePromise(() => {
    return getUsers({authToken: auth.token})
  }, [])
  const users = getUsersAction.result?.entities || []

  const getBooksAction = usePromise(() => {
    return getBooks({authToken: auth.token})
  }, [])
  const books = getBooksAction.result || []

  return (
    <DataTable
      rows={rows}
      headers={[
        {
          key: 'name',
          title: 'Class name',
          resolve: (theClass) => {
            return (
              <NextLink passHref href={`/classes/${theClass.id}`}>
                <a>{theClass.name}</a>
              </NextLink>
            )
          },
        },

        ...(!basic
          ? [
              {
                key: 'schoolId',
                title: 'School',
                resolve: (theClass) => {
                  return (
                    <NextLink passHref href={`/schools/${theClass.schoolId}`}>
                      <a>
                        {
                          schools?.find(
                            (school) => school.id === theClass.schoolId,
                          )?.name
                        }
                      </a>
                    </NextLink>
                  )
                },
              },
              {
                key: 'educatorId',
                title: 'Educator',
                resolve: (theClass) => {
                  return (
                    <NextLink passHref href={`/users/${theClass.educatorId}`}>
                      <a>
                        {
                          users?.find((user) => user.id === theClass.educatorId)
                            ?.firstName
                        }{' '}
                        {
                          users?.find((user) => user.id === theClass.educatorId)
                            ?.lastName
                        }
                      </a>
                    </NextLink>
                  )
                },
              },
              {
                key: 'bookId',
                title: 'Currently assigned book',
                resolve: (theClass) => {
                  return (
                    <NextLink passHref href={`/books/${theClass.bookId}`}>
                      <a>
                        {
                          books.find((book) => book.id === theClass.bookId)
                            ?.title
                        }
                      </a>
                    </NextLink>
                  )
                },
              },
            ]
          : []),
      ]}
    />
  )
}
