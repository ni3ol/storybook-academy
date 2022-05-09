import {useRouter} from 'next/router'
import {Table} from 'semantic-ui-react'
import {RequireAuth} from '../../src/auth/components/requireAuth'
import {Auth} from '../../src/auth/hooks'
import {getSchools} from '../../src/schools/actions/getSchools'
import {Button} from '../../src/shared/components/button'
import {Container} from '../../src/shared/components/container'
import {DashboardNavigation} from '../../src/shared/components/dashboardNavigation/dashboardNavigation'
import {Header} from '../../src/shared/components/header'
import {usePromise} from '../../src/shared/hooks'
import {getUsers} from '../../src/users/actions/getUsers'
import {UsersTable} from '../../src/users/components/usersTable'

const SchoolPage = ({auth}: {auth: Auth}) => {
  const router = useRouter()
  const {schoolId} = router.query as {schoolId: string}

  const getSchoolAction = usePromise(async () => {
    const [school] = await getSchools({
      authToken: auth.authSession.token,
      filters: {id: schoolId},
    })
    return school
  }, [])
  const school = getSchoolAction.result

  const getUsersAction = usePromise(() => {
    return getUsers({authToken: auth.token, filters: {schoolId}})
  }, [])
  const users = getUsersAction.result || []

  return (
    <>
      <DashboardNavigation role={auth.user.role} />
      <Container>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Header as="h1">Schools / {school?.name}</Header>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Header style={{margin: 0}} as="h3">
            Details
          </Header>
          <Button basic primary>
            :
          </Button>
        </div>
        <Table definition>
          <Table.Body>
            <Table.Row>
              <Table.Cell>ID</Table.Cell>
              <Table.Cell>{schoolId}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Created at</Table.Cell>
              <Table.Cell>{school?.createdAt.toISOString()}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Name</Table.Cell>
              <Table.Cell>{school?.name}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
        <Header as="h3">Users</Header>
        <UsersTable rows={users} />
      </Container>
    </>
  )
}

export default function SchoolPageWrapper() {
  return (
    <RequireAuth
      render={({auth}) => {
        return <SchoolPage auth={auth} />
      }}
    />
  )
}
