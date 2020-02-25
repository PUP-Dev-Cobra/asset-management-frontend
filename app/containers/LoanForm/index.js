import React, { useState, useEffect, Fragment } from 'react'
import {
  Button,
  Form,
  Grid,
  Header,
  Icon,
  Segment,
  Label,
  Message
} from 'semantic-ui-react'
import { Form as ReactFinalForm, Field, FormSpy } from 'react-final-form'
import { useAsync } from 'react-async'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

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
  fetchMember,
  memberList
} from './async'
import { loanAllowed, loanQualified } from './validations'

const roundNumbers = val => parseFloat((Math.round(val * 100) / 100).toFixed(2)).toLocaleString()

const useGenerateSelction = (asyncCall, setState) => {
  return useEffect(() => {
    if (asyncCall.isResolved) {
      const data = asyncCall?.data?.response
      setState(data.map((r, i) => (
        {
          key: i,
          text: r.option_value,
          value: r.option_value
        })))
    }
  }, [asyncCall.isResolved])
}

const useCalculateShares = (asyncCall, setState) => {
  return useEffect(() => {
    if (asyncCall.isResolved) {
      const collateral = asyncCall?.data?.available_collateral
      setState(
        collateral
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
  const { user_type, member_id } = userInfo()
  const uuid = match?.params?.id
  const isCreate = match?.path === '/loan/create/:id'

  const [initialValues, setInitialValues] = useState(isCreate ? { member_id: uuid } : {})
  const [disbursmentValues, setDisbursmentValues] = useState({})
  const [memberSelection, setMemberSelection] = useState([])
  const [paymentTermSelection, setPaymentTermSelection] = useState([])
  const [loanCategorySelection, setLoanCategorySelection] = useState([])
  const [reciepts, setReciepts] = useState([])
  const [loanStatus, setLoanStatus] = useState(null)

  const [serviceCharge, setServiceCharge] = useState(0)
  const [interestCharge, setInterestCharge] = useState(0)
  const [capitalBuildCharge, setCapitalBuildCharge] = useState(0)
  const [shareAmount, setShareAmount] = useState(0)
  const [netPayAmount, setNetpayAmount] = useState(0)
  const [netLoanAmount, setNetLoanAmount] = useState(0)
  const [totalPaymentLoan, setTotalPaymentLoan] = useState(0)
  const [maxPaymentTerm, setMaxPaymentTerm] = useState(0)
  const [outstandingBalance, setOustandingBalance] = useState(0)

  const [memberShareValue, setMemberShareValue] = useState(0)
  const [coMaker1ShareValue, setCoMaker1ShareValue] = useState(0)
  const [coMaker2ShareValue, setCoMaker2ShareValue] = useState(0)
  const [totalLoanableShares, setTotalLoanableShares] = useState(0)

  const fetchMemberSharesAsync = useAsync({ deferFn: fetchMember })
  const coMaker1SharesAsync = useAsync({ deferFn: fetchMember })
  const coMaker2SharesAsync = useAsync({ deferFn: fetchMember })
  const memberListAsync = useAsync({ promiseFn: memberList })

  const paymentTermAsync = useOptionAsync('payment_term')
  const loanCategoryAsync = useOptionAsync('loan_category')

  const isReadOnly = (user_type === 'approver' || loanStatus === 'approved')
  let fetchMemberAsync = {}

  if (uuid && !isCreate) {
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
          loan_category,
          member,
          payment_term,
          service_charge,
          reciepts,
          remaining_balance,
          net_loan_balance,
          status
        } = fetchMemberAsync?.data?.response

        setOustandingBalance(remaining_balance)
        setCapitalBuildCharge(capital_build_up)
        setInterestCharge(interest)
        setServiceCharge(service_charge)
        setReciepts(reciepts)
        setNetLoanAmount(net_loan_balance)
        setMaxPaymentTerm(payment_term)
        setLoanStatus(status)

        fetchMemberSharesAsync.run({ uuid: member.uuid })
        setDisbursmentValues({ ...disbursment })
        formValues = {
          member_id: member.uuid,
          loan_amount,
          payment_term: payment_term.toString(),
          loan_category
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

  const formAsync = uuid && !isCreate
    ? useAsync({ deferFn: updateAsync, uuid })
    : useAsync({ deferFn: createAsync })

  const onSubmitHandle = values => {
    let newValues = {}

    if (user_type === 'member') {
      newValues = {
        ...values,
        service_charge: serviceCharge,
        interest: interestCharge,
        capital_build_up: capitalBuildCharge,
        share_amount: shareAmount
      }
    }
    newValues.member_id = values.member_id
    newValues.status = loanStatus

    if (uuid) {
      newValues.uuid = uuid
    }
    formAsync.run(newValues)
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
  useGenerateSelction(loanCategoryAsync, setLoanCategorySelection)

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
      const uuidRaw = (uuid) || formAsync?.data?.response
      const action = (uuidRaw) ? 'Update' : 'Created'
      toast.success(`Loan ${action} successfully`)

      if (user_type === 'member') {
        history.push(`/member/detail/${member_id}?panel=1`)
      } else {
        history.push(`/loan/list?last_update=${uuidRaw}`)
      }
    }

    if (formAsync.error) {
      toast.error(formAsync.error)
    }
  }, [formAsync.isResolved])

  useEffect(() => {
    if (isCreate) {
      fetchMemberSharesAsync.run({ uuid })
    }
  }, [])

  return (
    <Context.Provider
      value={{
        capitalBuildCharge,
        coMaker1ShareValue,
        coMaker2ShareValue,
        netLoanAmount,
        disbursmentValues,
        fetchMemberAsync,
        interestCharge,
        maxPaymentTerm,
        loanStatus,
        outstandingBalance,
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
        <Grid.Row>
          <Grid.Column computer={13}>
            <Link to={`/member/detail/${initialValues.member_id}`} className='text-2xl'>
              <Icon name='angle left' />
              Back to Member Detail
            </Link>
          </Grid.Column>
        </Grid.Row>
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
                    <>
                      <FormSpy subscription={{ error: true }}>
                        {
                          ({ error }) => {
                            if (!error) {
                              return <></>
                            }

                            return (
                              <Message negative>
                                {error}
                              </Message>
                            )
                          }
                        }
                      </FormSpy>
                      {
                        loanStatus === 'approved' && user_type === 'menber' &&
                          <Message positive>
                            Congratulations. Your Application has beed approved. We will send an email notifiying you
                            once your cheque is ready. You can also contact your staff for additional info.
                          </Message>
                      }
                      {
                        loanStatus === 'pending' && user_type === 'member' &&
                          <Message positive>
                            Your loan application is currently on-process. We will inform you via email once
                            the process is done. You can still edit the application form below, but once it is approved
                            it will be locked.
                          </Message>
                      }
                      <Segment>
                        <Form
                          onSubmit={handleSubmit}
                          loading={
                            formAsync.isPending || fetchMemberAsync?.isPending
                          }
                        >
                          <FormSpy
                            subscription={{ values: true, errors: true, validating: true }}
                            onChange={({ values, errors }) => {
                              if (errors?.co_maker_1_id) {
                                coMaker1SharesAsync.cancel()
                              }

                              if (errors?.co_maker_2_id) {
                                coMaker2SharesAsync.cancel()
                              }

                              if (!errors?.co_maker_1_id && values?.co_maker_1_id) {
                                coMaker1SharesAsync.run({ uuid: values?.co_maker_1_id })
                              }
                              if (!errors?.co_maker_2_id && values?.co_maker_2_id) {
                                coMaker2SharesAsync.run({ uuid: values?.co_maker_2_id })
                              }

                              return values
                            }}
                          />
                          <Grid>
                            <Grid.Row>
                              <Grid.Column computer={10}>
                                <div className='flex justify-between items-center'>
                                  {
                                    uuid && !isCreate &&
                                      <Header as='h3'>Loan Information</Header>
                                  }
                                  {
                                    isCreate &&
                                      <Header as='h3'>Request Loan</Header>
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
                                    defaultValue={uuid}
                                    disabled
                                    loading={memberListAsync.isPending}
                                    name='member_id'
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
                                          <div className='flex'>
                                            <div className='flex-1'>
                                              <Field
                                                name='co_maker_1_id'
                                                placeholder='Co Maker 1'
                                                component={SelectField}
                                                loading={memberListAsync.isPending}
                                                disabled={isReadOnly}
                                                validate={loanQualified}
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
                                            </div>
                                          </div>
                                        </Form.Field>

                                        <Form.Field
                                          disabled={!values.co_maker_1_id}
                                        >
                                          <label>Co-Maker 2</label>
                                          <Field
                                            name='co_maker_2_id'
                                            placeholder='Co Maker 2'
                                            component={SelectField}
                                            loading={memberListAsync.isPending}
                                            disabled={isReadOnly}
                                            validate={loanQualified}
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
                                        <FormSpy subscription={{ errors: true }}>
                                          {
                                            ({ errors }) => {
                                              const disableFields = errors?.co_maker_1_id || errors?.co_maker_2_id
                                              return (
                                                <>
                                                  <Form.Field disabled={!values.member_id}>
                                                    <label>Loan Amount</label>
                                                    <Field
                                                      component={InputField}
                                                      name='loan_amount'
                                                      placeholder='Loan Amount'
                                                      readOnly={isReadOnly}
                                                      disabled={disableFields}
                                                      type='number'
                                                      parse={v => parseInt(v)}
                                                      validate={
                                                        (user_type === 'member' && loanStatus === 'pending') &&
                                                          composeValidators(loanAllowed(totalLoanableShares))
                                                      }
                                                    />
                                                  </Form.Field>

                                                  <Form.Group widths='equal'>
                                                    <Form.Field disabled={!values.member_id}>
                                                      <label>Payment Term</label>
                                                      <Field
                                                        component={SelectField}
                                                        disabled={isReadOnly || disableFields}
                                                        loading={paymentTermAsync.isPending}
                                                        name='payment_term'
                                                        options={paymentTermSelection}
                                                        placeholder='payment_term'
                                                        validate={required}
                                                      />
                                                    </Form.Field>

                                                    <Form.Field disabled={!values.member_id}>
                                                      <label>Category</label>
                                                      <Field
                                                        component={SelectField}
                                                        disabled={isReadOnly || disableFields}
                                                        loading={loanCategoryAsync.isPending}
                                                        name='loan_category'
                                                        options={loanCategorySelection}
                                                        placeholder='Category'
                                                        validate={required}
                                                      />
                                                    </Form.Field>
                                                  </Form.Group>
                                                </>
                                              )
                                            }
                                          }
                                        </FormSpy>
                                      </Fragment>
                                    )
                                  }
                                </FormSpy>
                                {
                                  loanStatus === 'pending' &&
                                    <ShareRow />
                                }
                              </Grid.Column>
                              <Computation />
                            </Grid.Row>
                            <Grid.Row>
                              <Grid.Column stretched>
                                <div className='flex justify-between'>
                                  {
                                    loanStatus !== 'approved' &&
                                      <Button
                                        disabled={!isCreate || user_type === 'approver'}
                                        secondary
                                        type='button'
                                        onClick={() => {
                                          setMemberShareValue(0)
                                          setCoMaker1ShareValue(0)
                                          setCoMaker2ShareValue(0)
                                          form.reset()
                                          fetchMemberSharesAsync.run({ uuid })
                                        }}
                                      >
                                        Reset
                                      </Button>
                                  }
                                  {
                                    loanStatus !== 'approved' && user_type !== 'teller' &&
                                      <Fragment>
                                        <FormSpy subscription={{
                                          invalid: true,
                                          pristine: true
                                        }}
                                        >
                                          {
                                            ({ invalid, pristine }) => {
                                              if (user_type === 'member') {
                                                return (
                                                  <Button
                                                    type='submit'
                                                    disabled={(invalid || pristine)}
                                                    color='green'
                                                  >
                                                    {(isCreate) ? 'Create' : 'Update'} Loan
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
                                                      type='button'
                                                    >
                                                    Reject Loan
                                                    </Button>
                                                    <Button
                                                      positive
                                                      onClick={() => {
                                                        setLoanStatus('approved')
                                                        setTimeout(form.submit, 100)
                                                      }}
                                                      type='button'
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
                      </Segment>
                    </>
                  )
                }
              }
            </ReactFinalForm>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Context.Provider>
  )
}
