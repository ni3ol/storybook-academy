import {useState} from 'react'
import {RequireAuth} from '../../src/auth/components/requireAuth'
import {DashboardNavigation} from '../../src/shared/components/dashboardNavigation/dashboardNavigation'
import {Auth} from '../../src/auth/hooks'
import {usePromise} from '../../src/shared/hooks'
import {Container} from '../../src/shared/components/container'
import {Button} from '../../src/shared/components/button'
import {Header} from '../../src/shared/components/header'
import {School} from '../../src/schools/model'
import {getSchools} from '../../src/schools/actions/getSchools'
import {SchoolsTable} from '../../src/schools/components/schoolsTable'
import {CreateSchoolModal} from '../../src/schools/components/createSchoolModal'
import {UserRole} from '../../src/users/model'
import router from 'next/router'
import {getClasses} from '../../src/classes/actions/getClasses'
import {ClassesTable} from '../../src/classes/components/classesTable'
import {CreateClassModal} from '../../src/classes/components/createClassModal'

const Classes = ({auth}: {auth: Auth}) => {
  const [isCreateClassModalOpen, setIsCreateClassModalOpen] = useState(false)
  // const [schoolToUpdate, setSchoolToUpdate] = useState<School | undefined>()
  // const [schoolToDelete, setSchoolToDelete] = useState<School | undefined>()

  const action = usePromise(() => {
    return getClasses({authToken: auth.token})
  }, [])

  return (
    <>
      {isCreateClassModalOpen && (
        <CreateClassModal
          onClose={() => setIsCreateClassModalOpen(false)}
          onClassCreated={() => {
            action.execute()
            setIsCreateClassModalOpen(false)
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
          <Header as="h1">Classes</Header>
          <Button onClick={() => setIsCreateClassModalOpen(true)} primary>
            New class
          </Button>
        </div>
        <ClassesTable
          onUpdateClick={() => {}}
          onDeleteClick={() => {}}
          rows={action.result || []}
        />
      </Container>
    </>
  )
}

export default function ClassesPage() {
  return (
    <RequireAuth
      render={({auth}) => {
        return <Classes auth={auth} />
      }}
    />
  )
}
