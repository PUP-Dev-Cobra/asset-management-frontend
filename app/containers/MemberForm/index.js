import React, { useState, useEffect } from 'react'
import {
  Button,
  Form,
  Grid,
  Icon,
  Header,
  Message,
  Segment,
  Modal,
  Table
} from 'semantic-ui-react'
import { Form as ReactFinalForm, FormSpy, Field } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'
import { useAsync } from 'react-async'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import arrayMutators from 'final-form-arrays'
import dayjs from 'dayjs'
import createDecorator from 'final-form-calculate'

import { required } from 'App/validations'
import { composeValidators } from 'App/utils'
import { userInfo } from 'Helpers/utils'
import { loanAllowed } from 'Containers/LoanForm/validations'
import { InputField, SelectField } from 'Components/InputFields'

import { emailDuplicate } from './validations'

import {
  option as optionAsync,
  create as createAsync,
  update as updateAsync,
  fetchMember
} from './async'

const formCalculators = createDecorator(
  {
    field: 'dob',
    updates: {
      age: (val) => dayjs().diff(val, 'years')
    }
  },
  {
    field: 'share.total_share_amount',
    updates: {
      'share.share_count': (v, aV) => parseInt(v / aV.share.share_per_amount)
    }
  }
)

const normalizePhone = value => {
  if (!value) return value
  const onlyNums = value.replace(/[^\d]/g, '')
  if (onlyNums.length <= 3) return onlyNums
  if (onlyNums.length <= 7) { return `(${onlyNums.slice(0, 3)}) ${onlyNums.slice(3, 7)}` }
  return `(${onlyNums.slice(0, 3)}) ${onlyNums.slice(3, 6)}-${onlyNums.slice(
    6,
    10
  )}`
}

export default ({ history, match }) => {
  const [confirmSubmit, setConfirmSubmit] = useState(false)
  const uuid = match?.params?.id

  const inPreview = match?.path === '/member/preview/:id'

  const { user_type } = userInfo() ?? { user_type: null }
  let fetchAsync = {}
  let onSubmitAsync = useAsync({
    deferFn: createAsync
  })
  const [initalValues, setInitialValues] = useState(null)
  const [forDeletion, setForDeletion] = useState([])
  const [formStatus, setFormStatus] = useState(null)

  const isReadOnly = (
    formStatus === 'approved' ||
    user_type === 'approver' ||
    inPreview
  )

  if (uuid) {
    fetchAsync = useAsync({ promiseFn: fetchMember, uuid })
    onSubmitAsync = useAsync({ deferFn: updateAsync, uuid })
  }

  const createMemberSubmit = useAsync({
    deferFn: createAsync
  })

  const onSubmit = values => {
    let memberForm = {}
    const forSending = {}

    if (!user_type) {
      memberForm = {
        ...values
      }
      delete memberForm?.share?.total_share_amount
      forSending.memberForm = { ...memberForm }
      forSending.forDeletion = forDeletion
    } else if (user_type === 'approver') {
      memberForm.status = formStatus
      forSending.uuid = uuid
      forSending.memberForm = { ...memberForm }
    }

    onSubmitAsync.run(
      forSending
    )
  }

  const genderOptionsAsync = useAsync({
    promiseFn: optionAsync,
    option_name: 'gender'
  })
  const sourceOfIncomOptionsAsync = useAsync({
    promiseFn: optionAsync,
    option_name: 'source_of_income'
  })
  const civilStatusOptionsAsync = useAsync({
    promiseFn: optionAsync,
    option_name: 'civil_status'
  })
  const sharePerAmountOptionAsync = useAsync({
    promiseFn: optionAsync,
    option_name: 'share_per_amount'
  })

  const genderOptions = genderOptionsAsync?.data?.response ?? []
  const civilStatusOptions = civilStatusOptionsAsync?.data?.response ?? []
  const sourceOfIncomeOptions = sourceOfIncomOptionsAsync?.data?.response ?? []

  const sharePerAmountOption = sharePerAmountOptionAsync?.data?.response ?? [{ option_value: 0 }]

  useEffect(
    () => {
      if (onSubmitAsync.isFulfilled) {
        const uuidRaw = (uuid) || onSubmitAsync?.data?.response
        const action = (uuid) ? 'Update' : 'Created'
        toast.success(`${action} successfully`)

        if (!user_type) {
          history.push('/')
        } else {
          history.push(`/member/list?last_update=${uuidRaw}`)
        }
      }

      if (onSubmitAsync.error) {
        toast.error(onSubmitAsync.error)
      }
    },
    [onSubmitAsync.isFulfilled, onSubmitAsync.error]
  )

  useEffect(
    () => {
      if (fetchAsync.data) {
        const fetchedData = { ...fetchAsync.data }

        fetchedData.share = {
          ...fetchAsync.data?.shares[0],
          total_share_amount: fetchAsync.data?.shares[0]?.share_count * fetchAsync.data?.shares[0]?.share_per_amount || 0
        }

        fetchedData.email = fetchedData?.userInfo?.email
        delete fetchAsync.data.shares
        delete fetchAsync.data.email
        setFormStatus(fetchedData.status)
        setInitialValues({ ...fetchedData })
      }
    },
    [fetchAsync.data]
  )

  useEffect(
    () => {
      if (!uuid) {
        setInitialValues({
          dob: dayjs().subtract(18, 'years').format('YYYY-MM-DD'),
          beneficiaries: [],
          share: {
            share_per_amount: sharePerAmountOption[0].option_value
          }
        })
      }
    },
    [sharePerAmountOptionAsync?.data]
  )

  useEffect(() => {
    if (inPreview) {
      localStorage.clear()
    }
  }, [])

  return (
    <Grid centered verticalAlign='middle' container padded='vertically'>
      <Grid.Column computer={13}>
        <Segment>
          {
            inPreview &&
              <Link to='/' className='text-2xl'>
                <Icon name='angle left' />
                Back to Login
              </Link>
          }
          <Header as='h1'>Membership Form</Header>
          {
            formStatus === 'approved' &&
              <Message positive>
                This Member is already approved
              </Message>
          }
          {
            formStatus === 'pending' &&
              <Message info>
                This Member is pending for approval
              </Message>
          }
          {
            createMemberSubmit.error &&
              <Message negative>
                {
                  createMemberSubmit.error
                }
              </Message>
          }
          <ReactFinalForm
            onSubmit={onSubmit}
            decorators={[formCalculators]}
            initialValues={initalValues}
            mutators={{
              ...arrayMutators
            }}
          >
            {
              ({ form: { mutators: { push }, submit }, handleSubmit }) => {
                return (
                  <Form
                    onSubmit={handleSubmit}
                    loading={
                      onSubmitAsync.isPending ||
                      fetchAsync.isPending
                    }
                  >
                    <Form.Group widths='equal'>
                      <Form.Field>
                        <label>First Name</label>
                        <Field
                          name='first_name'
                          placeholder='First Name'
                          component={InputField}
                          validate={required}
                          readOnly={isReadOnly}
                        />
                      </Form.Field>
                      <Form.Field>
                        <label>Middle Name</label>
                        <Field
                          name='middle_name'
                          placeholder='Middle Name'
                          component={InputField}
                          readOnly={isReadOnly}
                        />
                      </Form.Field>
                      <Form.Field>
                        <label>Last Name</label>
                        <Field
                          name='last_name'
                          placeholder='Last Name'
                          component={InputField}
                          validate={required}
                          readOnly={isReadOnly}
                        />
                      </Form.Field>
                      <Form.Field>
                        <label>Nickname</label>
                        <Field
                          name='nickname'
                          placeholder='Nickname'
                          component={InputField}
                          validate={required}
                          readOnly={isReadOnly}
                        />
                      </Form.Field>
                    </Form.Group>
                    <Form.Group widths='equal'>
                      <Form.Field>
                        <label>Date of Birth</label>
                        <Field
                          name='dob'
                          placeholder='Date of Birth'
                          component={InputField}
                          validate={required}
                          readOnly={isReadOnly}
                          type='date'
                        />
                      </Form.Field>
                      <Form.Field>
                        <label>Age</label>
                        <Field
                          name='age'
                          readOnly
                          placeholder='Age'
                          component={InputField}
                          validate={required}
                        />
                      </Form.Field>
                      <Form.Field>
                        <label>Gender</label>
                        <Field
                          name='gender'
                          component={SelectField}
                          validate={required}
                          loading={genderOptionsAsync.isPending}
                          disabled={isReadOnly}
                          options={
                            genderOptions.map(
                              (value, index) => ({
                                value: value.option_value,
                                text: value.option_value,
                                key: index
                              }))
                          }
                        />
                      </Form.Field>
                      <Form.Field>
                        <label>Religion</label>
                        <Field
                          name='religion'
                          placeholder='Religion'
                          component={InputField}
                          readOnly={isReadOnly}
                          validate={required}
                        />
                      </Form.Field>
                    </Form.Group>
                    <Form.Group widths='equal'>
                      <Form.Field>
                        <label>Civil Status</label>
                        <Field
                          name='civil_status'
                          component={SelectField}
                          validate={required}
                          disabled={isReadOnly}
                          loading={civilStatusOptionsAsync.isPending}
                          options={civilStatusOptions.map(
                            (value, index) => ({
                              value: value.option_value,
                              text: value.option_value,
                              key: index
                            }))}
                        />
                      </Form.Field>
                      <FormSpy
                        subscription={{ values: true }}
                      >
                        {
                          ({ values: { civil_status } }) => (
                            <Form.Field>
                              <label>Spouse's Name</label>
                              {
                                civil_status === 'married' &&
                                  <Field
                                    name='spouse_name'
                                    disabled={(civil_status !== 'married')}
                                    placeholder='Spouse Name'
                                    readOnly={isReadOnly}
                                    component={InputField}
                                    validate={required}
                                  />
                              }
                            </Form.Field>
                          )
                        }
                      </FormSpy>
                    </Form.Group>
                    <Form.Group widths='equal'>
                      <Form.Field>
                        <label>Home Address</label>
                        <Field
                          name='address'
                          placeholder='Address'
                          component={InputField}
                          readOnly={isReadOnly}
                          validate={required}
                        />
                      </Form.Field>
                      <Form.Field>
                        <label>Mobile Number</label>
                        <Field
                          name='contact_no'
                          placeholder='(999) 999-9999'
                          component={InputField}
                          readOnly={isReadOnly}
                          validate={required}
                          parse={normalizePhone}
                        />
                      </Form.Field>
                      <Form.Field>
                        <label>Email Address</label>
                        <Field
                          name='email'
                          placeholder='sample@mail.com'
                          type='email'
                          component={InputField}
                          readOnly={isReadOnly}
                          validate={composeValidators(required, emailDuplicate)}
                        />
                      </Form.Field>
                    </Form.Group>
                    <Form.Group widths='equal'>
                      <Form.Field>
                        <label>Occupation/Source of Income</label>
                        <Field
                          name='source_of_income'
                          placeholder='Occupaton / Source of Income'
                          component={InputField}
                          readOnly={isReadOnly}
                          validate={required}
                        />
                      </Form.Field>
                      <Form.Field>
                        <label>TIN/OSCA</label>
                        <Field
                          name='tin_oca'
                          placeholder='TIN/OSCA'
                          component={InputField}
                          readOnly={isReadOnly}
                          validate={required}
                        />
                      </Form.Field>
                      <Form.Field>
                        <label>Monthly Income</label>
                        <Field
                          name='monthly_income'
                          component={SelectField}
                          validate={required}
                          placeholder='Monthly Income'
                          loading={sourceOfIncomOptionsAsync.isPending}
                          disabled={isReadOnly}
                          options={sourceOfIncomeOptions.map(
                            (value, index) => ({
                              value: value.option_value,
                              text: value.option_value,
                              key: index
                            }))}
                        />
                      </Form.Field>
                    </Form.Group>
                    <Form.Field>
                      <FieldArray name='beneficiaries'>
                        {
                          ({ fields }) => {
                            if (fields.length < 1 && !inPreview) {
                              return (
                                <div className='my-2'>
                                  <Message>No beneficiaries stated</Message>
                                </div>
                              )
                            }

                            return (
                              <Table celled>
                                <Table.Header>
                                  <Table.Row>
                                    <Table.HeaderCell>Benificiaries</Table.HeaderCell>
                                    <Table.HeaderCell>Relationship </Table.HeaderCell>
                                    <Table.HeaderCell>Date of Birth</Table.HeaderCell>
                                    <Table.HeaderCell />
                                  </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                  {
                                    fields.map((name, index) => (
                                      <Table.Row key={index}>
                                        <Table.Cell>
                                          <Field
                                            name={`${name}.first_name`}
                                            placeholder='First Name'
                                            component={InputField}
                                            readOnly={isReadOnly}
                                            validate={required}
                                          />
                                          <Field
                                            name={`${name}.middle_name`}
                                            placeholder='Middle Name'
                                            readOnly={isReadOnly}
                                            component={InputField}
                                          />
                                          <Field
                                            name={`${name}.last_name`}
                                            placeholder='Last Name'
                                            readOnly={isReadOnly}
                                            component={InputField}
                                          />
                                        </Table.Cell>
                                        <Table.Cell>
                                          <Field
                                            name={`${name}.relationship`}
                                            placeholder='Relationship'
                                            component={InputField}
                                            readOnly={isReadOnly}
                                            validate={required}
                                          />
                                        </Table.Cell>
                                        <Table.Cell>
                                          <Field
                                            name={`${name}.dob`}
                                            placeholder='Date of Birth'
                                            component={InputField}
                                            validate={required}
                                            readOnly={isReadOnly}
                                            type='date'
                                          />
                                        </Table.Cell>
                                        {
                                          !user_type &&
                                            <Table.Cell textAlign='center'>
                                              <Button
                                                onClick={() => {
                                                  if (fields.value[index].id) {
                                                    setForDeletion(
                                                      prev => [...prev, fields.value[index]]
                                                    )
                                                  }
                                                  fields.remove(index)
                                                }}
                                                type='button'
                                                icon
                                                negative
                                              >
                                                <Icon name='minus' />
                                              </Button>
                                            </Table.Cell>
                                        }
                                      </Table.Row>
                                    ))
                                  }
                                </Table.Body>
                                {
                                  !user_type && !inPreview &&
                                    <Table.Footer fullWidth>
                                      <Table.Row>
                                        <Table.HeaderCell
                                          colSpan='4'
                                        >
                                          <div
                                            className='flex justify-end'
                                          >
                                            <Button
                                              type='button'
                                              secondary
                                              onClick={() => push('beneficiaries', {})}
                                            >
                                              <Icon name='plus' />
                                              Add Beneficiaries
                                            </Button>
                                          </div>
                                        </Table.HeaderCell>
                                      </Table.Row>
                                    </Table.Footer>
                                }
                              </Table>
                            )
                          }
                        }
                      </FieldArray>
                    </Form.Field>
                    {
                      !inPreview &&
                        <Form.Group widths='equal'>
                          <Form.Field>
                            <Header as='h1'>Collateral</Header>
                            <Message info>
                          The amount in the collateral will be your maximum loan amount.
                          To increase this, you can add more collateral or have a co-maker
                          willing to co-make your loan.
                            </Message>
                            <Segment>
                              <Form.Group widths='equal'>
                                <Form.Field>
                                  <label>Collateral Bond</label>
                                  <Field
                                    name='share.total_share_amount'
                                    placeholder='Share Purchase'
                                    component={InputField}
                                    type='number'
                                    readOnly={isReadOnly}
                                    validate={composeValidators(required, loanAllowed(2000))}
                                  />
                                </Form.Field>
                                <Form.Field>
                                  <label>Collateral Per Amount</label>
                                  <Field
                                    name='share.share_per_amount'
                                    readOnly
                                    placeholder='Share Per Amount'
                                    component={InputField}
                                  />
                                </Form.Field>
                                <Form.Field>
                                  <label>Collateral in Shares</label>
                                  <Field
                                    name='share.share_count'
                                    readOnly
                                    placeholder='Total Amount'
                                    component={InputField}
                                  />
                                </Form.Field>
                              </Form.Group>
                            </Segment>
                          </Form.Field>
                        </Form.Group>
                    }
                    {
                      inPreview &&
                        <Form.Field>
                          <Header as='h2'>Invoices</Header>
                          <Segment>
                            <Message info>
                              You need to settle your account first before being approved.
                            </Message>
                            <Table celled>
                              <Table.Header>
                                <Table.Row>
                                  <Table.HeaderCell>Invoice Type</Table.HeaderCell>
                                  <Table.HeaderCell>Amount</Table.HeaderCell>
                                  <Table.HeaderCell>Status</Table.HeaderCell>
                                  <Table.HeaderCell>Created at</Table.HeaderCell>
                                </Table.Row>
                              </Table.Header>
                              <Table.Body>
                                {
                                  initalValues?.invoices?.map(v => (
                                    <Table.Row key={v.uuid}>
                                      <Table.Cell>{v.invoice_type}</Table.Cell>
                                      <Table.Cell>{v.amount}</Table.Cell>
                                      <Table.Cell negative={(v.status === 'pending')}>{v.status}</Table.Cell>
                                      <Table.Cell>{dayjs(v.created_at).format('LLLL')}</Table.Cell>
                                    </Table.Row>
                                  ))
                                }
                              </Table.Body>
                            </Table>
                          </Segment>
                        </Form.Field>
                    }
                    {
                      !user_type && !inPreview &&
                        <Form.Field className='flex justify-end'>
                          <FormSpy subscription={{ pristine: true, invalid: true }}>
                            {
                              ({ pristine, invalid }) => (
                                <Button
                                  type='button'
                                  onClick={() => setConfirmSubmit(true)}
                                  disabled={pristine || invalid}
                                  primary
                                >
                                  Submit For Approval
                                </Button>
                              )
                            }
                          </FormSpy>
                        </Form.Field>
                    }
                    {
                      user_type === 'approver' &&
                        <Form.Field className='flex justify-end'>
                          <Button
                            positive
                            type='submit'
                            onClick={() => {
                              setFormStatus('approved')
                            }}
                          >
                              Approved
                          </Button>
                        </Form.Field>
                    }
                    <Modal
                      size='tiny'
                      open={confirmSubmit}
                      onClose={() => setConfirmSubmit(false)}
                    >
                      <Modal.Header>
                        Before You Submit Your Info
                      </Modal.Header>
                      <Modal.Content>
                        <Message info>
                          You accept the terms and conditions of joining the cooperative
                        </Message>
                        <Message info>
                          Please pay the colleteral amount and a membership fee of 250 pesos.
                        </Message>
                        <Message info>
                          You will recieve an email detailing your application.
                        </Message>
                        <Message warning>
                          After paying. Your Membership will be subject for approval
                          by one of the board of trustees.
                        </Message>
                      </Modal.Content>
                      <Modal.Actions className='flex justify-between'>
                        <Button
                          type='button'
                          loading={onSubmitAsync.isPending}
                          negative
                          onClick={() => setConfirmSubmit(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type='submit'
                          primary
                          loading={onSubmitAsync.isPending}
                          onClick={submit}
                        >
                          Submit
                        </Button>
                      </Modal.Actions>
                    </Modal>
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
