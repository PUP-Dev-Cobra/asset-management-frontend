import React from 'react'
import { Switch } from 'react-router-dom'

import RouteWithSubroutes from 'Components/RouteWithSubRoutes'

const DashboardRoot = ({ routes, match }) => {
  const { isExact } = match
  return (
    <div className='l-d-b'>
      <div>
        This is a Root Page for various pages that share the same base look like dashboard menus.
      </div>
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
