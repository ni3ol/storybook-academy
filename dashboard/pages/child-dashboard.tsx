import {Container} from 'semantic-ui-react'
import {RequireAuth} from '../src/auth/components/requireAuth'
import {Auth} from '../src/auth/hooks'
import {DashboardNavigation} from '../src/shared/components/dashboardNavigation/dashboardNavigation'

const ChildDashboard = ({auth}: {auth: Auth}) => {
  return (
    <>
      <DashboardNavigation role={auth?.user?.role} />
      <Container>
        <div>Child dash</div>
      </Container>
    </>
  )
}

export default function ChildDashboardPage() {
  return (
    <RequireAuth
      render={({auth}) => {
        return <ChildDashboard auth={auth} />
      }}
    />
  )
}
