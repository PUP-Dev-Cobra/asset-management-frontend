import React, { useContext } from 'react'
import {
  Table,
  Grid,
  Header,
  Segment
} from 'semantic-ui-react'

import Context from './../context'

const RecieptTable = props => {
  const { reciepts } = useContext(Context)
  return (
    <Grid.Row>
      <Grid.Column computer={13}>
        <Segment>
          <Header as='h3'>Payment History</Header>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>For Payment Term</Table.HeaderCell>
                <Table.HeaderCell>OR Number</Table.HeaderCell>
                <Table.HeaderCell>Amount</Table.HeaderCell>
                <Table.HeaderCell>Paid At</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {
                reciepts.map(r => (
                  <Table.Row key={r.uuid}>
                    <Table.Cell>{r.loan_payment_term}</Table.Cell>
                    <Table.Cell>{r.or_number}</Table.Cell>
                    <Table.Cell>{r.amount}</Table.Cell>
                    <Table.Cell>date</Table.Cell>
                  </Table.Row>
                ))
              }
            </Table.Body>
          </Table>
        </Segment>
      </Grid.Column>
    </Grid.Row>
  )
}

export default RecieptTable
