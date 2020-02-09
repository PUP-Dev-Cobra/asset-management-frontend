import React, { useEffect, useState, Fragment } from 'react'
import {
  Button,
  Grid,
  Label,
  Header,
  Icon,
  List,
  Segment
} from 'semantic-ui-react'
import { useAsync } from 'react-async'
import dayjs from 'dayjs'

import { fetchMember } from 'Containers/MemberForm/async'
import { fetchRecieptAsync } from './async'

export default ({ history, match }) => {
  const [memberInfo, setMemberInfo] = useState({})
  const [recieptList, setRecieptList] = useState([])

  const fetchMemberQuery = useAsync({
    promiseFn: fetchMember,
    uuid: match?.params?.id
  })

  const fetchRecieptsQuery = useAsync({
    promiseFn: fetchRecieptAsync,
    uuid: match?.params?.id
  })

  useEffect(() => {
    if (fetchMemberQuery?.isResolved) {
      setMemberInfo(fetchMemberQuery?.data)
    }
  }, [fetchMemberQuery?.isResolved])

  useEffect(() => {
    if (fetchRecieptsQuery?.isResolved) {
      setRecieptList(fetchRecieptsQuery?.data?.response)
    }
  }, [fetchRecieptsQuery?.isResolved])

  return (
    <Grid centered container padded='vertically'>
      <Grid.Column computer={14}>
        <Grid>
          <Grid.Row stretched>
            <Grid.Column>
              <Segment>
                <ul className='block'>
                  <li className='flex justify-end'>
                    <Button
                      icon
                      onClick={() => history.push(`/member/${match?.params?.id}`)}
                    >
                      <Icon name='edit' />
                    </Button>
                  </li>
                  <li>
                    <dl className='flex text-lg'>
                      <div className='flex-1'>
                        <dt className='font-bold'>Name</dt>
                        <dd className='pb-2'>
                          {
                            `
                              ${memberInfo?.last_name},
                              ${memberInfo?.first_name}
                            `
                          }
                          {
                            memberInfo?.middle_name &&
                            `,${memberInfo?.middle_name}`
                          }
                        </dd>
                        <dt className='font-bold'>Nickname</dt>
                        <dd className='pb-2'>
                          {
                            `${memberInfo?.nickname}`
                          }
                        </dd>
                        <dt className='font-bold'>Date of Birth</dt>
                        <dd className='pb-2'>
                          {
                            dayjs(memberInfo?.dob).format('ll')
                          }
                        </dd>
                        <dt className='font-bold'>Age</dt>
                        <dd className='pb-2'>
                          {
                            dayjs().diff(memberInfo?.dob, 'years')
                          }
                        </dd>
                        <dt className='font-bold'>Gender</dt>
                        <dd className='pb-2'>
                          {
                            memberInfo?.gender
                          }
                        </dd>
                      </div>
                      <div className='flex-1'>
                        <dt className='font-bold'>Religion</dt>
                        <dd className='pb-2'>
                          {
                            memberInfo?.religion
                          }
                        </dd>
                        <dt className='font-bold'>Civil Status</dt>
                        <dd className='pb-2'>
                          {
                            memberInfo?.civil_status
                          }
                        </dd>
                        {
                          memberInfo?.spouse_name &&
                            <Fragment>
                              <dt className='font-bold'>Spouse Name</dt>
                              <dd className='pb-2'>
                                {
                                  memberInfo?.spouse_name
                                }
                              </dd>
                            </Fragment>
                        }
                        <dt className='font-bold'>Home Address</dt>
                        <dd className='pb-2'>
                          {
                            memberInfo?.address
                          }
                        </dd>
                        <dt className='font-bold'>Contact-No</dt>
                        <dd className='pb-2'>
                          {
                            memberInfo?.contact_no
                          }
                        </dd>
                      </div>
                    </dl>
                  </li>
                </ul>
              </Segment>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row stretched columns='equal'>
            <Grid.Column>
              <Segment>
                <Header>Loan History</Header>
                <List divided verticalAlign='middle' selection>
                  {
                    memberInfo?.loans?.map(r => (
                      <List.Item key={r.uuid}>
                        <List.Content floated='right'>
                          {r?.loan_amount}
                        </List.Content>
                        <List.Content>
                          <Label horizontal>{r?.status}</Label>
                          {dayjs(r?.created_at).format('lll')}
                        </List.Content>
                      </List.Item>
                    ))
                  }
                </List>
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment>
                <Header>Payment History</Header>
                <List divided selection verticalAlign='middle'>
                  {
                    recieptList?.map(r => (
                      <List.Item key={r.uuid}>
                        <List.Content floated='right'>
                          {r.amount}
                        </List.Content>
                        <List.Content>
                          {r.or_number}
                        </List.Content>
                      </List.Item>
                    ))
                  }
                </List>
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Grid.Column>
    </Grid>

  )
}
