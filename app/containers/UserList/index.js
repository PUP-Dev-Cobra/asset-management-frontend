import React, { useEffect } from 'react'
import {
  Grid,
  Input,
  Select,
  Dimmer,
  Loader,
  Segment,
  Message,
  Table
} from 'semantic-ui-react'
import qs from 'query-string'
import dayjs from 'dayjs'
import { useAsync } from 'react-async'

import { userListAsync } from './async'

export default ({ history, location }) => {
  const { data, error, isPending, run } = useAsync({ deferFn: userListAsync })
  const params = qs.parse(location?.search)
  const userList = data?.response

  useEffect(() => {
    run()
  }, [])

  return (
    <Grid centered container padded='vertically'>
      <Grid.Column computer='13'>
        <Segment stacked>
          <Dimmer active={isPending} inverted>
            <Loader />
          </Dimmer>
          <Grid textAlign='left'>

            <Grid.Row style={{ paddingBottom: '1rem' }} stretched>
              <Grid.Column stretched>
                <ul style={{ display: 'flex', listStyleType: 'none', padding: 0 }}>
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
              <Grid.Column style={{ paddingBottom: '5rem' }}>
                <Table celled selectable>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Email</Table.HeaderCell>
                      <Table.HeaderCell>Name</Table.HeaderCell>
                      <Table.HeaderCell>User Type</Table.HeaderCell>
                      <Table.HeaderCell>Status</Table.HeaderCell>
                      <Table.HeaderCell>Created at</Table.HeaderCell>
                      <Table.HeaderCell>Updated at</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    {
                      userList &&
                      userList.map(({ uuid, email, name, status, user_type, created_at, updated_at }, i) => (
                        <Table.Row
                          key={uuid}
                          active={params.last_update === uuid}
                          onClick={() => history.push(`/user/${uuid}`)}
                        >
                          <Table.Cell>{email}</Table.Cell>
                          <Table.Cell>{name}</Table.Cell>
                          <Table.Cell>{user_type}</Table.Cell>
                          <Table.Cell positive={status === 'active'}>
                            {status}
                          </Table.Cell>
                          <Table.Cell>
                            {
                              dayjs(created_at).format('LLL')
                            }
                          </Table.Cell>
                          <Table.Cell>
                            {
                              (updated_at) ? dayjs(updated_at).format('LLL') : 'N/A'
                            }
                          </Table.Cell>
                        </Table.Row>
                      ))
                    }
                  </Table.Body>

                  <Table.Footer>
                    <Table.Row>
                      <Table.HeaderCell>Total Members</Table.HeaderCell>
                      <Table.HeaderCell />
                      <Table.HeaderCell />
                      <Table.HeaderCell />
                      <Table.HeaderCell />
                      <Table.HeaderCell>
                        {userList?.length}
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
