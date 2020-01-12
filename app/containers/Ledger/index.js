import React from 'react'
import {Select,Grid,Button,Table ,Search, Label, Statistic} from 'semantic-ui-react'

export default () => {
  return (
    <Grid centered container padded='vertically'>
      <Grid.Column computer='14'>
        <Grid>
          <Grid.Row>
            <Grid.Column  >
              <Select/>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column computer='8'>
              <Search />
            </Grid.Column>

            <Grid.Column computer='8'>
              <Label as='a' tag> Filter 1 </Label>
              <Label as='a' tag> Filter 2 </Label>
              <Label as='a' tag> Filter 3 </Label>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column computer='15'>

              <Table celled>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell colspan={9} textAlign='center'> Encashment </Table.HeaderCell>
                  </Table.Row>
                  <Table.Row>
                  <Table.HeaderCell> Loan Code </Table.HeaderCell>
                  <Table.HeaderCell> Cash On Hand </Table.HeaderCell>
                  <Table.HeaderCell> Recievable </Table.HeaderCell>
                  <Table.HeaderCell> Share Capital </Table.HeaderCell>
                  <Table.HeaderCell> Membership Fee </Table.HeaderCell>
                  <Table.HeaderCell> Penalty Fee </Table.HeaderCell>
                  <Table.HeaderCell> Sundries </Table.HeaderCell>
                  <Table.HeaderCell> Debit </Table.HeaderCell>
                  <Table.HeaderCell> Credit </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                  <Table.Body>
                    <Table.Row>
                      <Table.Cell> Info </Table.Cell>
                      <Table.Cell> Info </Table.Cell>
                      <Table.Cell> Info </Table.Cell>
                      <Table.Cell> Info </Table.Cell>
                      <Table.Cell> Info </Table.Cell>
                      <Table.Cell> Info </Table.Cell>
                      <Table.Cell> Info </Table.Cell>
                      <Table.Cell> Info </Table.Cell>
                      <Table.Cell> Info </Table.Cell>
                    </Table.Row>
                  </Table.Body>

                  <Table.Body>
                    <Table.Row>
                      <Table.Cell> Info </Table.Cell>
                      <Table.Cell> Info </Table.Cell>
                      <Table.Cell> Info </Table.Cell>
                      <Table.Cell> Info </Table.Cell>
                      <Table.Cell> Info </Table.Cell>
                      <Table.Cell> Info </Table.Cell>
                      <Table.Cell> Info </Table.Cell>
                      <Table.Cell> Info </Table.Cell>
                      <Table.Cell> Info </Table.Cell>
                    </Table.Row>
                  </Table.Body>

                  <Table.Body>
                    <Table.Row>
                      <Table.Cell> Info </Table.Cell>
                      <Table.Cell> Info </Table.Cell>
                      <Table.Cell> Info </Table.Cell>
                      <Table.Cell> Info </Table.Cell>
                      <Table.Cell> Info </Table.Cell>
                      <Table.Cell> Info </Table.Cell>
                      <Table.Cell> Info </Table.Cell>
                      <Table.Cell> Info </Table.Cell>
                      <Table.Cell> Info </Table.Cell>
                    </Table.Row>
                  </Table.Body>
              </Table>
            </Grid.Column>
          </Grid.Row>
        <Grid.Row>
          <Grid.Column computer='8'>
            <Button>
              + Add Transaction
            </Button>
          </Grid.Column>
            
          <Grid.Column computer='7'>
            <Statistic horizontal size='mini' floated='right'> 
              <Statistic.Label> Total  </Statistic.Label>
              <Statistic.Value> 999.99 </Statistic.Value>
            </Statistic>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column computer='16'>
              <Table celled>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell colspan={8} textAlign='center'> Disbursement </Table.HeaderCell>
                  </Table.Row>
                  <Table.Row>
                  <Table.HeaderCell> Check Voucher </Table.HeaderCell>
                  <Table.HeaderCell> Check Number </Table.HeaderCell>
                  <Table.HeaderCell> Cash In bank </Table.HeaderCell>
                  <Table.HeaderCell> Loan Recievable </Table.HeaderCell>
                  <Table.HeaderCell> Interest Per Loan </Table.HeaderCell>
                  <Table.HeaderCell> Service Charge</Table.HeaderCell>
                  <Table.HeaderCell> Capital Build Up </Table.HeaderCell>
                  <Table.HeaderCell> Penalty </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                  <Table.Body>
                    <Table.Row>
                      <Table.Cell> Info </Table.Cell>
                      <Table.Cell> Info </Table.Cell>
                      <Table.Cell> Info </Table.Cell>
                      <Table.Cell> Info </Table.Cell>
                      <Table.Cell> Info </Table.Cell>
                      <Table.Cell> Info </Table.Cell>
                      <Table.Cell> Info </Table.Cell>
                      <Table.Cell> Info </Table.Cell>
                      
                    </Table.Row>
                  </Table.Body>

                  <Table.Body>
                    <Table.Row>
                      <Table.Cell> Info </Table.Cell>
                      <Table.Cell> Info </Table.Cell>
                      <Table.Cell> Info </Table.Cell>
                      <Table.Cell> Info </Table.Cell>
                      <Table.Cell> Info </Table.Cell>
                      <Table.Cell> Info </Table.Cell>
                      <Table.Cell> Info </Table.Cell>
                      <Table.Cell> Info </Table.Cell>
                      
                    </Table.Row>
                  </Table.Body>

                  <Table.Body>
                    <Table.Row>
                      <Table.Cell> Info </Table.Cell>
                      <Table.Cell> Info </Table.Cell>
                      <Table.Cell> Info </Table.Cell>
                      <Table.Cell> Info </Table.Cell>
                      <Table.Cell> Info </Table.Cell>
                      <Table.Cell> Info </Table.Cell>
                      <Table.Cell> Info </Table.Cell>
                      <Table.Cell> Info </Table.Cell>
                      
                    </Table.Row>
                  </Table.Body>
              </Table>
         </Grid.Column>             
        </Grid.Row>

        <Grid.Row>
          <Grid.Column computer='8'>
            <Button>
              + Add Transaction
            </Button>
          </Grid.Column>
            
          <Grid.Column computer='7'>
            <Statistic horizontal size='mini' floated='right'> 
              <Statistic.Label> Total  </Statistic.Label>
              <Statistic.Value> 999.99 </Statistic.Value>
            </Statistic>
          </Grid.Column>
        </Grid.Row>

        </Grid>
      </Grid.Column>
    </Grid>
  )
}
