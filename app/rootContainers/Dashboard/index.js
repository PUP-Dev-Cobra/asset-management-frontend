import React from 'react'
import { Switch } from 'react-router-dom'

import RouteWithSubroutes from 'Components/RouteWithSubRoutes'
import { Menu, Button , Image ,Dropdown} from 'semantic-ui-react'
import logoImg from 'Assets/logo.jpg'



const DashboardRoot = ({ routes, match }) => {
  const { isExact } = match
  return (
    <div> 
      <Menu size='large'>
        <Menu.Item >
          <Image src={logoImg} avatar/>
        </Menu.Item>  
        <Menu.Menu position="right">
          <Menu.Item>
            <Button primary>
              Create
            </Button>
          </Menu.Item>
          <Menu.Item>
            <Dropdown text='Profile' simple >
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
