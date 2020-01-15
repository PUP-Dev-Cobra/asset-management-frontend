import React from 'react'
import { Grid, Segment, Header, Button, Select, Form } from 'semantic-ui-react'

const countryOptions = [
  { key: 'ad', value: 'ad', text: 'Admin' },
  { key: 'tl', value: 'tl', text: 'Teller' },
  { key: 'mm', value: 'mm', text: 'Member' },
  { key: 'ap', value: 'ap', text: 'Approver' }
]

export default props => {
  const {history} = props
  return (
    <Grid centered verticalAlign='middle' container padded ='vertically'>
      <Grid.Column computer={13}>
        <Segment>
          <Header as='h3'>User Form</Header>
          <Form>
            <Form.Field>
              <label>Name</label>
              <input placeholder='Name' type='text'/>
            </Form.Field>
            <Form.Field>
              <label>Email Address</label>  
              <input placeholder='email address' type='email' />
            </Form.Field>
            <Form.Group width='equal'>
              <Form.Field>
                <label>Password</label>
                <input placeholder='password' type='password' />
              </Form.Field>
              <Form.Field>
                <label>Retype Password</label>
                <input placeholder='password' type='password' />
              </Form.Field>
            </Form.Group>
            <Form.Group width='equal'>
            <Form.Field>
              <label>type</label>
              <Select placeholder='User Type' options={countryOptions} /> 
            </Form.Field>
            <Form.Field>
              <label>Member</label>
              <Select placeholder='Member'/>
            </Form.Field>
            </Form.Group>
            <Form.Group width='eqal'>
            <Form.Field>
              <Button primary onClick={() => history.push('/user')} >Submit</Button>
            </Form.Field>
            <Form.Field>
              <Button primary>Disable</Button>
            </Form.Field>
            </Form.Group>
          </Form>
        </Segment>
      </Grid.Column>
    </Grid>
  )
}
