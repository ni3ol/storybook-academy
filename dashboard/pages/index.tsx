import Link from 'next/link'
import {Grid} from 'semantic-ui-react'
import Image from 'next/image'
import {Button} from '../src/shared/components/button'
import {Container} from '../src/shared/components/container'
import {Navigation} from '../src/shared/components/navigation'
import Folly from '../public/folly.png'
import {Header} from '../src/shared/components/header'

export default function Home() {
  return (
    <>
      <Navigation />
      <Container>
        <div
          style={{
            display: 'flex',
            minHeight: 'calc(90vh - 90px)',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <Grid columns={2} centered>
            <Grid.Column>
              <Header as="h1" style={{fontSize: 60, marginTop: 40}}>
                A home for <span style={{color: '#FF9C60'}}>curious</span>{' '}
                children
              </Header>
              <p style={{fontSize: 20, lineHeight: 1.5}}>
                The world’s first peer-to-peer literacy platform where children
                from everywhere connect virtually to learn, read, grow, share,
                laugh, and experience a world outside of their own
              </p>
              <div style={{display: 'flex'}}>
                <Link passHref href="/sign-in">
                  <Button
                    size="huge"
                    style={{backgroundColor: '#FF9C60', color: 'white'}}
                  >
                    Sign in
                  </Button>
                </Link>
                <a href="mailto:m_lemonius@breakingnew.org">
                  <Button basic size="huge">
                    Contact us
                  </Button>
                </a>
              </div>
            </Grid.Column>
            <Grid.Column style={{textAlign: 'center'}}>
              <Image src={Folly} width={350} height={430} />
            </Grid.Column>
          </Grid>
        </div>
      </Container>
      <div
        style={{
          backgroundColor: '#C5E7E2',
          height: 100,
          position: 'fixed',
          bottom: 0,
          width: '100%',
          paddingTop: 40,
          textAlign: 'center',
        }}
      >
        ©2022 STORYBOOK ACADEMY - All Rights Reserved
      </div>
    </>
  )
}
