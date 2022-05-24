import {useState} from 'react'
import router from 'next/router'
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
          onSchoolCreated={async () => {
            await action.execute()
            setIsCreateUserModalOpen(false)
          }}
        />
      )}
      <DashboardNavigation user={auth.user} />
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
        if (auth.user.role === UserRole.Educator) {
          router.push('/students')
          return
        }
        if (auth.user.role === UserRole.Administrator) {
          router.push(`/schools/${auth.user.schoolId}`)
          return
        }

        return <Schools auth={auth} />
      }}
    />
  )
}
