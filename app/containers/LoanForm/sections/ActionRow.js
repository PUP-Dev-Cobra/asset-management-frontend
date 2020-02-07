import React, { Fragment, useState } from 'react'
import {
  Button,
  Grid,
  Segment,
  Header,
  Statistic,
  Progress,
  Icon
} from 'semantic-ui-react'

import ModalDisbursment from './ModalDisbursment'
import ModalEncashment from './ModalEncashment'
import ModalPayment from './ModalPayment'

const ActionRow = props => {
  const [disbursmentModal, setDisbursmentModal] = useState(false)
  const [encashmentModal, setEncashmentmodal] = useState(false)
  const [paymentModal, setPaymentModal] = useState(false)

  return (
    <Fragment>
      <Grid.Row>
        <Grid.Column computer={13}>
          <Segment>
            <Header as='h3'>
              Loan Actions
            </Header>
            <Grid verticalAlign='middle'>
              <Grid.Column computer={10}>
                <Button
                  primary
                  size='large'
                  icon
                  onClick={() => setDisbursmentModal(true)}
                >
                  <Icon name='money' />
                  <span style={{ marginLeft: '1rem' }}>
                    Issue Cheque
                  </span>
                </Button>
                <Button
                  onClick={() => setEncashmentmodal(true)}
                  size='large'
                  icon
                >
                  <Icon name='money' />
                  <span style={{ marginLeft: '1rem' }}>
                    Encash Cheque
                  </span>
                </Button>
                <Button
                  onClick={() => setPaymentModal(true)}
                  positive
                  size='large'
                  icon
                  color='green'
                >
                  <Icon name='money' />
                  <span style={{ marginLeft: '1rem' }}>
                    Pay Loan
                  </span>
                </Button>
              </Grid.Column>
              <Grid.Column computer={6}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Segment>
                    <Statistic>
                      <Statistic.Value>
                        999
                      </Statistic.Value>
                      <Statistic.Label>Remaining Balance</Statistic.Label>
                    </Statistic>
                    <Progress percent={50} attached='bottom' />
                  </Segment>
                </div>
              </Grid.Column>
            </Grid>
          </Segment>
        </Grid.Column>
      </Grid.Row>
      <ModalDisbursment
        isOpen={disbursmentModal}
        onClose={() => setDisbursmentModal(false)}
      />
      <ModalEncashment
        isOpen={encashmentModal}
        onClose={() => setEncashmentmodal(false)}
      />
      <ModalPayment
        isOpen={paymentModal}
        onClose={() => setPaymentModal(false)}
      />
    </Fragment>
  )
}

export default ActionRow
