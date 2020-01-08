import { lazy } from 'react'

const LoadUserList = lazy(() => import('Containers/UserList' /* webpackChunkName Containers-EmployeeList  */))

const LoadUserForm = lazy(() => import('Containers/UserForm' /* webpackChunkName Containers-EmployeeForm */))

export default [
  {
    path: '/user/list',
    component: LoadUserList,
    exact: true
  },
  {
    path: '/user/create',
    component: LoadUserForm,
    exact: true
  },
  {
    path: '/user/:id',
    component: LoadUserForm,
    exact: true
  }
]
