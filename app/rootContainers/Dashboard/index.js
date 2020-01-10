import React, { lazy } from 'react'
import { Switch } from 'react-router-dom'
import { Menu, Button, Image, Dropdown } from 'semantic-ui-react'

import RouteWithSubroutes from 'Components/RouteWithSubRoutes'

import logoImg from 'Assets/logo.jpg'

const LoadTellerDashboard = lazy(() => import('Containers/DashboardTeller' /* webpackChunkName: "Container-Home" */))

const DashboardRoot = ({ routes, match }) => {
  const { isExact } = match
  return (
    <div>
      <Menu size='large'>
        <Menu.Item>
          <Image src={logoImg} avatar />
        </Menu.Item>
        <Menu.Menu position='right'>
          <Menu.Item>
            <Button primary>
              Create
            </Button>
          </Menu.Item>
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
      {
        isExact && match.path === '/dashboard' &&
          <LoadTellerDashboard />
      }
      {
        !isExact &&
          <div>
            <Switch>
              {
                (routes.map((r, i) => <RouteWithSubroutes key={i} {...r} />))
              }
            </Switch>
          </div>
      }
    </div>
  )
}

export default DashboardRoot
