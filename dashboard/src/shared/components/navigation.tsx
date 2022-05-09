/* eslint-disable react/display-name */
import Link from 'next/link'
import {useRouter} from 'next/router'
import {Menu} from 'semantic-ui-react'
import {Container} from './container'

export const Navigation = () => {
  const router = useRouter()

  return (
    <Menu secondary pointing>
      <Container>
        <Link href="/" passHref>
          <Menu.Item header>Storybook Academy</Menu.Item>
        </Link>
        {/* <Menu.Menu position="right">
          <Link passHref href="/sign-in">
            <Menu.Item name="Sign in" active={router.pathname === '/sign-in'} />
          </Link>
          <Link href="/sign-up" passHref>
            <Menu.Item name="Sign up" active={router.pathname === '/sign-up'} />
          </Link>
        </Menu.Menu> */}
      </Container>
    </Menu>
  )
}
