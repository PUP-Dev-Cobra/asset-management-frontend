import React from 'react'
import { Grid, Header, Segment,  Input, Table, Pagination, Label, Button, Icon} from 'semantic-ui-react'


export default () => {
  return (
      <Grid centered style={{ height: '90vh'}} verticalAlign="middle">
         <Grid.Column computer='13'>
           <Segment stacked>  
           <Grid textAlign='left'>

             <Grid.Row style={{ paddingBottom: "1rem" }} >
               <Grid.Column computer={3}>
                 <Input placeholder='Search...' />
               </Grid.Column>
              <Grid.Column computer={12} verticalAlign='middle'>
                <Label as='a' tag>Filter 1</Label>
                <Label as='a' tag>Filter 2</Label>
                <Label as='a' tag>Filter 3</Label>
              </Grid.Column>
              <Grid.Column computer={1} textAlign="right"> 
                <Button icon>
                  <Icon name='filter' />
                </Button>
              </Grid.Column>
             </Grid.Row>
             <Grid.Row>
                <Grid.Column style={{ paddingBottom: "5rem" }}>
                  <Table celled>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell> User </Table.HeaderCell>
                        <Table.HeaderCell> User </Table.HeaderCell>
                        <Table.HeaderCell> User </Table.HeaderCell>
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

                  <Table.Footer>
                    <Table.Row>
                      <Table.HeaderCell colSpan='3' textAlign="right">
                        <Pagination defaultActivePage={5} totalPages={10} />
                      </Table.HeaderCell>
                    </Table.Row>
                  </Table.Footer>
                  </Table>
                </Grid.Column>
             </Grid.Row>
           </Grid>
           </Segment>
         </Grid.Column>
      </Grid>
  )
}
