import React, { useState, useEffect, Fragment } from 'react'
import {
  Button,
  Form,
  Grid,
  Header,
  Segment,
  Label
} from 'semantic-ui-react'
import { Form as ReactFinalForm, Field, FormSpy } from 'react-final-form'
import { useAsync } from 'react-async'
import get from 'lodash/get'

import { userInfo } from 'Helpers/utils'
import { composeValidators, useFetchAsyncOptions } from 'App/utils'
import { InputField, SelectField } from 'Components/InputFields'
import { required } from 'App/validations'
import { options as optionAsync } from 'App/async'

import Context from './context'
import Computation from './sections/Computations'
import ShareRow from './sections/ShareRow'
import ActionnRow from './sections/ActionRow'
import RecieptTable from './sections/RecieptTable'
import {
  create as createAsync,
  update as updateAsync,
  fetchLoanInfo,
  fetchMemberShares,
  memberList
} from './async'
import { loanAllowed } from './validations'

const roundNumbers = val => parseFloat((Math.round(val * 100) / 100).toFixed(2)).toLocaleString()

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
      const shares = asyncCall?.data?.response?.shares ?? []
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

export default ({ history, match }) => {
  console.log('<><><>')
  const { user_type } = userInfo()
  const uuid = get(match, 'params.id')

  const [initialValues, setInitialValues] = useState({})
  const [disbursmentValues, setDisbursmentValues] = useState({})
  const [memberSelection, setMemberSelection] = useState([])
  const [paymentTermSelection, setPaymentTermSelection] = useState([])
  const [reciepts, setReciepts] = useState([])
  const [loanStatus, setLoanStatus] = useState(null)

  const [serviceCharge, setServiceCharge] = useState(0)
  const [interestCharge, setInterestCharge] = useState(0)
  const [capitalBuildCharge, setCapitalBuildCharge] = useState(0)
  const [shareAmount, setShareAmount] = useState(0)
  const [netPayAmount, setNetpayAmount] = useState(0)
  const [currentPaymentTerm, setCurrentPaymentTerm] = useState(0)
  const [totalPaymentLoan, setTotalPaymentLoan] = useState(0)
  const [maxPaymentTerm, setMaxPaymentTerm] = useState(0)

  const [memberShareValue, setMemberShareValue] = useState(0)
  const [coMaker1ShareValue, setCoMaker1ShareValue] = useState(0)
  const [coMaker2ShareValue, setCoMaker2ShareValue] = useState(0)
  const [totalLoanableShares, setTotalLoanableShares] = useState(0)

  const fetchMemberSharesAsync = useAsync({ deferFn: fetchMemberShares })
  const coMaker1SharesAsync = useAsync({ deferFn: fetchMemberShares })
  const coMaker2SharesAsync = useAsync({ deferFn: fetchMemberShares })
  const memberListAsync = useAsync({ promiseFn: memberList })

  const paymentTermAsync = useOptionAsync('payment_term')
  const isReadOnly = (user_type === 'approver' || loanStatus === 'approved')
  let fetchMemberAsync = {}

  if (uuid) {
    fetchMemberAsync = useAsync({ deferFn: fetchLoanInfo })
    useEffect(() => {
      fetchMemberAsync.run({ uuid })
    }, [])
    useEffect(() => {
      useFetchAsyncOptions('share_per_amount', setShareAmount)
      if (fetchMemberAsync.isResolved) {
        let formValues = {}
        const {
          capital_build_up,
          co_maker_1,
          co_maker_2,
          disbursment,
          interest,
          loan_amount,
          loan_payment_start_date,
          member,
          payment_term,
          service_charge,
          reciepts,
          status
        } = fetchMemberAsync?.data?.response

        setCapitalBuildCharge(capital_build_up)
        setInterestCharge(interest)
        setServiceCharge(service_charge)
        setReciepts(reciepts)
        setCurrentPaymentTerm(reciepts.length + 1)
        setMaxPaymentTerm(payment_term)
        setLoanStatus(status)

        fetchMemberSharesAsync.run({ uuid: member.uuid })
        setDisbursmentValues({ ...disbursment })
        formValues = {
          member_id: member.uuid,
          loan_amount,
          payment_term: payment_term.toString(),
          loan_payment_start_date
        }

        if (co_maker_1) {
          coMaker1SharesAsync.run({ uuid: co_maker_1.uuid })
          formValues.co_maker_1_id = co_maker_1.uuid
        }

        if (co_maker_2) {
          coMaker2SharesAsync.run({ uuid: co_maker_2.uuid })
          formValues.co_maker_2_id = co_maker_2.uuid
        }

        setInitialValues(formValues)
      }
    }, [fetchMemberAsync.isResolved])
  } else {
    useEffect(() => {
      useFetchAsyncOptions('captial_build_up', setCapitalBuildCharge)
      useFetchAsyncOptions('loan_interest', setInterestCharge)
      useFetchAsyncOptions('service_charge', setServiceCharge)
      useFetchAsyncOptions('share_per_amount', setShareAmount)
    }, [])
  }

  const formAsync = uuid
    ? useAsync({ deferFn: updateAsync, uuid })
    : useAsync({ deferFn: createAsync })

  const onSubmitHandle = values => {
    let newValues = {}

    if (user_type === 'teller') {
      newValues = {
        ...values,
        service_charge: serviceCharge,
        interest: interestCharge,
        capital_build_up: capitalBuildCharge,
        share_amount: shareAmount
      }
    }
    newValues.status = loanStatus

    if (uuid) {
      newValues.uuid = uuid
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
    const isResolved = memberListAsync?.isResolved
    if (isResolved) {
      const data = memberListAsync?.data?.response?.map(r => ({
        key: r.uuid,
        value: r.uuid,
        text: `${r.last_name}, ${r.first_name} ${r.middle_name || ''}`
      }))
      setMemberSelection(data)
    }
  }, [memberListAsync.isResolved])

  useGenerateSelction(paymentTermAsync, setPaymentTermSelection)

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
    setCoMaker2ShareValue,
    shareAmount
  )

  useEffect(() => {
    setTotalLoanableShares(
      memberShareValue + coMaker1ShareValue + coMaker2ShareValue
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
        currentPaymentTerm,
        disbursmentValues,
        fetchMemberAsync,
        interestCharge,
        maxPaymentTerm,
        memberShareValue,
        netPayAmount,
        reciepts,
        roundNumbers,
        serviceCharge,
        setNetpayAmount,
        setTotalPaymentLoan,
        totalLoanableShares,
        totalPaymentLoan,
        user_type,
        uuid
      }}
    >
      <Grid centered padded='vertically' container>
        {
          uuid &&
          user_type === 'teller' &&
          loanStatus === 'approved' &&
            <ActionnRow />
        }
        {
          reciepts.length > 0 &&
          (user_type === 'teller' || user_type === 'member') &&
          loanStatus === 'approved' &&
            <RecieptTable />
        }
        <Grid.Row>
          <Grid.Column computer='13'>
            <Segment>
              <ReactFinalForm
                onSubmit={onSubmitHandle}
                initialValues={initialValues}
              >
                {
                  ({ form, handleSubmit }) => {
                    const member = form.getFieldState('member_id')?.value
                    const coMaker1 = form.getFieldState('co_maker_1_id')?.value
                    const coMaker2 = form.getFieldState('co_maker_2_id')?.value
                    return (
                      <Form
                        onSubmit={handleSubmit}
                        loading={
                          formAsync.isPending || fetchMemberAsync?.isPending
                        }
                      >
                        <Grid>
                          <Grid.Row>
                            <Grid.Column computer={10}>
                              <div className='flex justify-between items-center'>
                                {
                                  uuid &&
                                    <Header as='h3'>Loan Information</Header>
                                }
                                {
                                  !uuid &&
                                    <Header as='h3'>Create Loan</Header>
                                }
                                <div>
                                  <Label
                                    color={loanStatus === 'approved' && 'green'}
                                    horizontal
                                  >
                                    {loanStatus ?? 'draft'}
                                  </Label>
                                </div>
                              </div>
                              <Form.Field>
                                <label>Member</label>
                                <Field
                                  component={SelectField}
                                  loading={memberListAsync.isPending}
                                  name='member_id'
                                  onChangeCb={onChangeLoanMember}
                                  placeholder='Member'
                                  disabled={isReadOnly}
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
                                          disabled={isReadOnly}
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
                                          disabled={isReadOnly}
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
                                          readOnly={isReadOnly}
                                          validate={
                                            (user_type === 'teller') && composeValidators(loanAllowed(totalLoanableShares))
                                          }
                                        />
                                      </Form.Field>

                                      <Form.Group widths='equal'>
                                        <Form.Field disabled={!values.member_id}>
                                          <label>Payment Term</label>
                                          <Field
                                            component={SelectField}
                                            name='payment_term'
                                            options={paymentTermSelection}
                                            placeholder='payment_term'
                                            disabled={isReadOnly}
                                            validate={required}
                                          />
                                        </Form.Field>

                                        <Form.Field disabled={!values.member_id}>
                                          <label>Payment Start Date</label>
                                          <Field
                                            component={InputField}
                                            name='loan_payment_start_date'
                                            placeholder='Payment Start Date'
                                            readOnly={isReadOnly}
                                            type='date'
                                            validate={required}
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
                              <div className='flex justify-between'>
                                {
                                  loanStatus !== 'approved' && user_type !== 'member' &&
                                    <Fragment>
                                      <Button
                                        disabled={Boolean(uuid) || user_type === 'approver'}
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
                                          ({ invalid, pristine }) => {
                                            if (user_type === 'teller') {
                                              return (
                                                <Button
                                                  type='submit'
                                                  onClick={() => {
                                                    setLoanStatus('pending')
                                                    setTimeout(form.submit, 100)
                                                  }}
                                                  disabled={(invalid || pristine)}
                                                  color='green'
                                                >
                                                  For Approval
                                                </Button>
                                              )
                                            }
                                            if (user_type === 'approver') {
                                              return (
                                                <div className='flex'>
                                                  <Button
                                                    negative
                                                    onClick={() => {
                                                      setLoanStatus('rejected')
                                                      setTimeout(form.submit, 100)
                                                    }}
                                                    type='submit'
                                                  >
                                                    Reject Loan
                                                  </Button>
                                                  <Button
                                                    positive
                                                    onClick={() => {
                                                      setLoanStatus('approved')
                                                      setTimeout(form.submit, 100)
                                                    }}
                                                    type='submit'
                                                  >
                                                    Approve Loan
                                                  </Button>
                                                </div>
                                              )
                                            }
                                          }
                                        }
                                      </FormSpy>
                                    </Fragment>
                                }
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
        </Grid.Row>
      </Grid>
    </Context.Provider>
  )
}
