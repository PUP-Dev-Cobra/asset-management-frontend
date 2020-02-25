import { lazy } from 'react'

const LoadMemberList = lazy(() => import('Containers/MemberList' /* webpackChunkName Containers-EmployeeList  */))

const LoadMemberForm = lazy(() => import('Containers/MemberForm' /* webpackChunkName Containers-EmployeeForm */))

const LoadMemberDetail = lazy(() => import('Containers/MemberDetail' /* webpackChunkName Containers-EmployeeForm */))

export default [
  {
    path: '/member/list',
    component: LoadMemberList,
    exact: true
  },
  {
    path: '/member/detail/:id',
    component: LoadMemberDetail,
    exact: true
  },
  {
    path: '/member/:id',
    component: LoadMemberForm,
    exact: true
  }
]
