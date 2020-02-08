import React, { useEffect } from 'react'
import {
  Button,
  Form,
  Grid,
  Segment,
  Header,
  Message,
  Image
} from 'semantic-ui-react'
import { useAsync } from 'react-async'
import { Form as ReactForm, Field } from 'react-final-form'

import { authenticate } from './async'
import logoImg from 'Assets/logo.jpg'

const LoginForm = ({ history }) => {
  const { data, error, isPending, run } = useAsync({
    deferFn: authenticate
  })

  const onSubmit = values => {
    run({ ...values })
  }

  useEffect(() => {
    if (data) {
      localStorage.setItem('jwt_token', data.token)
      const dataToken = data.token.split('.')
      const { user_type } = JSON.parse(atob(dataToken[1]))

      localStorage.setItem('user_type', user_type)
      switch (user_type) {
        case 'admin':
          location.href = '/user/list'
          break
        case 'member':
          location.href = '/member/detail'
          break
        case 'approver':
          location.href = '/loan/list'
          break
        case 'teller':
          location.href = 'member/list'
      }
    }
  }, [data])

  return (
    <Grid textAlign='center' style={{ height: '90vh' }} verticalAlign='middle' relaxed='very' stackable>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' color='teal' textAlign='center'>
          <Image src={logoImg} /> Login to your Account
        </Header>
        <ReactForm onSubmit={onSubmit}>
          {
            ({ handleSubmit }) => (
              <Form onSubmit={handleSubmit} loading={isPending}>
                <Segment stacked>
                  {
                    error &&
                      <Message negative>
                        {error}
                      </Message>
                  }
                  <Field name='email'>
                    {
                      ({ input }) => (
                        <Form.Input
                          input={() => <input {...input} type='email' />}
                          icon='user'
                          iconPosition='left'
                          label='Email'
                          placeholder='email'
                        />
                      )
                    }
                  </Field>
                  <Field name='password'>
                    {
                      ({ input }) => (
                        <Form.Input
                          input={() => <input {...input} type='password' />}
                          icon='lock'
                          iconPosition='left'
                          label='Password'
                          type='password'
                        />
                      )
                    }
                  </Field>
                  <Button primary type='submit'>
                    Login
                  </Button>
                </Segment>
              </Form>
            )
          }
        </ReactForm>
      </Grid.Column>
    </Grid>
  )
}

export default LoginForm
