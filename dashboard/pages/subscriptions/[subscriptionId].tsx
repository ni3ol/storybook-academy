/* eslint-disable jsx-a11y/aria-role */

import {RequireAuth} from '../../src/auth/components/requireAuth'
import {Auth} from '../../src/auth/hooks'
import {Container} from '../../src/shared/components/container'
import {DashboardNavigation} from '../../src/shared/components/dashboardNavigation/dashboardNavigation'

const Subscriptions = ({auth}: {auth: Auth}) => {
  return (
    <>
      <DashboardNavigation user={auth.user} />
      <Container>
        <div>Learn more here</div>
      </Container>
    </>
  )
}

export default function SubscriptionsPage() {
  return (
    <RequireAuth
      render={({auth}) => {
        return <Subscriptions auth={auth} />
      }}
    />
  )
}
