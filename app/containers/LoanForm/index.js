import React, { useState, useEffect, Fragment } from 'react'
import {
  Grid,
  Form,
  Statistic,
  Segment,
  List,
  Button,
  Header
} from 'semantic-ui-react'
import { Form as ReactFinalForm, Field, FormSpy } from 'react-final-form'
import { useAsync } from 'react-async'
import get from 'lodash/get'

import { composeValidators } from 'App/utils'
import { InputField, SelectField } from 'Components/InputFields'
import { required } from 'App/validations'

import {
  memberList,
  option as optionAsync,
  fetchMemberShares
} from './async'
import { loanAllowed } from './validations'

const roundNumbers = val => parseFloat((Math.round(val * 100) / 100).toFixed(2)).toLocaleString()

export default props => {
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
  const paymentTermAsync = useAsync({
    promiseFn: optionAsync,
    option_name: 'payment_term'
  })
  const capitalBuildUpAsync = useAsync({
    promiseFn: optionAsync,
    option_name: 'captial_build_up'
  })
  const interestAsync = useAsync({
    promiseFn: optionAsync,
    option_name: 'loan_interest'
  })
  const serviceChargeAsync = useAsync({
    promiseFn: optionAsync,
    option_name: 'service_charge'
  })
  const shareAmountOptionAsync = useAsync({
    promiseFn: optionAsync,
    option_name: 'share_per_amount'
  })

  const onSubmitHandle = values => {
    console.log(values)
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

  useEffect(() => {
    const isResolved = get(paymentTermAsync, 'isResolved')
    if (isResolved) {
      const data = get(paymentTermAsync, 'data.response')
      setPaymentTermSelection(data.map((r, i) => (
        {
          key: i,
          text: r.option_value,
          value: r.option_value
        }
      )))
    }
  }, [paymentTermAsync.isResolved])

  useEffect(() => {
    const capitalBuildUpIsResolve = get(capitalBuildUpAsync, 'isResolved')
    const interestChargeIsResolve = get(interestAsync, 'isResolved')
    const serviceChargeIsResolve = get(serviceChargeAsync, 'isResolved')
    const shareAmountOptionResolve = get(shareAmountOptionAsync, 'isResolved')

    if (capitalBuildUpIsResolve) {
      setCapitalBuildCharge(
        get(
          capitalBuildUpAsync,
          'data.response[0].option_value'
        )
      )
    }

    if (interestChargeIsResolve) {
      setInterestCharge(
        get(
          interestAsync,
          'data.response[0].option_value'
        )
      )
    }

    if (serviceChargeIsResolve) {
      setServiceCharge(
        get(
          serviceChargeAsync,
          'data.response[0].option_value'
        )
      )
    }

    if (shareAmountOptionResolve) {
      setShareAmount(
        parseInt(
          get(
            shareAmountOptionAsync,
            'data.response[0].option_value'
          )
        )
      )
    }
  },
  [
    capitalBuildUpAsync.isResolved,
    interestAsync.isResolved,
    serviceChargeAsync.isResolved,
    shareAmountOptionAsync.isResolved
  ])

  useEffect(() => {
    if (fetchMemberSharesAsync.isResolved) {
      const memberShare = get(fetchMemberSharesAsync, 'data.response.shares')
      setMemberShareValue(
        memberShare.map(r => r.share_count).reduce((a, v) => a + v, 0) * shareAmount
      )
    }
    if (coMaker1SharesAsync.isResolved) {
      const coMaker1Share = get(coMaker1SharesAsync, 'data.response.shares')
      setCoMaker1ShareValue(
        coMaker1Share.map(r => r.share_count).reduce((a, v) => a + v, 0) * shareAmount
      )
    }
    if (coMaker2SharesAsync.isResolved) {
      const coMaker2Share = get(coMaker2SharesAsync, 'data.response.shares')
      setCoMaker1ShareValue(
        coMaker2Share.map(r => r.share_count).reduce((a, v) => a + v, 0) * shareAmount
      )
    }
  },
  [
    fetchMemberSharesAsync.isResolved,
    coMaker1SharesAsync.isResolved,
    coMaker2SharesAsync.isResolved
  ])

  useEffect(() => {
    setTotalLoanableShares(memberShareValue + coMaker1ShareValue + coMaker2ShareValue)
  },
  [
    memberShareValue,
    coMaker1ShareValue,
    coMaker2ShareValue
  ])

  return (
    <Grid centered padded='vertically' container>
      <Grid.Column computer='13'>
        <Segment>
          <ReactFinalForm onSubmit={onSubmitHandle}>
            {
              ({ form, handleSubmit }) => {
                const member = get(
                  form.getFieldState('member'), 'value')
                const coMaker1 = get(
                  form.getFieldState('co_maker_1'), 'value')
                const coMaker2 = get(
                  form.getFieldState('co_maker_2'), 'value')
                return (
                  <Form onSubmit={handleSubmit}>
                    <Grid>
                      <Grid.Row>
                        <Grid.Column computer={10}>
                          <Header as='h3'>Create Form</Header>
                          <Form.Field>
                            <label>Member</label>
                            <Field
                              name='member'
                              onChangeCb={onChangeLoanMember}
                              component={SelectField}
                              loading={memberListAsync.isPending}
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
                                  <Form.Field disabled={!values.member}>
                                    <label>Co-Maker 1</label>
                                    <Field
                                      name='co_maker_1'
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

                                  <Form.Field disabled={!values.co_maker_1}>
                                    <label>Co-Maker 2</label>
                                    <Field
                                      name='co_maker_2'
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

                                  <Form.Field disabled={!values.member}>
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

                                  <Form.Field disabled={!values.member}>
                                    <label>Payment Term</label>
                                    <Field
                                      component={SelectField}
                                      options={paymentTermSelection}
                                      name='payment_term'
                                      placeholder='payment_term'
                                      validate={required}
                                    />
                                  </Form.Field>
                                </Fragment>
                              )
                            }
                          </FormSpy>

                          <Form.Group widths='equal'>
                            <Form.Field>
                              <Segment>
                                <div
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'center'
                                  }}
                                >
                                  <Statistic
                                    size='tiny'
                                    label='Member Shares In Cash'
                                    value={memberShareValue.toLocaleString()}
                                  />
                                </div>
                              </Segment>
                            </Form.Field>
                            <Form.Field>
                              <Segment>
                                <Statistic
                                  size='tiny'
                                  label='Co Maker 1 Shares In Cash'
                                  value={coMaker1ShareValue.toLocaleString()}
                                />
                              </Segment>
                            </Form.Field>
                            <Form.Field>
                              <Segment>
                                <Statistic
                                  size='tiny'
                                  label='Co Maker 2 Shares In Cash'
                                  value={coMaker2ShareValue.toLocaleString()}
                                />
                              </Segment>
                            </Form.Field>
                          </Form.Group>
                        </Grid.Column>
                        <Grid.Column computer={6} verticalAlign='middle'>
                          <FormSpy subscription={{ values: true }}>
                            {
                              props => {
                                const payTerm = parseInt(get(props, 'values.payment_term')) || 0
                                const loanAmount = parseInt(get(props, 'values.loan_amount')) || 0
                                const serviceChargePayment = loanAmount * parseFloat(serviceCharge) / 100
                                const capitalBuildUpPayment = loanAmount * parseFloat(capitalBuildCharge) / 100
                                const interestChargePayment = loanAmount *
                                parseFloat(interestCharge) * payTerm / 100

                                const netLoanPayment = loanAmount - capitalBuildUpPayment - interestChargePayment - serviceChargePayment

                                const netPaypermonth = netLoanPayment / payTerm || 0

                                return (
                                  <Segment size='large'>
                                    <List divided>
                                      <List.Item>
                                        <List.Content
                                          floated='right'
                                        >
                                          {loanAmount.toLocaleString()}
                                        </List.Content>
                                        <List.Content>
                                          Loan
                                        </List.Content>
                                      </List.Item>

                                      <List.Item>
                                        <List.Content
                                          floated='right'
                                        >
                                          {roundNumbers(serviceChargePayment)}
                                        </List.Content>
                                        <List.Content>
                                          Service Charge
                                        </List.Content>
                                      </List.Item>

                                      <List.Item>
                                        <List.Content floated='right'>
                                          {roundNumbers(capitalBuildUpPayment)}
                                        </List.Content>
                                        <List.Content>
                                          Capital Build Up
                                        </List.Content>
                                      </List.Item>

                                      <List.Item>
                                        <List.Content
                                          floated='right'
                                        >
                                          {roundNumbers(interestChargePayment)}
                                        </List.Content>
                                        <List.Content>
                                          Interest
                                        </List.Content>
                                      </List.Item>

                                      <List.Item>
                                        <List.Content
                                          floated='right'
                                        >
                                          {roundNumbers(netLoanPayment)}
                                        </List.Content>
                                        <List.Content>
                                          Net Pay Amount
                                        </List.Content>
                                      </List.Item>

                                      <List.Item>
                                        <List.Content
                                          floated='right'
                                        >
                                          {
                                            roundNumbers(
                                              parseFloat(netPaypermonth)
                                            )
                                          }
                                        </List.Content>
                                        <List.Content>
                                          Month Payment Amount
                                        </List.Content>
                                      </List.Item>
                                    </List>
                                  </Segment>
                                )
                              }
                            }
                          </FormSpy>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'center'
                            }}
                          >
                            <Segment>
                              <Statistic
                                size='tiny'
                                label='Total Loanable Shares In Cash'
                                value={totalLoanableShares.toLocaleString()}
                              />
                            </Segment>
                          </div>
                        </Grid.Column>
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
  )
}
