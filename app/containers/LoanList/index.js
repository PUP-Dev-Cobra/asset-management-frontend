import React from 'react'
import {
  Table,
  Grid,
  Input,
  Segment,
  Dimmer,
  Loader
} from 'semantic-ui-react'
import qs from 'query-string'
import dayjs from 'dayjs'
import { useAsync } from 'react-async'

import { list as loanListAsync } from './async'

export default ({ history, location }) => {
  const loanListFetch = useAsync({ promiseFn: loanListAsync })
  const loanList = loanListFetch?.data?.response ?? []
  const params = qs.parse(location?.search)

  return (
    <Grid centered container padded='vertically'>
      <Grid.Column width='13'>
        <Segment stacked>
          <Dimmer
            active={loanListFetch.isPending}
            inverted
          >
            <Loader />
          </Dimmer>

          <Grid textAlign='left'>
            <Grid.Row>
              <Grid.Column computer='3'>
                <Input icon='search' iconPosition='left' placeholder='search' />
              </Grid.Column>
            </Grid.Row>

            <Grid.Column computer='16'>
              <Table
                celled
                selectable
              >
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Date of Birth</Table.HeaderCell>
                    <Table.HeaderCell>Amount</Table.HeaderCell>
                    <Table.HeaderCell>Remaining</Table.HeaderCell>
                    <Table.HeaderCell>Status</Table.HeaderCell>
                    <Table.HeaderCell>Payment Start Date</Table.HeaderCell>
                    <Table.HeaderCell>Created Date</Table.HeaderCell>
                    <Table.HeaderCell>Updated Date</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {
                    loanList.map(r => {
                      return (
                        <Table.Row
                          key={r.uuid}
                          active={params.last_update === r.uuid}
                          onClick={() => history.push(`/loan/${r.uuid}`)}
                        >
                          <Table.Cell>
                            {
                              `
                                ${r.member.last_name},
                                ${r.member.first_name},
                                ${(r.member.middle_name)
                                  ? r.member.middle_name
                                  : ''
                                }
                              `
                            }
                          </Table.Cell>
                          <Table.Cell>
                            {`${dayjs(r.member.dob).format('LL')}`}
                          </Table.Cell>
                          <Table.Cell>
                            {`${r.loan_amount.toLocaleString()}`}
                          </Table.Cell>
                          <Table.Cell>XXXX</Table.Cell>
                          <Table.Cell
                            positive={(r.status === 'approved')}
                            negative={(r.status === 'rejected')}
                          >
                            {`${r.status}`}
                          </Table.Cell>
                          <Table.Cell>
                            {`${r.loan_payment_start_date}`}
                          </Table.Cell>
                          <Table.Cell>
                            {dayjs(r.created_at).format('LLL')}
                          </Table.Cell>
                          <Table.Cell>
                            {r.updated_at ? dayjs(r.updated_at).format('LLL') : 'N/A'}
                          </Table.Cell>
                        </Table.Row>
                      )
                    })
                  }
                </Table.Body>

                <Table.Footer>
                  <Table.Row>
                    <Table.HeaderCell colSpan={7}>
                        Total Loans
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                      {loanList?.length}
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
