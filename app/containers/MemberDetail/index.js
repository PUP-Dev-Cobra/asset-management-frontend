import React, { useEffect, useState } from 'react'
import {
  Tab,
  Grid,
  Label,
  Statistic,
  Segment
} from 'semantic-ui-react'
import { useAsync } from 'react-async'
import dayjs from 'dayjs'

import Context from './context'
import Invoices from './sections/Invoices'
import Loans from './sections/Loans'
import MemberActions from './sections/MemberActions'
import Reciepts from './sections/Reciepts'
import { fetchMember, validateLoanQualifier } from './async'
import { userInfo } from 'Helpers/utils'

const panes = [
  { menuItem: 'Invoices', render: () => <Tab.Pane><Invoices /></Tab.Pane> },
  { menuItem: 'Loans', render: () => <Tab.Pane><Loans /></Tab.Pane> },
  { menuItem: 'Reciepts', render: () => <Tab.Pane><Reciepts /></Tab.Pane> }
]

export default ({ history, match, location }) => {
  const params = new URLSearchParams(location.search)
  const { user_type } = userInfo()

  const [paneIndex, setPaneIndex] = useState(params.get('panel') || 0)
  const [memberInfo, setMemberInfo] = useState({})
  const [invoices, setInvoices] = useState([])
  const [loans, setLoans] = useState([])
  const [loanErrors, setLoanErrors] = useState(null)
  const [reciepts, setReciepts] = useState([])

  const onChangePane = (e, { activeIndex }) => setPaneIndex(activeIndex)

  const fetchMemberQuery = useAsync({
    promiseFn: fetchMember,
    deferFn: fetchMember,
    uuid: match?.params?.id
  })

  const fetchLoanQualify = useAsync({
    promiseFn: validateLoanQualifier,
    uuid: match?.params?.id
  })

  useEffect(() => {
    if (fetchMemberQuery?.isResolved) {
      const { invoices, loans, reciepts, ...memberData } = fetchMemberQuery?.data
      setInvoices(invoices)
      setLoans(loans)
      setMemberInfo(memberData)
      setReciepts(reciepts)
    }
  }, [fetchMemberQuery?.isResolved])

  useEffect(() => {
    if (fetchLoanQualify.data) {
      const response = fetchLoanQualify?.data?.response
      setLoanErrors((response.length > 0) ? response : null)
    }
  }, [fetchLoanQualify.isResolved])

  return (
    <Context.Provider
      value={{
        invoices,
        loans,
        reciepts,
        loanErrors,
        runMember: fetchMemberQuery.run,
        member_id: match?.params?.id
      }}
    >
      <Grid centered container padded='vertically'>
        <Grid.Column computer={14}>
          <Grid>
            <Grid.Row stretched>
              <Grid.Column>
                <Segment
                  compact
                  className='relative'
                  onClick={() => history.push(`/member/${match?.params?.id}`)}
                  loading={fetchMemberQuery?.isPending}
                >
                  <div className='flex justify-between'>
                    <div>
                      <h1 className='my-2'>
                        {
                          `
                          ${memberInfo?.last_name},
                          ${memberInfo?.first_name}
                          `
                        }
                      </h1>
                      <h2 className='my-0 font-normal text-xl'>name</h2>
                    </div>
                    <div className='self-end'>
                      Member Since <span className='italic' title={dayjs(memberInfo?.created_at).fromNow()}>{dayjs(memberInfo?.created_at).format('LL')}</span>
                    </div>
                  </div>
                  <Label
                    className='absolute top-0 right-0'
                    color={(memberInfo?.status === 'approved') ? 'green' : 'grey'}
                  >
                    {memberInfo?.status}
                  </Label>
                </Segment>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns='equal'>
              {
                fetchMemberQuery?.isResolved && user_type === 'member' &&
                  <MemberActions />
              }
              <Grid.Column>
                <div className='flex justify-end'>
                  <div className='mx-2'>
                    <Segment>
                      <Statistic size='small'>
                        <Statistic.Value>
                          {memberInfo?.available_collateral?.toLocaleString()}
                        </Statistic.Value>
                        <Statistic.Label>
                          Available Collateral
                        </Statistic.Label>
                      </Statistic>
                    </Segment>
                  </div>
                  <div>
                    <Segment>
                      <Statistic size='small'>
                        <Statistic.Value>
                          {memberInfo?.outstanding_invoice?.toLocaleString()}
                        </Statistic.Value>
                        <Statistic.Label>
                          Outsanding Balance
                        </Statistic.Label>
                      </Statistic>
                    </Segment>
                  </div>
                </div>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row stretched>
              <Grid.Column>
                <Tab panes={panes} activeIndex={paneIndex} onTabChange={onChangePane} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Grid.Column>
      </Grid>
    </Context.Provider>
  )
}
