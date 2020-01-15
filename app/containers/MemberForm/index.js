import React from 'react'
import { Grid, Segment, Header, Form, Table, Radio, Dropdown,Select ,Button} from 'semantic-ui-react'

const TermsOfPayment = [
  {key: 'F', value: 'F', text: 'Full payment'},
  {key: 'I', value: 'I', text: 'Installment'},
]

const Terms = [
  {key: 'M', value: 'M', text: 'Monthly'},
  {key: 'S', value: 'S', text: 'Semi-Monthly'},
  {key: 'B', value: 'B', text: 'Bi-Monthly'},
]
export default props => {
  const {history} = props
  return (
    <Grid centered verticalAlign='middle' container padded='vertically'>
      <Grid.Column computer={13}>
        <Segment>
          <Header as='h1'> Membership Form </Header>
          <Form>
            <Form.Group>
              <Form.Field>
                <label> First Name </label>
                <input placeholder='First Name' type='text' />
              </Form.Field>
              <Form.Field>
                <label> Middle Name </label>
                <input placeholder='Middle Name' type='text' />
              </Form.Field>
              <Form.Field>
                <label> Last Name</label>
                <input placeholder='Last Name' type='text' />
              </Form.Field>
              <Form.Field>
                <label> Nick Name</label>
                <input placeholder='Nick Name' type='text' />
              </Form.Field>
            </Form.Group>
            <Form.Group>
              <Form.Field>
                <label> Date of Birth</label>
                <input type='date' />
              </Form.Field>
              <Form.Field>
                <label> Age</label>
                <input placeholder='auto fill' type='number' />
              </Form.Field>
              <Form.Field>
                <Dropdown text='Gender'>
                  <Dropdown.Menu>
                    <Dropdown.Item text='Male' />
                    <Dropdown.Item text='Female' />
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Field>
              <Form.Field>
                <Dropdown text='Civil Status'>
                  <Dropdown.Menu>
                    <Dropdown.Item text='Single' />
                    <Dropdown.Item text='Married' />
                    <Dropdown.Item text='Widowed' />
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Field>
            </Form.Group>
            <Form.Group>
              <Form.Field>
                <label> Home Address</label>
                <input placeholder='Home Address' type='text' />
              </Form.Field>
              <Form.Field>
                <label> Email </label>
                <input placeholder='auto fill' type='text' />
              </Form.Field>
            </Form.Group>
            <Form.Group>
              <Form.Field>
                <label> Occupation/Source of Income </label>
                <input placeholder='occupation/source of income' type='text' />
              </Form.Field>
              <Form.Field>
                <label> TIN/OSCA </label>
                <input placeholder='tin/osca' type='text' />
              </Form.Field>
            </Form.Group>
            <Form.Group>
              <Form.Field>
                <label> Monthly Income </label>
                <Radio label='1-5k' />
                <Radio label='6-10k' />
                <Radio label='11-20k' />
                <Radio label='21-30k' />
                <Radio label='30k++' />
              </Form.Field>
              <Form.Field>
                <label> Religion </label>
                <input placeholder='religion' type='text' />
              </Form.Field>
            </Form.Group>
            <Form.Field>
              <label> Spouse's Name</label>
              <input placeholder='spouse name' type='text' />
            </Form.Field>
            <Form.Field>
              <Table celled>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell> Benificiaries </Table.HeaderCell>
                    <Table.HeaderCell> Relationship </Table.HeaderCell>
                    <Table.HeaderCell> Date of Birth</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell> Info </Table.Cell>
                    <Table.Cell> Info </Table.Cell>
                    <Table.Cell> Info </Table.Cell>
                  </Table.Row>

                  <Table.Row>
                    <Table.Cell> Info </Table.Cell>
                    <Table.Cell> Info </Table.Cell>
                    <Table.Cell> Info </Table.Cell>
                  </Table.Row>

                  <Table.Row>
                    <Table.Cell> Info </Table.Cell>
                    <Table.Cell> Info </Table.Cell>
                    <Table.Cell> Info </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Form.Field>

            <Form.Field>
              <Header as='h1'>Share</Header>
                <Segment>
                  <label> Share </label>
                  <input placeholder='share' input='number' />

                  <label> Total Amount Share </label>
                  <input placeholder='total amount share' input='number' />

                  <label> Terms of Payment </label>
                  <Select placeholder='terms of payment' options={TermsOfPayment} />

                  <label> Terms </label>
                  <Select placeholder='terms of payment' options={Terms} />
                </Segment>
            </Form.Field>

            <Form.Field>
              <div style={{display: 'flex', justifyContent: 'flex-end'}}>
              <Button onClick={() => history.push('/member')}>
                Submit
              </Button>
              </div>
            </Form.Field>
          </Form> 
        </Segment>
      </Grid.Column>
    </Grid>
  )
}
