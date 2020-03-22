import React, { useContext } from 'react'
import { Table } from 'semantic-ui-react'
import dayjs from 'dayjs'

import Context from './../context'

const Reciepts = () => {
  const { reciepts } = useContext(Context)
  return (
    <Table
      celled
      compact
    >
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Type</Table.HeaderCell>
          <Table.HeaderCell>Amount</Table.HeaderCell>
          <Table.HeaderCell>Created At</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {
          reciepts?.map(r => (
            <Table.Row key={r.uuid}>
              <Table.Cell>{r.reciept_type}</Table.Cell>
              <Table.Cell>{r.amount.toLocaleString()}</Table.Cell>
              <Table.Cell>{dayjs(r.created_at).format('LLLL')}</Table.Cell>
            </Table.Row>
          ))
        }
      </Table.Body>
    </Table>
  )
}

export default Reciepts
