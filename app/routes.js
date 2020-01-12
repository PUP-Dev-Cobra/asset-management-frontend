import { lazy } from 'react'
import memberRoutes from './routes/members'
import userRoutes from './routes/users'
import loanRoutes from './routes/loans'

const LoadLogin = lazy(() => import('Containers/Login' /* webpackChunkName: "Container-Home" */))

const LoadDashboardRoot = lazy(() => import('RootContainers/Dashboard' /* webpackChunkName: "RootContainers-SampleRoot" */))

const routes = [
  {
    path: '/',
    component: LoadLogin,
    exact: true
  },
  {
    path: '/dashboard',
    component: LoadDashboardRoot,
    exact: true
  },
  {
    path: '/member',
    redirect: '/member/list',
    exact: true
  },
  {
    path: '/member',
    component: LoadDashboardRoot,
    routes: [
      ...memberRoutes
    ]
  },
  {
    path: '/user',
    redirect: '/user/list',
    exact: true
  },
  {
    path: '/user',
    component: LoadDashboardRoot,
    routes: [
      ...userRoutes
    ]
  },
  {
    path: '/loan',
    redirect: '/loan/list',
    exact: true
  },
  {
    path: '/loan',
    component: LoadDashboardRoot,
    routes: [
      ...loanRoutes
    ]
  },
  {
    path: '/ledger',
    component: LoadDashboardRoot
  }
]

export default routes
