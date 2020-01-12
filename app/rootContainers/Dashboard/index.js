import React, { lazy } from 'react'
import { Switch } from 'react-router-dom'
import { Menu, Button, Image, Dropdown } from 'semantic-ui-react'
import styled from 'styled-components'

import RouteWithSubroutes from 'Components/RouteWithSubRoutes'

import logoImg from 'Assets/logo.jpg'

const LoadLedgerDashboard = lazy(() => import('Containers/Ledger' /* webpackChunkName: "Container-Home" */))

const Containers = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`

const MenuNavigation = styled.div`
  display: block;
`

const Content = styled.div`
  display: block;
  flex: 1;
  overflow-y: auto;
`

const DashboardRoot = props => {
  console.log(props, 'props')

  const { match, routes, history, location } = props
  const { isExact } = match

  let redirect = null
  if (match.path === '/member') {
    redirect = '/member/create'
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

  return (
    <Containers>
      <MenuNavigation>
        <Menu size='large'>
          <Menu.Item onClick={() => history.push('/')}>
            <Image src={logoImg} avatar />
          </Menu.Item>
          <Menu.Item link>
            Member
          </Menu.Item>
          <Menu.Item link>
            Loans
          </Menu.Item>
          <Menu.Item link>
            Ledger
          </Menu.Item>
          <Menu.Item link>
            User
          </Menu.Item>
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
                  <Dropdown.Item>
                    Account Profile
                  </Dropdown.Item>
                  <Dropdown.Item>
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      </MenuNavigation>
      <Content>
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
      </Content>
    </Containers>
  )
}

export default DashboardRoot
