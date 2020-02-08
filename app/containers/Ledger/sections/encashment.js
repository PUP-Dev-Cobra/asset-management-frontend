import React, { useState, useEffect, useContext } from 'react'
import { Table } from 'semantic-ui-react'
import { useAsync } from 'react-async'
import { withRouter } from 'react-router-dom'
import dayjs from 'dayjs'

import Context from './../context'
import { ListEncashment } from './../async'

const Encashment = ({ history }) => {
  const { setIsLoading } = useContext(Context)
  const [list, setList] = useState([])
  const listEncashmentQuery = useAsync({ promiseFn: ListEncashment })

  useEffect(() => {
    if (listEncashmentQuery?.isResolved) {
      setList(listEncashmentQuery?.data?.response)
    }
  },
  [listEncashmentQuery?.isResolved])

  useEffect(() => {
    setIsLoading(listEncashmentQuery?.isPending)
  }, [listEncashmentQuery?.isPending])

  return (
    <Table celled selectable>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Loan Participants</Table.HeaderCell>
          <Table.HeaderCell>Check Voucher</Table.HeaderCell>
          <Table.HeaderCell>Check Number</Table.HeaderCell>
          <Table.HeaderCell>Amount</Table.HeaderCell>
          <Table.HeaderCell>Issued At</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {
          list.map(r => (
            <Table.Row
              key={r.uuid}
              onClick={() =>
                history.push(`/loan/${r?.disbursmentInfo?.loanInfo?.uuid}`)}
            >
              <Table.Cell>
                <ul className='p-0 m-0 list-none'>
                  {
                    r?.disbursmentInfo?.loanInfo?.member &&
                      <li>
                        {`
                          ${r?.disbursmentInfo?.loanInfo?.member?.last_name},
                          ${r?.disbursmentInfo?.loanInfo?.member?.first_name},
                          ${r?.disbursmentInfo?.loanInfo?.member?.middle_name ?? ''}
                        `}
                      </li>
                  }
                  {
                    r?.disbursmentInfo?.loanInfo?.co_maker_1 &&
                      <li>
                        {`
                          ${r?.disbursmentInfo?.loanInfo?.co_maker_1?.last_name},
                          ${r?.disbursmentInfo?.loanInfo?.co_maker_1?.first_name},
                          ${r?.disbursmentInfo?.loanInfo?.co_maker_1?.middle_name ?? ''}
                        `}
                      </li>
                  }
                  {
                    r?.disbursmentInfo?.loanInfo?.co_maker_2 &&
                      <li>
                        {`
                          ${r?.disbursmentInfo?.loanInfo?.co_maker_2?.last_name},
                          ${r?.disbursmentInfo?.loanInfo?.co_maker_2?.first_name},
                          ${r?.disbursmentInfo?.loanInfo?.co_maker_2?.middle_name ?? ''}
                        `}
                      </li>
                  }
                </ul>
              </Table.Cell>
              <Table.Cell>
                {r?.disbursmentInfo?.check_voucher}
              </Table.Cell>
              <Table.Cell>
                {r?.disbursmentInfo?.check_number}
              </Table.Cell>
              <Table.Cell>
                {r?.disbursmentInfo?.loanInfo?.loan_amount?.toLocaleString()}
              </Table.Cell>
              <Table.Cell>
                {dayjs(r?.created_at).format('llll')}
              </Table.Cell>
            </Table.Row>
          ))
        }
      </Table.Body>
      <Table.Footer>
        <Table.Row>
          <Table.HeaderCell>
              Total
          </Table.HeaderCell>
          <Table.HeaderCell />
          <Table.HeaderCell />
          <Table.HeaderCell className='font-bold'>
            {
              list
                ?.map(r => r?.disbursmentInfo?.loanInfo.loan_amount)
                ?.reduce((p, c) => p + c, 0)
                ?.toLocaleString()
            }
          </Table.HeaderCell>
          <Table.HeaderCell />
        </Table.Row>
      </Table.Footer>
    </Table>
  )
}

export default withRouter(Encashment)
