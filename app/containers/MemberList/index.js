import React from 'react'
import {
  Grid,
  Input,
  Table,
  Segment,
  Dimmer,
  Message,
  Loader,
  Select
} from 'semantic-ui-react'
import get from 'lodash/get'
import { useAsync } from 'react-async'
import dayjs from 'dayjs'

import { memberListAsync } from './async'

export default ({ history }) => {
  const { data, error, isPending } = useAsync({ promiseFn: memberListAsync })
  const memberList = get(data, 'response') || []

  return (
    <Grid centered container padded='vertically'>
      <Grid.Column computer={13}>
        <Segment stacked>
          <Dimmer active={isPending} inverted>
            <Loader />
          </Dimmer>
          <Grid textAlign='left'>
            <Grid.Row style={{ paddingBottom: '1rem' }}>
              <Grid.Column stretched>
                <ul
                  style={{ display: 'flex', listStyleType: 'none', padding: 0 }}
                >
                  <li style={{ paddingRight: '1rem' }}>
                    <Input
                      icon='search'
                      iconPosition='left'
                      placeholder='search'
                      style={{ minWidth: '5rem' }}
                    />
                  </li>
                  <li>
                    <Select
                      placeholder='Field Type'
                      options={[
                        { key: 0, value: 'email', selected: true, text: 'Email' },
                        { key: 1, value: 'user_type', text: 'User Type' },
                        { key: 2, value: 'status', text: 'Status' }
                      ]}
                    />
                  </li>
                </ul>
              </Grid.Column>
            </Grid.Row>
            {
              error &&
                <Grid.Row>
                  <Grid.Column stretched>
                    <Message negative>
                      {error}
                    </Message>
                  </Grid.Column>
                </Grid.Row>
            }
            <Grid.Row>
              <Grid.Column>
                <Table celled selectable>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Member Name</Table.HeaderCell>
                      <Table.HeaderCell>Date of Birth</Table.HeaderCell>
                      <Table.HeaderCell>Address</Table.HeaderCell>
                      <Table.HeaderCell>Contact No</Table.HeaderCell>
                      <Table.HeaderCell>Status</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {
                      memberList.map((r, i) => (
                        <Table.Row
                          key={r.uuid}
                          onClick={() => history.push(`/member/${r.uuid}`)}
                        >
                          <Table.Cell>
                            {
                              `
                                ${r.last_name}, ${r.first_name}, ${(r.middle_name) ? r.middle_name : ''}
                              `
                            }
                          </Table.Cell>
                          <Table.Cell>
                            {
                              dayjs(r.dob).format('MMM DD, YYYY')
                            }
                          </Table.Cell>
                          <Table.Cell>
                            {
                              r.address
                            }
                          </Table.Cell>
                          <Table.Cell>
                            {
                              r.contact_no
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
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>

      </Grid.Column>
    </Grid>
  )
}
