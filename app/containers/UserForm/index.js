import React, { Fragment, useEffect, useState } from 'react'
import { Grid, Segment, Header, Button, Form, Message } from 'semantic-ui-react'
import { Form as ReactFinalForm, Field, FormSpy } from 'react-final-form'
import { useAsync } from 'react-async'
import { toast } from 'react-toastify'

import { InputField, SelectField } from 'Components/InputFields'
import { email, required, isMatchPassword } from 'App/validations'
import { composeValidators } from 'App/utils'

import { option, create, update, get as asyncGet, memberList as memberListAsync } from './async'

const MemberSelection = ({ userType }) => {
  const memberList = useAsync({
    promiseFn: memberListAsync
  })

  return (
    <Form.Field>
      <label>Member</label>
      <Field
        name='member_id'
        component={SelectField}
        validate={
          composeValidators(required)
        }
        options={
          memberList
            ?.data
            ?.response
            ?.map(i =>
              ({
                text: `${i.last_name}, ${i.first_name}, ${(i.middle_name) ?? ''}`,
                value: i.uuid
              })
            ) ?? []
        }
      />
    </Form.Field>
  )
}

export default ({ history, match }) => {
  const uuid = match?.params?.id
  const [initValues, setInitvalues] = useState({})
  const [overridePassword, setOverridePassword] = useState(!uuid || false)
  const formAsyncCb = uuid ? update : create
  let userData = {}

  if (uuid) {
    userData = useAsync({ promiseFn: asyncGet, uuid })
  }
  const optionsUserStatus = useAsync({
    promiseFn: option, option_name: 'user_status'
  })
  const optionsUserType = useAsync({
    promiseFn: option, option_name: 'user_type'
  })
  const formAsync = useAsync({
    deferFn: formAsyncCb
  })

  const userTypes = optionsUserType?.data?.response ?? []
  const userStatus = optionsUserStatus?.data?.response ?? []

  const onSubmit = values => {
    const { re_password, ...rest } = values
    if (uuid) {
      rest.uuid = uuid
    }
    formAsync.run(rest)
  }

  useEffect(() => {
    const { error, finishedAt } = formAsync
    if (!error && finishedAt) {
      const uuidRaw = (uuid) || formAsync?.data?.response
      const action = (uuidRaw) ? 'Update' : 'Created'
      toast.success(`${action} successfully`)
      history.push(`/user/list?last_update=${uuidRaw}`)
    }

    if (error) {
      toast.error(error)
    }
  }, [formAsync.finishedAt])

  useEffect(() => {
    const data = userData?.data?.response
    setInitvalues(data)
  }, [userData.data])

  return (
    <Grid
      centered
      container
      padded='vertically'
      verticalAlign='middle'
    >
      <Grid.Column stretched>
        <Segment>
          <Header as='h3'>User Form</Header>
          <ReactFinalForm onSubmit={onSubmit} initialValues={initValues || {}}>
            {
              ({ handleSubmit }) => {
                return (
                  <Form onSubmit={handleSubmit}>
                    {
                      formAsync.error &&
                        <Message negative>
                          {
                            formAsync.error
                          }
                        </Message>
                    }
                    <Form.Field>
                      <label>Name</label>
                      <Field
                        name='name'
                        component={InputField}
                        placeholder='Name'
                        validate={composeValidators(required)}
                      />
                    </Form.Field>
                    <Form.Field>
                      <label>Email Address</label>
                      <Field
                        name='email'
                        component={InputField}
                        placeholder='Email Address'
                        type='email'
                        validate={composeValidators(email, required)}
                      />
                    </Form.Field>
                    {
                      overridePassword &&
                        <Form.Group widths='equal'>
                          <Form.Field>
                            <label>Password</label>
                            <Field
                              name='password'
                              component={InputField}
                              placeholder='Password'
                              type='password'
                              validate={composeValidators(required)}
                            />
                          </Form.Field>
                          <Form.Field>
                            <label>Retype Password</label>
                            <Field
                              name='re_password'
                              component={InputField}
                              placeholder='Password'
                              type='password'
                              validate={
                                composeValidators(required, isMatchPassword)
                              }
                            />
                          </Form.Field>
                        </Form.Group>
                    }
                    {
                      !overridePassword &&
                        <Segment placeholder>
                          <Button
                            type='button'
                            onClick={() => setOverridePassword(!overridePassword)}
                          >
                            Overide Password
                          </Button>
                        </Segment>
                    }
                    <Form.Group widths='equal'>
                      <Form.Field>
                        <label>Status</label>
                        <Field
                          name='status'
                          component={SelectField}
                          options={userStatus.map(
                            v => ({ text: v.option_value, value: v.option_value })
                          )}
                          validate={
                            composeValidators(required)
                          }
                        />
                      </Form.Field>
                      <Form.Field>
                        <label>User Type</label>
                        <Field
                          name='user_type'
                          component={SelectField}
                          options={userTypes.map(
                            v => ({ text: v.option_value, value: v.option_value })
                          )}
                          validate={
                            composeValidators(required)
                          }
                        />
                      </Form.Field>
                      <FormSpy subscription={{
                        values: { user_type: true }
                      }}
                      >
                        {
                          ({ values }) => {
                            const user_type = values?.user_type
                            if (user_type === 'member') {
                              return (
                                <MemberSelection
                                  userType={user_type}
                                />
                              )
                            }
                            return <Fragment />
                          }
                        }
                      </FormSpy>
                    </Form.Group>
                    <Form.Group
                      width='equal'
                      className='flex justify-end'
                    >
                      <Form.Field>
                        <FormSpy
                          subscription={{ invalid: true, pristine: true }}
                        >
                          {
                            ({ invalid, pristine }) => {
                              return (
                                <Button
                                  disabled={invalid || pristine}
                                  primary
                                >
                                  Submit
                                </Button>
                              )
                            }
                          }
                        </FormSpy>
                      </Form.Field>
                    </Form.Group>
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
