import React, { useState, useEffect, Fragment } from 'react'
import {
  Button,
  Form,
  Grid,
  Icon,
  Header,
  Message,
  Segment,
  Table
} from 'semantic-ui-react'
import { Form as ReactFinalForm, FormSpy, Field } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'
import { useAsync } from 'react-async'
import { toast } from 'react-toastify'
import arrayMutators from 'final-form-arrays'
import dayjs from 'dayjs'
import createDecorator from 'final-form-calculate'

import { required } from 'App/validations'
import { userInfo } from 'Helpers/utils'
import { InputField, SelectField } from 'Components/InputFields'

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
    field: 'share.share_count',
    updates: {
      'share.total_share_amount': (v, aV) => parseInt(v * aV.share.share_per_amount)
    }
  }
)

export default ({ history, match }) => {
  const uuid = match?.params?.id
  const { user_type } = userInfo()
  let fetchAsync = {}
  let onSubmitAsync = useAsync({
    deferFn: createAsync
  })
  const [initalValues, setInitialValues] = useState(null)
  const [forDeletion, setForDeletion] = useState([])
  const [formStatus, setFormStatus] = useState(null)

  const isReadOnly = (
    formStatus === 'approved' ||
    user_type === 'approver'
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
    if (user_type === 'teller') {
      memberForm = {
        ...values
      }
      forSending.forDeletion = forDeletion
      delete memberForm?.share?.total_share_amount
    }
    memberForm.status = formStatus
    forSending.memberForm = { ...memberForm }
    forSending.uuid = uuid

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
        const action = (uuidRaw) ? 'Update' : 'Created'
        toast.success(`${action} successfully`)

        history.push(`/member/list?last_update=${uuidRaw}`)
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
        fetchedData.share = fetchAsync.data.shares[0]
        delete fetchAsync.data.shares
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

  return (
    <Grid centered verticalAlign='middle' container padded='vertically'>
      <Grid.Column computer={13}>
        <Segment>
          <Header as='h1'>Membership Form</Header>
          {
            formStatus === 'approved' &&
              <Message positive>
                This Member is already approved
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
                        <label>Contact-No</label>
                        <Field
                          name='contact_no'
                          placeholder='Contact No'
                          component={InputField}
                          readOnly={isReadOnly}
                          validate={required}
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
                          disabled={isReadOnly}
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
                          <FieldArray name='beneficiaries'>
                            {
                              ({ fields }) =>
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
                                      user_type === 'teller' && formStatus !== 'approved' &&
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
                          </FieldArray>
                        </Table.Body>
                        {
                          user_type === 'teller' &&
                          formStatus !== 'approved' &&
                            <Table.Footer fullWidth>
                              <Table.Row>
                                <Table.HeaderCell
                                  colSpan='4'
                                >
                                  <div
                                    style={{ display: 'flex', justifyContent: 'flex-end' }}
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
                    </Form.Field>

                    <Form.Group widths='equal'>
                      <Form.Field>
                        <Header as='h1'>Share</Header>
                        <Segment>
                          <Form.Group widths='equal'>
                            <Form.Field>
                              <label>Share Purchase</label>
                              <Field
                                name='share.share_count'
                                placeholder='Share Purchase'
                                component={InputField}
                                type='number'
                                readOnly={isReadOnly}
                                validate={required}
                              />
                            </Form.Field>
                            <Form.Field>
                              <label>Share Per Amount</label>
                              <Field
                                name='share.share_per_amount'
                                readOnly
                                placeholder='Share Per Amount'
                                component={InputField}
                              />
                            </Form.Field>
                            <Form.Field>
                              <label>Total Amount</label>
                              <Field
                                name='share.total_share_amount'
                                readOnly
                                placeholder='Total Amount'
                                component={InputField}
                              />
                            </Form.Field>
                          </Form.Group>
                        </Segment>
                      </Form.Field>
                    </Form.Group>

                    <Form.Field>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end'
                      }}
                      >
                        {
                          formStatus !== 'approved' &&
                            <FormSpy>
                              {
                                ({ pristine, invalid }) => {
                                  if (user_type === 'teller') {
                                    return (
                                      <Fragment>
                                        <Button
                                          type='submit'
                                          primary
                                          onClick={() => {
                                            setFormStatus('pending')
                                            setTimeout(submit, 100)
                                          }}
                                          disabled={(pristine || invalid)}
                                        >
                                          Submit For Approval
                                        </Button>
                                      </Fragment>
                                    )
                                  }

                                  if (user_type === 'approver') {
                                    return (
                                      <Fragment>
                                        <Button
                                          type='submit'
                                          negative
                                          onClick={() => {
                                            setFormStatus('reject')
                                            setTimeout(submit, 100)
                                          }}
                                          disabled={(pristine || invalid)}
                                        >
                                          Reject Member
                                        </Button>
                                        <Button
                                          type='submit'
                                          positive
                                          onClick={() => {
                                            setFormStatus('approved')
                                            setTimeout(submit, 100)
                                          }}
                                          disabled={(pristine || invalid)}
                                        >
                                          Approve Member
                                        </Button>
                                      </Fragment>
                                    )
                                  }
                                }
                              }
                            </FormSpy>
                        }
                      </div>
                    </Form.Field>
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
