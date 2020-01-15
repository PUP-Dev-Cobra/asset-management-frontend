import React from 'react'
import { Button, Form, Grid, Segment, Header, Image } from 'semantic-ui-react'
import logoImg from 'Assets/logo.jpg'


const LoginForm = props => {  
const {history}= props
 return (

    <Grid textAlign='center' style={{ height: '90vh' }} verticalAlign='middle' relaxed='very' stackable>
    <Grid.Column style={{ maxWidth: 450 }}>
      <Header as='h2' color='teal' textAlign='center'>
        <Image src={logoImg} /> Login to your Account
      </Header>
      <Form>
        <Segment stacked>
          <Form.Input
            icon='user'
            iconPosition='left'
            label='Email'
            placeholder='email'
          />
          <Form.Input
            icon='lock'
            iconPosition='left'
            label='Password'
            type='password'
          />
          <Button primary onClick={() => history.push('/member/list')}> 
              Login
          </Button>
        </Segment>
      </Form>
    </Grid.Column>
    </Grid>
  )
}
export default LoginForm
