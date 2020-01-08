import React from 'react'
import { Route, Redirect } from 'react-router-dom'

const RouteWithSubroutes = route => {
  return (
    <Route
      path={route.path}
      render={props => {
        if (route.redirect && route.computedMatch.isExact) {
          return <Redirect to={route.redirect} />
        }

        if (route.render) {
          return route.render(props)
        }

        return <route.component {...props} routes={route.routes} />
      }}
    />
  )
}

export default RouteWithSubroutes
