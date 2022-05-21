/* eslint-disable react/display-name */
import Link from 'next/link'
import {useRouter} from 'next/router'
import {Menu} from 'semantic-ui-react'
import {Button} from './button'
import {Container} from './container'

export const Navigation = () => {
  const router = useRouter()

  const menuItemStyle = {
    alignSelf: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: 500,
  }

  return (
    <Menu secondary pointing style={{backgroundColor: '#4D7298'}}>
      <Container>
        <Link href="/" passHref>
          <Menu.Item style={menuItemStyle}>Storybook Academy</Menu.Item>
        </Link>
        <Menu.Menu position="right">
          <Link href="mailto:m_lemonius@breakingnew.org" passHref>
            <Menu.Item style={menuItemStyle} name="Contact us">
              Contact us
            </Menu.Item>
          </Link>
          <Link passHref href="/sign-in">
            <Button
              style={{
                ...menuItemStyle,
                margin: 10,
                padding: '0px 15px',
                backgroundColor: '#FF9C60',
              }}
            >
              <Menu.Item name="Sign in" style={{color: 'white'}} />
            </Button>
          </Link>
        </Menu.Menu>
      </Container>
    </Menu>
  )
}
