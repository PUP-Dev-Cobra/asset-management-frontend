import React from 'react'
import { Grid, Segment, Header, Button, Form } from 'semantic-ui-react'

const userTypes = [
  { key: 'ad', value: 'admin', text: 'Admin' },
  { key: 'tl', value: 'teller', text: 'Teller' },
  { key: 'mm', value: 'member', text: 'Member' },
  { key: 'ap', value: 'approver', text: 'Approver' }
]

export default props => {
  const { history } = props
  return (
    <Grid centered verticalAlign='middle' container padded='vertically'>
      <Grid.Column stretched>
        <Segment>
          <Header as='h3'>User Form</Header>
          <Form>
            <Form.Field>
              <label>Name</label>
              <input placeholder='Name' type='text' />
            </Form.Field>
            <Form.Field>
              <label>Email Address</label>
              <input placeholder='email address' type='email' />
            </Form.Field>
            <Form.Group widths='equal'>
              <Form.Field>
                <label>Password</label>
                <input placeholder='password' type='password' />
              </Form.Field>
              <Form.Field>
                <label>Retype Password</label>
                <input placeholder='password' type='password' />
              </Form.Field>
            </Form.Group>
            <Form.Group widths='equal'>
              <Form.Field>
                <label>User Type</label>
                <Form.Select
                  as='select'
                >
                  {
                    userTypes.map((o, i) => (
                      <option value={o.value} key={i}>{o.text}</option>
                    ))
                  }
                </Form.Select>
              </Form.Field>
              <Form.Field>
                <label>Member</label>
                <Form.Select
                  as='select'
                >
                  {
                    userTypes.map((o, i) => (
                      <option value={o.value} key={i}>{o.text}</option>
                    ))
                  }
                </Form.Select>
              </Form.Field>
            </Form.Group>
            <Form.Group width='equal'>
              <Form.Field>
                <Button negative>Disable</Button>
              </Form.Field>
              <Form.Field>
                <Button primary onClick={() => history.push('/user')}>Submit</Button>
              </Form.Field>
            </Form.Group>
          </Form>
        </Segment>
      </Grid.Column>
    </Grid>
  )
}
