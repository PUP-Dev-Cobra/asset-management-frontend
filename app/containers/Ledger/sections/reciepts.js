import React, { useState, useEffect, useContext } from 'react'
import { Table } from 'semantic-ui-react'
import { useAsync } from 'react-async'
import { withRouter } from 'react-router-dom'
import dayjs from 'dayjs'

import Context from './../context'
import { ListReciept } from './../async'

const Reciept = ({ history }) => {
  const { setIsLoading } = useContext(Context)
  const [list, setList] = useState([])
  const listRecieptQuery = useAsync({ promiseFn: ListReciept })

  useEffect(() => {
    if (listRecieptQuery?.isResolved) {
      setList(listRecieptQuery?.data?.response)
    }
  },
  [listRecieptQuery?.isResolved])

  useEffect(() => {
    setIsLoading(listRecieptQuery?.isPending)
  }, [listRecieptQuery?.isPending])

  return (
    <Table celled selectable>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Loan Participants</Table.HeaderCell>
          <Table.HeaderCell>Official Reciept Number</Table.HeaderCell>
          <Table.HeaderCell>Amount</Table.HeaderCell>
          <Table.HeaderCell>Payment Term</Table.HeaderCell>
          <Table.HeaderCell>Issued At</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {
          list.map(r => (
            <Table.Row
              key={r.uuid}
              onClick={() =>
                history.push(`/loan/${r?.loanInfo?.uuid}`)}
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
                {r?.or_number}
              </Table.Cell>
              <Table.Cell>
                {parseFloat(r?.amount).toLocaleString()}
              </Table.Cell>
              <Table.Cell>
                {r?.loan_payment_term}
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
          <Table.HeaderCell className='font-bold'>
            {
              list
                ?.map(r => parseFloat(r?.amount))
                ?.reduce((p, c) => p + c, 0)
                ?.toLocaleString()
            }
          </Table.HeaderCell>
          <Table.HeaderCell />
          <Table.HeaderCell />
        </Table.Row>
      </Table.Footer>
    </Table>
  )
}

export default withRouter(Reciept)
