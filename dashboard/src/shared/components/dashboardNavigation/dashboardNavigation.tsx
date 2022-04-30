import {useRouter} from 'next/router'
import {Button, Menu} from 'semantic-ui-react'
import {useState} from 'react'
import {useAuth} from '../../../auth/hooks'
import styles from './dashboardNavigation.module.css'
import {UserRole} from '../../../users/model'

export const DashboardNavigation = ({role}: {role: UserRole}) => {
  const initActiveItem = [UserRole.Admin, UserRole.Principal].includes(role)
    ? 'users'
    : 'students'
  const [activeItem, setActiveItem] = useState('dashboard')

  const router = useRouter()
  const auth = useAuth()

  const handleSignOut = () => {
    auth.deAuthenticate()
    router.push('/sign-in')
  }

  const handleClick = (item: string) => {
    setActiveItem(item)
    router.push(`/${item}`)
  }

  return (
    <Menu secondary style={{width: '100%'}}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          backgroundColor: '#4D7298',
          padding: '14px 110px',
          width: '100%',
          marginBottom: 30,
        }}
      >
        <div>
          <Menu.Item
            name="dashboard"
            active={activeItem === 'dashboard'}
            onClick={() => handleClick('/dashboard')}
            style={{color: 'white'}}
          >
            Storybook Academy - {role}
          </Menu.Item>
        </div>
        <div style={{display: 'flex'}}>
          {[UserRole.Teacher].includes(role) && (
            <Menu.Item
              name="students"
              active={activeItem === 'students'}
              onClick={() => handleClick('students')}
              style={{color: 'white'}}
            >
              Students
            </Menu.Item>
          )}
          {[UserRole.Principal, UserRole.Admin].includes(role) && (
            <Menu.Item
              name="users"
              active={activeItem === 'users'}
              onClick={() => handleClick('users')}
              style={{color: 'white'}}
            >
              Users
            </Menu.Item>
          )}
          {[UserRole.Principal, UserRole.Teacher, UserRole.Admin].includes(
            role,
          ) && (
            <Menu.Item
              name="learn-more"
              active={activeItem === 'learn-more'}
              onClick={() => handleClick('learn-more')}
              style={{color: 'white'}}
            >
              Learn more
            </Menu.Item>
          )}
          {[UserRole.Principal, UserRole.Admin].includes(role) && (
            <Menu.Item
              name="subscriptions"
              active={activeItem === 'subscriptions'}
              onClick={() => handleClick('subscriptions')}
              style={{color: 'white'}}
            >
              Subscriptions
            </Menu.Item>
          )}
          {[UserRole.Principal, UserRole.Teacher, UserRole.Admin].includes(
            role,
          ) && (
            <Menu.Item
              name="library"
              active={activeItem === 'library'}
              onClick={() => handleClick('library')}
              style={{color: 'white'}}
            >
              Library
            </Menu.Item>
          )}
          {[UserRole.Principal, UserRole.Admin].includes(role) && (
            <Menu.Item
              name="report"
              active={activeItem === 'report'}
              onClick={() => handleClick('report')}
              style={{color: 'white'}}
            >
              Report
            </Menu.Item>
          )}
          {[UserRole.Principal, UserRole.Teacher, UserRole.Admin].includes(
            role,
          ) && (
            <Menu.Item
              name="chat"
              active={activeItem === 'chat'}
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
