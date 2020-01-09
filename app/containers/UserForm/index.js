import React from 'react'
import { Grid, Segment, Header, Button, Select } from 'semantic-ui-react'

const countryOptions = [
  { key: 'af', value: 'af', text: 'Afghanistan' },
  { key: 'ax', value: 'ax', text: 'Aland Islands' },
  { key: 'al', value: 'al', text: 'Albania' },
  { key: 'dz', value: 'dz', text: 'Algeria' },
  { key: 'as', value: 'as', text: 'American Samoa' },
  { key: 'ad', value: 'ad', text: 'Andorra' },
  { key: 'ao', value: 'ao', text: 'Angola' },
  { key: 'ai', value: 'ai', text: 'Anguilla' },
  { key: 'ag', value: 'ag', text: 'Antigua' },
  { key: 'ar', value: 'ar', text: 'Argentina' },
  { key: 'am', value: 'am', text: 'Armenia' },
  { key: 'aw', value: 'aw', text: 'Aruba' },
  { key: 'au', value: 'au', text: 'Australia' },
  { key: 'at', value: 'at', text: 'Austria' },
  { key: 'az', value: 'az', text: 'Azerbaijan' },
  { key: 'bs', value: 'bs', text: 'Bahamas' },
  { key: 'bh', value: 'bh', text: 'Bahrain' },
  { key: 'bd', value: 'bd', text: 'Bangladesh' },
  { key: 'bb', value: 'bb', text: 'Barbados' },
  { key: 'by', value: 'by', text: 'Belarus' },
  { key: 'be', value: 'be', text: 'Belgium' },
  { key: 'bz', value: 'bz', text: 'Belize' },
  { key: 'bj', value: 'bj', text: 'Benin' },
]

export default () => {
  return (
    <Grid centered verticalAlign='middle'>
      <Grid.Column computer={13}>
        <Segment>
          <Header as='h3'>User Form</Header>
          <Form>
            <Form.Field>
              <label>Email Address</label>
              <input placeholder='email address' type='email' />
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
            <Form.Field>
              <label>type</label>
              <Select placeholder='User Type' options={countryOptions} />
            </Form.Field>
            <Form.Field>
              <Button primary>Submit</Button>
            </Form.Field>
          </Form>
        </Segment>
      </Grid.Column>
    </Grid>
  )
}
