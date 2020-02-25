import React, { Fragment, useState } from 'react'
import {
  Button,
  Grid,
  Segment,
  Header,
  Icon
} from 'semantic-ui-react'

import ModalDisbursment from './ModalDisbursment'
import ModalEncashment from './ModalEncashment'

const ActionRow = props => {
  const [disbursmentModal, setDisbursmentModal] = useState(false)
  const [encashmentModal, setEncashmentmodal] = useState(false)

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
    </Fragment>
  )
}

export default ActionRow
