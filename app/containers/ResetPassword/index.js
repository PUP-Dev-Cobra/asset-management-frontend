import React, { useEffect } from 'react'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { Grid, Header, Form, Segment, Button, Message } from 'semantic-ui-react'
import { Form as ReactFinalForm, Field, FormSpy } from 'react-final-form'
import { useAsync } from 'react-async'

import { required, isMatchPassword } from 'App/validations'
import { composeValidators } from 'App/utils'

import { resetPassword as resetPasswordAsync } from './async'

export default ({ match, history }) => {
  const resetQuery = useAsync({ deferFn: resetPasswordAsync })

  const onSubmit = values => {
    resetQuery.run({
      password: values.password,
      hash: match?.params?.hash
    })
  }

  useEffect(() => {
    if (resetQuery?.isResolved) {
      toast.success(resetQuery?.data?.response)
      history.push('/')
    }
  }, [resetQuery?.isResolved])

  return (
    <Grid centered className='h-screen' verticalAlign='middle'>
      <Grid.Column className='max-w-lg w-full'>
        <ReactFinalForm onSubmit={onSubmit}>
          {
            ({ handleSubmit }) => (
              <Form onSubmit={handleSubmit} loading={resetQuery?.isPending}>
                <Segment stacked>
                  <Header>Reset Your Password</Header>
                  {
                    resetQuery?.error && !resetQuery?.data &&
                      <Message negative>
                        {resetQuery?.error.message}
                      </Message>
                  }
                  {
                    resetQuery?.data && !resetQuery?.error &&
                      <Message positive>
                        {resetQuery?.data?.response}
                      </Message>
                  }
                  <Form.Field>
                    <Field
                      name='password'
                      type='password'
                      component='input'
                      placeholder='Password'
                      validate={composeValidators(required)}
                    />
                  </Form.Field>
                  <Form.Field>
                    <Field
                      name='re_password'
                      type='password'
                      component='input'
                      validate={composeValidators(required, isMatchPassword)}
                      placeholder='Re-Input Password'
                    />
                  </Form.Field>
                  <FormSpy subscription={{ errors: true, dirty: true }}>
                    {
                      props => {
                        return (
                          <Form.Field>
                            {
                              props.dirty && props.errors?.re_password &&
                                <Message negative>
                                  {props.errors?.re_password}
                                </Message>
                            }
                          </Form.Field>
                        )
                      }
                    }
                  </FormSpy>
                  <FormSpy
                    subscription={
                      { pristine: true, invalid: true, dirty: true, touched: true }
                    }
                  >
                    {
                      ({ pristine, invalid }) => {
                        return (
                          <Form.Field className='flex justify-between items-center'>
                            <div>
                              <Link to='/'>Back to Login</Link>
                            </div>
                            <Button primary disabled={(pristine || invalid)}>
                              Reset Password
                            </Button>
                          </Form.Field>
                        )
                      }
                    }
                  </FormSpy>
                </Segment>
              </Form>
            )
          }
        </ReactFinalForm>
      </Grid.Column>
    </Grid>
  )
}
