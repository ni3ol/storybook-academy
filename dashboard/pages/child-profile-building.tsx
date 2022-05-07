import Image from 'next/image'
import Link from 'next/link'
import {RequireAuth} from '../src/auth/components/requireAuth'
import {Auth} from '../src/auth/hooks'
import {Button} from '../src/shared/components/button'
import {Container} from '../src/shared/components/container'
import {Header} from '../src/shared/components/header'
import {CreateChildProfileForm} from '../src/users/children/components/createChildProfileForm'
import Folly from '../src/shared/images/folly.svg'
import router from 'next/router'
import {UserRole} from '../src/users/model'

const ChildProfileBuilding = ({auth}: {auth: Auth}) => {
  return (
    <>
      <Container>
        <div
          style={{
            display: 'flex',
            minHeight: 'calc(90vh - 90px)',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Header>Hi there! I'm Folly 😄</Header>
          {/* <Image height={500} width={300} src={Folly} /> */}
          <Header>
            Before I show you my wonderful library, please could you give me
            some information about you?
          </Header>
          <CreateChildProfileForm user={auth.user} />
        </div>
      </Container>
    </>
  )
}

export default function ChildProfileBuildingPage() {
  return (
    <RequireAuth
      render={({auth}) => {
        if (auth.user.role === UserRole.Child && auth.user.profileCreated) {
          router.push('child-dashboard')
          return
        }
        if (auth.user.role !== UserRole.Child) {
          router.push('dashboard')
          return
        }
        return <ChildProfileBuilding auth={auth} />
      }}
    />
  )
}
