import React, {
  Fragment,
  useContext,
  useEffect,
  useState
} from 'react'
import { Table, Select } from 'semantic-ui-react'
import { useAsync } from 'react-async'
import { withRouter } from 'react-router-dom'
import dayjs from 'dayjs'

import Context from './../context'
import { ListDisbursment } from './../async'

const Disbursment = ({ history }) => {
  const { setIsLoading } = useContext(Context)
  const [list, setList] = useState([])
  const [filter, setFilter] = useState('all')
  const listDisbursmentQuery = useAsync({ promiseFn: ListDisbursment })

  useEffect(() => {
    if (listDisbursmentQuery?.isResolved) {
      setList(listDisbursmentQuery?.data?.response)
    }
  },
  [listDisbursmentQuery?.isResolved])

  useEffect(() => {
    setIsLoading(listDisbursmentQuery?.isPending)
  }, [listDisbursmentQuery?.isPending])

  return (
    <Fragment>
      <Select
        placeholder='Status'
        onChange={(_, { value }) => setFilter(value)}
        defaultValue='all'
        options={[
          { value: 'all', text: 'All', key: 0, default: true },
          { value: 'void', text: 'Void', key: 1 },
          { value: 'issued', text: 'Issued', key: 2 }
        ]}
      />
      <Table celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Loan Participants</Table.HeaderCell>
            <Table.HeaderCell>Check Voucher</Table.HeaderCell>
            <Table.HeaderCell>Check Number</Table.HeaderCell>
            <Table.HeaderCell>Amount</Table.HeaderCell>
            <Table.HeaderCell>Issued At</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {
            list
              .filter(r => (filter !== 'all') ? r.status === filter : r)
              .map(r => (
                <Table.Row
                  key={r.uuid}
                  onClick={() => history.push(`/loan/${r?.loanInfo?.uuid}`)}
                >
                  <Table.Cell>
                    <ul className='p-0 m-0 list-none'>
                      {
                    r?.loanInfo?.member &&
                      <li>
                        {`
                          ${r?.loanInfo?.member?.last_name},
                          ${r?.loanInfo?.member?.first_name},
                          ${r?.loanInfo?.member?.middle_name ?? ''}
                        `}
                      </li>
                      }
                      {
                    r?.loanInfo?.co_maker_1 &&
                      <li>
                        {`
                          ${r?.loanInfo?.co_maker_1?.last_name},
                          ${r?.loanInfo?.co_maker_1?.first_name},
                          ${r?.loanInfo?.co_maker_1?.middle_name ?? ''}
                        `}
                      </li>
                      }
                      {
                    r?.loanInfo?.co_maker_2 &&
                      <li>
                        {`
                          ${r?.loanInfo?.co_maker_2?.last_name},
                          ${r?.loanInfo?.co_maker_2?.first_name},
                          ${r?.loanInfo?.co_maker_2?.middle_name ?? ''}
                        `}
                      </li>
                      }
                    </ul>
                  </Table.Cell>
                  <Table.Cell>
                    {r?.check_voucher}
                  </Table.Cell>
                  <Table.Cell>
                    {r?.check_number}
                  </Table.Cell>
                  <Table.Cell>
                    {r?.loanInfo?.loan_amount?.toLocaleString()}
                  </Table.Cell>
                  <Table.Cell>
                    {dayjs(r?.created_at).format('llll')}
                  </Table.Cell>
                  <Table.Cell
                    positive={r?.status === 'issued'}
                    negative={r?.status === 'void'}
                  >
                    {r?.status}
                  </Table.Cell>
                </Table.Row>
              ))
          }
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell>
              Total Issued Amount
            </Table.HeaderCell>
            <Table.HeaderCell />
            <Table.HeaderCell />
            <Table.HeaderCell className='font-bold'>
              {
              list
                ?.filter(r => r.status !== 'void')
                ?.map(r => r.loanInfo.loan_amount)
                ?.reduce((p, c) => p + c, 0)
                ?.toLocaleString()
              }
            </Table.HeaderCell>
            <Table.HeaderCell />
            <Table.HeaderCell />
          </Table.Row>
        </Table.Footer>
      </Table>
    </Fragment>
  )
}

export default withRouter(Disbursment)
