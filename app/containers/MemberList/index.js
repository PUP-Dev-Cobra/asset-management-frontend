import React from 'react'
import { Grid, Input, Label, Button, Table, Pagination } from 'semantic-ui-react'

export default () => {
  return (
    <Grid centered verticalAlign='middle'>
      <Grid.Column computer={13}>
        <Grid textAlign='left'>
          <Grid.Row>
            <Grid.Column computer={4}>
              <Input icon='search' iconPosition='left' placeholder='search' />
            </Grid.Column>
            <Grid.Column computer={12} verticalAlign='middle'>
              <Label as='a' tag>Filter 1</Label>
              <Label as='a' tag>Filter 2</Label>
              <Label as='a' tag>Filter 3</Label>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Member Name</Table.HeaderCell>
                  <Table.HeaderCell>Date of Birth</Table.HeaderCell>
                  <Table.HeaderCell>Asset</Table.HeaderCell>
                  <Table.HeaderCell>Loan</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Daniel Jimenez</Table.Cell>
                  <Table.Cell>March 21, 1998</Table.Cell>
                  <Table.Cell>99,999.99</Table.Cell>
                  <Table.Cell>99,999.99</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Pagination defaultActivePage={5} totalPages={10} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Grid.Column>
    </Grid>
  )
}
