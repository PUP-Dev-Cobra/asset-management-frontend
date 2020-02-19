import React, { lazy, useEffect } from 'react'
import { Switch } from 'react-router-dom'
import { Menu, Button, Image, Dropdown, Icon } from 'semantic-ui-react'

import RouteWithSubroutes from 'Components/RouteWithSubRoutes'

import logoImg from 'Assets/logo.jpg'
import { userInfo } from 'Helpers/utils'

const LoadLedgerDashboard = lazy(() => import('Containers/Ledger'
  /* webpackChunkName: "Container-Ledger" */
))

const DashboardRoot = props => {
  const { user_type, email } = userInfo()
  const { match, routes, history, location } = props
  const { isExact } = match

  let redirect = null
  switch (match.path) {
    case '/member':
      redirect = '/member/create'
      break
    case '/loan':
      redirect = '/loan/create'
      break
    case '/user':
      redirect = '/user/create'
  }

  let showButton = false
  switch (location.pathname) {
    case '/member/list':
      showButton = true
      break
    case '/user/list':
      showButton = true
      break
    case '/loan/list':
      showButton = true
      break
    default:
      showButton = false
      break
  }

  const logoutHandle = () => {
    localStorage.clear()
    history.push('/')
  }

  /**
   * Check if there are tokens available. Redirect back to login if none
   */
  useEffect(() => {
    const token = localStorage.getItem('jwt_token', null)
    if (!token) {
      history.push('/')
    }
  }, [])

  return (
    <div className='flex flex-col h-screen'>
      <div className='block'>
        <Menu size='large'>
          <Menu.Item onClick={() => history.push('/')}>
            <Image src={logoImg} avatar />
          </Menu.Item>
          {
            (user_type === 'teller' || user_type === 'approver') &&
              <Menu.Item active={match.path === '/member'} link onClick={() => history.push('/member/list')}>
                Member
              </Menu.Item>
          }
          {
            (user_type === 'teller' || user_type === 'approver') &&
              <Menu.Item active={match.path === '/loan'} link onClick={() => history.push('/loan/list')}>
                Loans
              </Menu.Item>
          }
          {
            (user_type === 'teller' || user_type === 'approver') &&
              <Menu.Item active={match.path === '/ledger'} link onClick={() => history.push('/ledger')}>
              Ledger
              </Menu.Item>
          }
          {
            user_type === 'admin' &&
              <Menu.Item active={match.path === '/user'} link onClick={() => history.push('/user/list')}>
                User
              </Menu.Item>
          }
          <Menu.Menu position='right'>
            {
              showButton &&
              (
                user_type === 'teller' ||
                user_type === 'admin'
              ) &&
                <Menu.Item>
                  <Button primary onClick={() => history.push(redirect)}>
                    Create
                  </Button>
                </Menu.Item>
            }
            <Menu.Item>
              <Dropdown
                icon={null}
                trigger={
                  <div className='flex items-center'>
                    <div className='flex items-center'>
                      <Icon name='user circle' size='big' />
                    </div>
                    <ul className='flex flex-col list-none p-0 m-0'>
                      <li>{email}</li>
                      <li>{user_type}</li>
                    </ul>
                    <div>
                      <Icon name='dropdown' />
                    </div>
                  </div>
                }
              >
                <Dropdown.Menu>
                  <Dropdown.Item key={0}>
                    Account Profile
                  </Dropdown.Item>
                  <Dropdown.Item onClick={logoutHandle} key={1}>
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      </div>
      <div className='block flex-1 overflow-y-auto'>
        {
          isExact && match.path === '/ledger' &&
            <LoadLedgerDashboard />
        }
        {
          !isExact &&
            <Switch>
              {
                (routes.map((r, i) => <RouteWithSubroutes key={i} {...r} />))
              }
            </Switch>
        }
      </div>
    </div>
  )
}

export default DashboardRoot
