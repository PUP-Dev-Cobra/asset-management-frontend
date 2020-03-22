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
import { Link } from 'react-router-dom'
import { useAsync } from 'react-async'
import { Form as ReactForm, Field } from 'react-final-form'

import { authenticate } from './async'
import logoImg from 'Assets/logo.jpg'

const redirect = (userType, memberId) => {
  switch (userType) {
    case 'admin':
      location.href = '/user/list'
      break
    case 'member':
      location.href = `/member/detail/${memberId}`
      break
    case 'approver':
      location.href = '/loan/list'
      break
    case 'teller':
      location.href = 'member/list'
  }
}

const LoginForm = ({ history }) => {
  const { data, error, isPending, isResolved, run } = useAsync({
    deferFn: authenticate
  })

  const onSubmit = values => {
    run({ ...values })
  }

  useEffect(() => {
    const jwt = localStorage.getItem('jwt_token')
    if (jwt) {
      const dateToken = jwt.split('.')
      const { user_type, member_id } = JSON.parse(atob(dateToken[1]))

      redirect(user_type, member_id)
    }
  }, [])

  useEffect(() => {
    if (data) {
      localStorage.setItem('jwt_token', data.token)
      const dataToken = data.token.split('.')
      const { user_type, member_id } = JSON.parse(atob(dataToken[1]))

      localStorage.setItem('user_type', user_type)
      localStorage.setItem('member_id', member_id)
      redirect(user_type, member_id)
    }
  }, [isResolved])

  return (
    <Grid textAlign='center' className='h-screen' verticalAlign='middle' relaxed='very' stackable>
      <Grid.Column className='max-w-lg w-full'>
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
                  <div className='py-2 flex justify-between'>
                    <Link to='/member/create'>Join Cooperative</Link>
                    <Link to='/forgot-password'>Forgot Password</Link>
                  </div>
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
