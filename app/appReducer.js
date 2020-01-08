import { createAction, handleActions } from 'redux-actions'
import {
  API_ERROR_FAILOVER,
  API_REQUEST,
  API_SUCCESS
} from './constants'

const defaultState = {
  field: 'value',
  isLoading: false,
  response: null
}

export const API_ERROR_FAILOVER_ACTION = createAction(API_ERROR_FAILOVER)
export const API_REQUEST_ACTION = createAction(API_REQUEST)
export const API_SUCCESS_ACTION = createAction(API_SUCCESS)

const reducer = handleActions(
  new Map([
    [
      API_ERROR_FAILOVER_ACTION,
      (s, { payload }) => ({ ...s, field: payload })
    ],
    [
      API_REQUEST_ACTION,
      (s, { payload }) => ({ ...s, isLoading: true })
    ],
    [
      API_SUCCESS_ACTION,
      (s, { payload }) => ({ ...s, isLoading: false, response: payload })
    ]
  ]),
  defaultState
)

export default reducer
