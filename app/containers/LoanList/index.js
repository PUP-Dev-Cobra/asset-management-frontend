import React from 'react'
import {Table,Pagination,Grid,Input,Label,Segment,Button,Icon} from 'semantic-ui-react'
export default () => {
  return (
   <Grid centered style={{height: '90vh' }} verticalAlign='middle'>
     <Grid.Column width='13' >
       <Segment stacked>
       <Grid textAlign='left'>
         <Grid.Row style={{ paddingBottom: "1rem" }}>
            <Grid.Column  computer='3'>
            <Input icon='search' iconPosition='left' placeholder='search' />
            </Grid.Column>
            <Grid.Column  computer='12' verticalAlign='middle'>
              <Label as='a' tag> Filter 1</Label>
              <Label as='a' tag> Filter 2</Label>
              <Label as='a' tag> Filter 3</Label>
            </Grid.Column>
            <Grid.Column computer={1} textAlign="right"> 
                <Button icon>
                  <Icon name='filter' />
                </Button>
              </Grid.Column>
         </Grid.Row>
         
         <Grid.Column computer='16'>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell> Name </Table.HeaderCell>
                  <Table.HeaderCell> Amount </Table.HeaderCell>
                  <Table.HeaderCell> Remaining </Table.HeaderCell>
                  <Table.HeaderCell> Status </Table.HeaderCell>
                  <Table.HeaderCell> Date </Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                <Table.Row>
                  <Table.Cell> Info</Table.Cell>
                  <Table.Cell> Info</Table.Cell>
                  <Table.Cell> Info</Table.Cell>
                  <Table.Cell> Info</Table.Cell>
                  <Table.Cell> Info</Table.Cell>
                </Table.Row>
              </Table.Body>

              <Table.Footer>
                <Table.Row>
                  <Table.HeaderCell colSpan='5' textAlign='right'>
                    <Pagination defaultActivePage={5} totalPages={10} />
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Footer>
            </Table>
         </Grid.Column>
       </Grid>
       </Segment>
     </Grid.Column>
   </Grid>
  )
}
