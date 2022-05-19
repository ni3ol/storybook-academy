import {useRouter} from 'next/router'
import {Button, Menu} from 'semantic-ui-react'
import {useAuth} from '../../../auth/hooks'
import styles from './dashboardNavigation.module.css'
import {User, UserRole} from '../../../users/model'
import {useEffect, useState} from 'react'
import {usePromise} from '../../hooks'
import Image from 'next/image'

export const DashboardNavigation = ({
  role,
  user,
}: {
  role: UserRole
  user?: User
}) => {
  const router = useRouter()
  const auth = useAuth()

  const handleSignOut = () => {
    auth.deAuthenticate()
    router.push('/sign-in')
  }

  const handleClick = (item: string) => {
    router.push(`/${item}`)
  }

  const [image, setImage] = useState()

  usePromise(async () => {
    if (!user) return
    const image = await import(`../../../../public/${user.profilePicture}.svg`)
    setImage(image)
    console.log('fuf', image)
  }, [user])

  return (
    <Menu secondary style={{width: '100%'}}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          backgroundColor: '#4D7298',
          padding: '14px 110px',
          width: '100%',
          alignItems: 'center',
          marginBottom: 30,
        }}
      >
        <div>
          <Menu.Item
            name="dashboard"
            onClick={() => handleClick('/dashboard')}
            style={{color: 'white'}}
          >
            Storybook Academy
          </Menu.Item>
        </div>
        <div style={{display: 'flex'}}>
          {UserRole.Child === role && (
            <Menu.Item
              name="profile"
              // onClick={() => handleClick('learn-more')}
              style={{color: 'white'}}
            >
              {image && <Image src={image} width={35} height={35} />}
              <span style={{marginLeft: 5}}>Hello, {user?.nickname}</span>
            </Menu.Item>
          )}
          {[UserRole.Principal, UserRole.Teacher, UserRole.Admin].includes(
            role,
          ) && (
            <Menu.Item
              name="learn-more"
              onClick={() => handleClick('learn-more')}
              style={{color: 'white'}}
            >
              Learn more
            </Menu.Item>
          )}
          {[UserRole.Principal, UserRole.Admin].includes(role) && (
            <Menu.Item
              name="users"
              active={router.pathname === '/users'}
              onClick={() => handleClick('users')}
              style={{color: 'white'}}
            >
              Users
            </Menu.Item>
          )}
          {[UserRole.Teacher].includes(role) && (
            <Menu.Item
              name="students"
              onClick={() => handleClick('students')}
              style={{color: 'white'}}
            >
              Students
            </Menu.Item>
          )}
          {[UserRole.Principal, UserRole.Teacher, UserRole.Admin].includes(
            role,
          ) && (
            <Menu.Item
              name="books"
              active={router.pathname === '/books'}
              onClick={() => handleClick('books')}
              style={{color: 'white'}}
            >
              Library
            </Menu.Item>
          )}
          {[UserRole.Principal, UserRole.Admin, UserRole.Teacher].includes(
            role,
          ) && (
            <Menu.Item
              name="classes"
              active={router.pathname === '/classes'}
              onClick={() => handleClick('classes')}
              style={{color: 'white'}}
            >
              Classes
            </Menu.Item>
          )}
          {[UserRole.Principal, UserRole.Admin].includes(role) && (
            <Menu.Item
              name="schools"
              active={router.pathname === '/schools'}
              onClick={() => handleClick('schools')}
              style={{color: 'white'}}
            >
              Schools
            </Menu.Item>
          )}
          {[UserRole.Principal, UserRole.Admin].includes(role) && (
            <Menu.Item
              name="subscriptions"
              onClick={() => handleClick('subscriptions')}
              style={{color: 'white'}}
            >
              Subscriptions
            </Menu.Item>
          )}
          {[UserRole.Principal, UserRole.Admin].includes(role) && (
            <Menu.Item
              name="report"
              onClick={() => handleClick('report')}
              style={{color: 'white'}}
            >
              Report
            </Menu.Item>
          )}
          {[
            UserRole.Principal,
            UserRole.Teacher,
            UserRole.Admin,
            UserRole.User,
          ].includes(role) && (
            <Menu.Item
              name="chat"
              onClick={() => handleClick('chat')}
              style={{color: 'white'}}
            >
              Chat
            </Menu.Item>
          )}
          <li className={styles.navigationItem} style={{marginRight: 30}}>
            <Button
              style={{backgroundColor: '#FF9C60'}}
              onClick={handleSignOut}
              primary
            >
              Log out
            </Button>
          </li>
        </div>
      </div>
    </Menu>
  )
}
