import Link from 'next/link'
import {Button} from '../src/shared/components/button'
import {Container} from '../src/shared/components/container'

export default function Home() {
  return (
    <Container>
      <div
        style={{
          display: 'flex',
          minHeight: 'calc(90vh - 90px)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div>
          <h1 style={{fontSize: '50px', padding: 28}}>
            Welcome to Storybook Academy
          </h1>
          <div style={{textAlign: 'center'}}>
            <Link href="/sign-up" passHref>
              <Button>Get started</Button>
            </Link>
          </div>
        </div>
      </div>
    </Container>
  )
}
