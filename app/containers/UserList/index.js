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
import { useAsync } from 'react-async'

import { userListAsync } from './async'

export default ({ history }) => {
  const { data, error, isPending, run } = useAsync({ deferFn: userListAsync })

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
                        { key: 'em', value: 'email', selected: true, text: 'Email' },
                        { key: 'em', value: 'user_type', text: 'User Type' },
                        { key: 'em', value: 'status', text: 'Status' }
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
                <Table celled>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Email</Table.HeaderCell>
                      <Table.HeaderCell>User Type</Table.HeaderCell>
                      <Table.HeaderCell>Status</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    {
                      data &&
                      data.response.map(({ uuid, email, status, user_type }, i) => (
                        <Table.Row key={i} onClick={() => history.push(`/user/${uuid}`)}>
                          <Table.Cell>{email}</Table.Cell>
                          <Table.Cell>{user_type}</Table.Cell>
                          <Table.Cell positive={status === 'active'}>{status}</Table.Cell>
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
