import React, { useContext } from 'react'
import {
  Grid,
  Segment,
  List,
  Statistic
} from 'semantic-ui-react'
import { FormSpy } from 'react-final-form'
import get from 'lodash/get'

import Context from './../context'

const Computations = props => {
  const {
    capitalBuildCharge,
    interestCharge,
    roundNumbers,
    serviceCharge,
    totalLoanableShares
  } = useContext(Context)

  return (
    <Grid.Column computer={6} verticalAlign='middle'>
      <FormSpy subscription={{ values: true }}>
        {
          props => {
            const payTerm = parseInt(get(props, 'values.payment_term')) || 0
            const loanAmount = parseInt(get(props, 'values.loan_amount')) || 0
            const serviceChargePayment = loanAmount * parseFloat(serviceCharge) / 100
            const capitalBuildUpPayment = loanAmount * parseFloat(capitalBuildCharge) / 100
            const interestChargePayment = loanAmount *
              parseFloat(interestCharge) * payTerm / 100

            const netLoanPayment = loanAmount - capitalBuildUpPayment - interestChargePayment - serviceChargePayment

            const netPaypermonth = netLoanPayment / payTerm || 0

            return (
              <Segment size='large'>
                <List divided>
                  <List.Item>
                    <List.Content
                      floated='right'
                    >
                      {loanAmount.toLocaleString()}
                    </List.Content>
                    <List.Content>
                        Loan
                    </List.Content>
                  </List.Item>

                  <List.Item>
                    <List.Content
                      floated='right'
                    >
                      {roundNumbers(serviceChargePayment)}
                    </List.Content>
                    <List.Content>
                        Service Charge
                    </List.Content>
                  </List.Item>

                  <List.Item>
                    <List.Content floated='right'>
                      {roundNumbers(capitalBuildUpPayment)}
                    </List.Content>
                    <List.Content>
                        Capital Build Up
                    </List.Content>
                  </List.Item>

                  <List.Item>
                    <List.Content
                      floated='right'
                    >
                      {roundNumbers(interestChargePayment)}
                    </List.Content>
                    <List.Content>
                        Interest
                    </List.Content>
                  </List.Item>

                  <List.Item>
                    <List.Content
                      floated='right'
                    >
                      {roundNumbers(netLoanPayment)}
                    </List.Content>
                    <List.Content>
                        Net Pay Amount
                    </List.Content>
                  </List.Item>

                  <List.Item>
                    <List.Content
                      floated='right'
                    >
                      {
                        roundNumbers(
                          parseFloat(netPaypermonth)
                        )
                      }
                    </List.Content>
                    <List.Content>
                        Month Payment Amount
                    </List.Content>
                  </List.Item>
                </List>
              </Segment>
            )
          }
        }
      </FormSpy>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Segment>
          <Statistic
            size='tiny'
            label='Total Loanable Shares In Cash'
            value={totalLoanableShares.toLocaleString()}
          />
        </Segment>
      </div>
    </Grid.Column>
  )
}

export default Computations
