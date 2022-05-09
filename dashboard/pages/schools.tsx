import {useState} from 'react'
import {RequireAuth} from '../src/auth/components/requireAuth'
import {DashboardNavigation} from '../src/shared/components/dashboardNavigation/dashboardNavigation'
import {Auth} from '../src/auth/hooks'
import {usePromise} from '../src/shared/hooks'
import {Container} from '../src/shared/components/container'
import {Button} from '../src/shared/components/button'
import {Header} from '../src/shared/components/header'
import {School} from '../src/schools/model'
import {getSchools} from '../src/schools/actions/getSchools'
import {SchoolsTable} from '../src/schools/components/schoolsTable'
import {CreateSchoolModal} from '../src/schools/components/createSchoolModal'

const Schools = ({auth}: {auth: Auth}) => {
  const [isCreateSchoolModalOpen, setIsCreateUserModalOpen] = useState(false)
  const [schoolToUpdate, setSchoolToUpdate] = useState<School | undefined>()
  const [schoolToDelete, setSchoolToDelete] = useState<School | undefined>()

  const action = usePromise(() => {
    return getSchools({authToken: auth.token})
  }, [])

  return (
    <>
      {isCreateSchoolModalOpen && (
        <CreateSchoolModal
          onClose={() => setIsCreateUserModalOpen(false)}
          onSchoolCreated={() => {
            action.execute()
            setIsCreateUserModalOpen(false)
          }}
        />
      )}
      <DashboardNavigation role={auth.user.role} />
      <Container>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Header as="h1">Schools</Header>
          <Button onClick={() => setIsCreateUserModalOpen(true)} primary>
            New school
          </Button>
        </div>
        <SchoolsTable
          onUpdateClick={(school) => setSchoolToUpdate(school)}
          onDeleteClick={(school) => setSchoolToDelete(school)}
          rows={action.result || []}
        />
      </Container>
    </>
  )
}

export default function SchoolsPage() {
  return (
    <RequireAuth
      render={({auth}) => {
        return <Schools auth={auth} />
      }}
    />
  )
}
