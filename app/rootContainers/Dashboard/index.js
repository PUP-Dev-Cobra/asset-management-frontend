import React, { lazy, useEffect, useState } from 'react'
import { Switch } from 'react-router-dom'
import { Menu, Button, Image, Dropdown } from 'semantic-ui-react'

import RouteWithSubroutes from 'Components/RouteWithSubRoutes'

import logoImg from 'Assets/logo.jpg'

const LoadLedgerDashboard = lazy(() => import('Containers/Ledger'
  /* webpackChunkName: "Container-Ledger" */
))

const DashboardRoot = props => {
  const [userType, setUserType] = useState(null)
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
    } else {
      const userType = localStorage.getItem('user_type')
      setUserType(userType)
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
            (userType === 'teller' || userType === 'approver') &&
              <Menu.Item active={match.path === '/member'} link onClick={() => history.push('/member/list')}>
                Member
              </Menu.Item>
          }
          {
            (userType === 'teller' || userType === 'approver') &&
              <Menu.Item active={match.path === '/loan'} link onClick={() => history.push('/loan/list')}>
                Loans
              </Menu.Item>
          }
          {
            (userType === 'teller' || userType === 'approver') &&
              <Menu.Item active={match.path === '/ledger'} link onClick={() => history.push('/ledger')}>
              Ledger
              </Menu.Item>
          }
          {
            userType === 'admin' &&
              <Menu.Item active={match.path === '/user'} link onClick={() => history.push('/user/list')}>
                User
              </Menu.Item>
          }
          <Menu.Menu position='right'>
            {
              showButton &&
                <Menu.Item>
                  <Button primary onClick={() => history.push(redirect)}>
                    Create
                  </Button>
                </Menu.Item>
            }
            <Menu.Item>
              <Dropdown text='Profile' simple>
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
