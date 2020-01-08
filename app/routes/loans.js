import { lazy } from 'react'

const LoadLoanList = lazy(() => import('Containers/LoanList' /* webpackChunkName Containers-EmployeeList  */))

const LoadLoanForm = lazy(() => import('Containers/LoanForm' /* webpackChunkName Containers-EmployeeForm */))

export default [
  {
    path: '/loan/list',
    component: LoadLoanList,
    exact: true
  },
  {
    path: '/loan/create',
    component: LoadLoanForm,
    exact: true
  },
  {
    path: '/loan/:id',
    component: LoadLoanForm,
    exact: true
  }
]
