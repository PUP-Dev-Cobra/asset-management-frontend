import React, { useState, useEffect, Fragment } from 'react'
import {
  Grid,
  Form,
  Segment,
  Button,
  Header
} from 'semantic-ui-react'
import { Form as ReactFinalForm, Field, FormSpy } from 'react-final-form'
import { useAsync } from 'react-async'
import get from 'lodash/get'

import { composeValidators } from 'App/utils'
import { InputField, SelectField } from 'Components/InputFields'
import { required } from 'App/validations'

import Context from './context'
import Computation from './sections/Computations'
import ShareRow from './sections/ShareRow'
import {
  create as createAsync,
  fetchMemberShares,
  memberList,
  option as optionAsync
} from './async'
import { loanAllowed } from './validations'

const roundNumbers = val => parseFloat((Math.round(val * 100) / 100).toFixed(2)).toLocaleString()

const useFetchOptions = (asyncCall, setState) => {
  return useEffect(() => {
    if (asyncCall.isResolved) {
      setState(
        get(
          asyncCall,
          'data.response[0].option_value'
        )
      )
    }
  }, [asyncCall.isResolved])
}

const useGenerateSelction = (asyncCall, setState) => {
  return useEffect(() => {
    if (asyncCall.isResolved) {
      const data = get(asyncCall, 'data.response')
      setState(data.map((r, i) => (
        {
          key: i,
          text: r.option_value,
          value: r.option_value
        })))
    }
  }, [asyncCall.isResolved])
}

const useCalculateShares = (asyncCall, setState, shareAmount) => {
  return useEffect(() => {
    if (asyncCall.isResolved) {
      const shares = get(asyncCall, 'data.response.shares')
      setState(
        shares.map(r => r.share_count).reduce((a, v) => a + v, 0) * shareAmount
      )
    }
  }, [asyncCall.isResolved])
}

const useOptionAsync = (optionName) => {
  return useAsync({
    promiseFn: optionAsync,
    option_name: optionName
  })
}

export default ({ history }) => {
  const [memberSelection, setMemberSelection] = useState([])
  const [paymentTermSelection, setPaymentTermSelection] = useState([])

  const [serviceCharge, setServiceCharge] = useState(0)
  const [interestCharge, setInterestCharge] = useState(0)
  const [capitalBuildCharge, setCapitalBuildCharge] = useState(0)
  const [shareAmount, setShareAmount] = useState(0)

  const [memberShareValue, setMemberShareValue] = useState(0)
  const [coMaker1ShareValue, setCoMaker1ShareValue] = useState(0)
  const [coMaker2ShareValue, setCoMaker2ShareValue] = useState(0)
  const [totalLoanableShares, setTotalLoanableShares] = useState(0)

  const fetchMemberSharesAsync = useAsync({ deferFn: fetchMemberShares })
  const coMaker1SharesAsync = useAsync({ deferFn: fetchMemberShares })
  const coMaker2SharesAsync = useAsync({ deferFn: fetchMemberShares })
  const memberListAsync = useAsync({ promiseFn: memberList })

  const paymentTermAsync = useOptionAsync('payment_term')
  const capitalBuildUpAsync = useOptionAsync('captial_build_up')
  const interestAsync = useOptionAsync('loan_interest')
  const serviceChargeAsync = useOptionAsync('service_charge')
  const shareAmountOptionAsync = useOptionAsync('share_per_amount')

  const formAsync = useAsync({ deferFn: createAsync })

  const onSubmitHandle = values => {
    const newValues = {
      ...values,
      service_charge: serviceCharge,
      interest: interestCharge,
      capital_build_up: capitalBuildCharge,
      share_amount: shareAmount,
      status: 'draft'
    }
    formAsync.run(newValues)
  }

  const onChangeLoanMember = uuid => {
    fetchMemberSharesAsync.run({ uuid })
  }
  const onChangeLoanCoMaker1 = uuid => {
    coMaker1SharesAsync.run({ uuid })
  }
  const onChangeLoanCoMaker2 = uuid => {
    coMaker2SharesAsync.run({ uuid })
  }

  useEffect(() => {
    const isResolved = get(memberListAsync, 'isResolved')
    if (isResolved) {
      const data = get(memberListAsync, 'data.response')
      setMemberSelection(data.map(r => (
        {
          key: r.uuid,
          value: r.uuid,
          text: `${r.last_name}, ${r.first_name} ${r.middle_name || ''}`
        })))
    }
  }, [memberListAsync.isResolved])

  useGenerateSelction(paymentTermAsync, setPaymentTermSelection)

  useFetchOptions(capitalBuildUpAsync, setCapitalBuildCharge)
  useFetchOptions(interestAsync, setInterestCharge)
  useFetchOptions(serviceChargeAsync, setServiceCharge)
  useFetchOptions(shareAmountOptionAsync, setShareAmount)

  useCalculateShares(
    fetchMemberSharesAsync,
    setMemberShareValue,
    shareAmount
  )
  useCalculateShares(
    coMaker1SharesAsync,
    setCoMaker1ShareValue,
    shareAmount
  )
  useCalculateShares(
    coMaker2SharesAsync,
    setCoMaker1ShareValue,
    shareAmount
  )

  useEffect(() => {
    setTotalLoanableShares(
      memberShareValue +
      coMaker1ShareValue +
      coMaker2ShareValue
    )
  },
  [
    memberShareValue,
    coMaker1ShareValue,
    coMaker2ShareValue
  ])

  useEffect(() => {
    if (formAsync.isResolved) {
      history.push('/loan/list')
    }
  }, [formAsync.isResolved])

  return (
    <Context.Provider
      value={{
        capitalBuildCharge,
        coMaker1ShareValue,
        coMaker2ShareValue,
        interestCharge,
        memberShareValue,
        roundNumbers,
        serviceCharge,
        totalLoanableShares
      }}
    >
      <Grid centered padded='vertically' container>
        <Grid.Column computer='13'>
          <Segment>
            <ReactFinalForm onSubmit={onSubmitHandle}>
              {
                ({ form, handleSubmit }) => {
                  const member = get(
                    form.getFieldState('member_id'), 'value')
                  const coMaker1 = get(
                    form.getFieldState('co_maker_1_id'), 'value')
                  const coMaker2 = get(
                    form.getFieldState('co_maker_2_id'), 'value')
                  return (
                    <Form onSubmit={handleSubmit} loading={formAsync.isPending}>
                      <Grid>
                        <Grid.Row>
                          <Grid.Column computer={10}>
                            <Header as='h3'>Create Form</Header>
                            <Form.Field>
                              <label>Member</label>
                              <Field
                                component={SelectField}
                                loading={memberListAsync.isPending}
                                name='member_id'
                                onChangeCb={onChangeLoanMember}
                                placeholder='Member'
                                options={
                                  memberSelection
                                    .filter(v => {
                                      if (!coMaker1) return true
                                      return coMaker1 !== v.value
                                    })
                                    .filter(v => {
                                      if (!coMaker2) return true
                                      return coMaker2 !== v.value
                                    })
                                }
                              />
                            </Form.Field>

                            <FormSpy subscription={{ values: true }}>
                              {
                                ({ values }) => (
                                  <Fragment>
                                    <Form.Field
                                      disabled={!values.member_id}
                                    >
                                      <label>Co-Maker 1</label>
                                      <Field
                                        name='co_maker_1_id'
                                        placeholder='Co Maker 1'
                                        component={SelectField}
                                        onChangeCb={onChangeLoanCoMaker1}
                                        loading={memberListAsync.isPending}
                                        options={
                                          memberSelection
                                            .filter(v => {
                                              if (!member) return true
                                              return member !== v.value
                                            })
                                            .filter(v => {
                                              if (!coMaker2) return true
                                              return coMaker2 !== v.value
                                            })
                                        }
                                      />
                                    </Form.Field>

                                    <Form.Field
                                      disabled={!values.co_maker_1_id}
                                    >
                                      <label>Co-Maker 2</label>
                                      <Field
                                        name='co_maker_2_id'
                                        placeholder='Co Maker 2'
                                        component={SelectField}
                                        onChangeCb={onChangeLoanCoMaker2}
                                        loading={memberListAsync.isPending}
                                        options={
                                          memberSelection
                                            .filter(v => {
                                              if (!coMaker1) return true
                                              return coMaker1 !== v.value
                                            })
                                            .filter(v => {
                                              if (!member) return true
                                              return member !== v.value
                                            })
                                        }
                                      />
                                    </Form.Field>

                                    <Form.Field disabled={!values.member_id}>
                                      <label>Loan Amount</label>
                                      <Field
                                        component={InputField}
                                        name='loan_amount'
                                        placeholder='Loan Amount'
                                        validate={
                                          composeValidators(loanAllowed(totalLoanableShares))
                                        }
                                      />
                                    </Form.Field>

                                    <Form.Group widths='equal'>
                                      <Form.Field disabled={!values.member_id}>
                                        <label>Payment Term</label>
                                        <Field
                                          component={SelectField}
                                          options={paymentTermSelection}
                                          name='payment_term'
                                          placeholder='payment_term'
                                          validate={required}
                                        />
                                      </Form.Field>

                                      <Form.Field disabled={!values.member_id}>
                                        <label>Payment Start Date</label>
                                        <Field
                                          component={InputField}
                                          name='loan_payment_start_date'
                                          placeholder='Payment Start Date'
                                          validate={required}
                                          type='date'
                                        />
                                      </Form.Field>
                                    </Form.Group>
                                  </Fragment>
                                )
                              }
                            </FormSpy>
                            <ShareRow />
                          </Grid.Column>
                          <Computation />
                        </Grid.Row>
                        <Grid.Row>
                          <Grid.Column stretched>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between'
                              }}
                            >
                              <Button
                                secondary
                                type='button'
                                onClick={() => {
                                  setMemberShareValue(0)
                                  setCoMaker1ShareValue(0)
                                  setCoMaker2ShareValue(0)
                                  form.reset()
                                }}
                              >
                                Reset
                              </Button>
                              <FormSpy subscription={{
                                invalid: true,
                                pristine: true
                              }}
                              >
                                {
                                  ({ invalid, pristine }) => (
                                    <Button
                                      type='submit'
                                      disabled={(invalid || pristine)} color='green'
                                    >
                                      For Approval
                                    </Button>
                                  )
                                }
                              </FormSpy>
                            </div>
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Form>
                  )
                }
              }
            </ReactFinalForm>
          </Segment>
        </Grid.Column>
      </Grid>
    </Context.Provider>
  )
}
