import React from 'react'
import {Table,Pagination,Grid,Search,Label} from 'semantic-ui-react'
export default () => {
  return (
   <Grid centered style={{height: '90vh' }}>
     <Grid.Column width='14' >
       <Grid>
         <Grid.Row>
            <Grid.Column fluid computer='8'>
              <Search />
            </Grid.Column>
            <Grid.Column  computer='8'>
              <Label as='a' tag> Filter 1 </Label>
              <Label as='a' tag> Filter 2 </Label>
              <Label as='a' tag> Filter 3 </Label>
            </Grid.Column>
         </Grid.Row>
         
         <Grid.Column computer='15'>
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
     </Grid.Column>
   </Grid>
  )
}
