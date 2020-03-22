import React, { useContext } from 'react'
import { Table } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import dayjs from 'dayjs'

import Context from './../context'

const Loans = ({ history }) => {
  const { loans } = useContext(Context)

  return (
    <Table
      celled
      compact
      selectable
    >
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Co-owners</Table.HeaderCell>
          <Table.HeaderCell>Amount</Table.HeaderCell>
          <Table.HeaderCell>Created At</Table.HeaderCell>
          <Table.HeaderCell>Updated At</Table.HeaderCell>
          <Table.HeaderCell>Status</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {
          loans?.map(r => (
            <Table.Row key={r.uuid} onClick={() => history.push(`/loan/${r.uuid}`)}>
              <Table.Cell>
                <ul className='p-0 m-0 list-none'>
                  <li>placeholder</li>
                  <li>placeholder</li>
                </ul>
              </Table.Cell>
              <Table.Cell>
                {r?.loan_amount?.toLocaleString()}
              </Table.Cell>
              <Table.Cell>{dayjs(r.created_at).format('LLLL')}</Table.Cell>
              <Table.Cell>
                {
                  r.updated_at &&
                    dayjs(r.updated_at).format('LLLL')
                }
              </Table.Cell>
              <Table.Cell
                negative={r.status === 'pending'}
                positive={r.status === 'approved'}
              >
                {r.status}
              </Table.Cell>
            </Table.Row>
          ))
        }
      </Table.Body>
    </Table>
  )
}

export default withRouter(Loans)
