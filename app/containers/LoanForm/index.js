import React from 'react'
import {Grid, Form, Select, Segment, List, Button, Header} from 'semantic-ui-react'

export default props => { 
  const {history} = props
  return (
   <Grid centered style={{ height: '90vh'}} container padded='vertically'>
     <Grid.Column computer='13'>
       <Segment>
       <Grid>
        <Grid.Row>
          <Grid.Column>
            <Header as='h3'> Loan Form </Header>
            <Form>     
              <Form.Field>
                <label>Member</label>
                <Select placeholder='Member' />
              </Form.Field>

              <Form.Field>
                <label> Coop Member</label>
                <Select placeholder='Coop Member' />
              </Form.Field>

              <Form.Field>
                <label>Coop Member</label>
                <Select placeholder='Coop Member' />
              </Form.Field>

              <Form.Field>
                <label>Loan Amount</label>
                <input type='number'/>
              </Form.Field>

              <Form.Field>
                <label>Loan Amount</label>
                <input type='number'/>
              </Form.Field>

              <Form.Field>
                <Grid centered>
                  <Grid.Column computer='3'>
                  <Segment>
                    <List divided verticalAlign='middle'>
                      <List.Item>
                        <List.Content floated='right'> 99.99 </List.Content>
                        <List.Content> Loan </List.Content>
                      </List.Item>

                      <List.Item>
                        <List.Content floated='right'> 99.99 </List.Content>
                        <List.Content> Loan </List.Content>
                      </List.Item>

                      <List.Item>
                        <List.Content floated='right'> 99.99 </List.Content>
                        <List.Content> Service Charge </List.Content>
                      </List.Item>

                      <List.Item>
                        <List.Content floated='right'> 99.99 </List.Content>
                        <List.Content> Capital Build Up </List.Content>
                      </List.Item>

                      <List.Item>
                        <List.Content floated='right'> 99.99 </List.Content>
                        <List.Content> Interest </List.Content>
                      </List.Item>

                      <List.Item>
                        <List.Content floated='right'> 99.99 </List.Content>
                        <List.Content> Not Pay Amount </List.Content>
                      </List.Item>

                      <List.Item>
                        <List.Content floated='right'> 99.99 </List.Content>
                        <List.Content> Month Payment Amount </List.Content>
                      </List.Item>
                    </List>
                  </Segment>
                  </Grid.Column>
                </Grid>
              </Form.Field>

              <Form.Field>
                <Button floated='right' primary onClick={() => history.push('/loan/list')}> Save </Button>
                <Button floated='right' color='teal'> For Approval </Button>
              </Form.Field>
            </Form>
          </Grid.Column>
        </Grid.Row>
       </Grid>
       </Segment>
     </Grid.Column>
   </Grid>
  )
}
