import React, { useEffect } from 'react'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { Grid, Header, Form, Segment, Button, Message } from 'semantic-ui-react'
import { Form as ReactFinalForm, Field } from 'react-final-form'
import { useAsync } from 'react-async'

import { resetPassword as resetPasswordAsync } from './async'

export default ({ history }) => {
  const resetQuery = useAsync({ deferFn: resetPasswordAsync })

  const onSubmit = values => {
    resetQuery.run(values)
  }

  useEffect(() => {
    if (resetQuery?.isResolved) {
      toast.success('Reset password link sent to email')
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
                  <Header>Forgot Your Password</Header>
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
                      name='email'
                      type='email'
                      component='input'
                      placeholder='Email'
                    />
                  </Form.Field>
                  <Form.Field className='flex justify-between items-center'>
                    <div>
                      <Link to='/'>Back to Login</Link>
                    </div>
                    <Button primary>
                      Reset Password
                    </Button>
                  </Form.Field>
                </Segment>
              </Form>
            )
          }
        </ReactFinalForm>
      </Grid.Column>
    </Grid>
  )
}
