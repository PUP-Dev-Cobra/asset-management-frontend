import React from 'react'
import { Select, Grid, Button, Table, Input, Label, Statistic, Icon, Segment } from 'semantic-ui-react'

export default () => {
  return (
    <Grid centered container verticalAlign='middle' padded='vertically'>
      <Grid.Column computer='13'>
        <Segment>
          <Grid textAlign='left'>
            <Grid.Row style={{ paddingbottom: '1ren' }}>
              <Grid.Column computer='3'>
                <Select />
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column computer='3'>
                <Input icon='search' iconPosition='left' placeholder='search' />
              </Grid.Column>

              <Grid.Column computer='12'>
                <Label as='a' tag> Filter 1 </Label>
                <Label as='a' tag> Filter 2 </Label>
                <Label as='a' tag> Filter 3 </Label>
              </Grid.Column>

              <Grid.Column computer={1} textAlign='right'>
                <Button icon>
                  <Icon name='filter' />
                </Button>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column computer='16'>

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

              <Grid.Column computer='8'>
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

              <Grid.Column computer='8'>
                <Statistic horizontal size='mini' floated='right'>
                  <Statistic.Label> Total  </Statistic.Label>
                  <Statistic.Value> 999.99 </Statistic.Value>
                </Statistic>
              </Grid.Column>
            </Grid.Row>

          </Grid>
        </Segment>
      </Grid.Column>
    </Grid>
  )
}
