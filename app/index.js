import './styles/global.css'

import React, { Suspense } from 'react'
import { hot } from 'react-hot-loader'
import ReactDOM from 'react-dom'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import dayjs from 'dayjs'

import RouteWithSubroutes from 'Components/RouteWithSubRoutes'
import routes from './routes'
import { BrowserRouter as Router, Switch } from 'react-router-dom'

const env = process.env.NODE_ENV

const App = () => {
  dayjs.extend(LocalizedFormat)
  return (
    <Router>
      <Suspense fallback={<p>Loading</p>}>
        <Switch>
          {
            routes.map(
              (route, i) =>
                <RouteWithSubroutes key={i} {...route} />
            )
          }
        </Switch>
      </Suspense>
    </Router>
  )
}

const $app = document.getElementById('app')
if (env === 'development') {
  console.log(`Console Environment is ${env}`)

  const HotApp = hot(module)(App)
  ReactDOM.render(<HotApp />, $app)
} else {
  ReactDOM.render(<App />, $app)
}

// Enable Service Worker
// if ('serviceWorker' in navigator) {
//   navigator
//     .serviceWorker
//     .register('sw.js')
//     .then(registration => console.log(registration))
//     .catch(console.error)
// }
