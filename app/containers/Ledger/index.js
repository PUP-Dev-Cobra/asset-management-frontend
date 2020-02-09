import React, { useState } from 'react'
import {
  Grid,
  Loader,
  Dimmer,
  Segment,
  Tab
} from 'semantic-ui-react'

import DisbursmentTab from './sections/disbursment'
import EnncashmentTab from './sections/encashment'
import RecieptTab from './sections/reciepts'
import Context from './context'

const panes = [
  { menuItem: 'Disbursments', render: () => <Tab.Pane><DisbursmentTab /></Tab.Pane> },
  { menuItem: 'Encashments', render: () => <Tab.Pane><EnncashmentTab /></Tab.Pane> },
  { menuItem: 'Reciepts', render: () => <Tab.Pane><RecieptTab /></Tab.Pane> }
]

export default () => {
  const [isLoading, setIsLoading] = useState(false)
  return (
    <Context.Provider value={{ isLoading, setIsLoading }}>
      <Grid
        centered
        container
        verticalAlign='middle'
        padded='vertically'
      >
        <Grid.Column computer='13'>
          <Dimmer active={isLoading} inverted>
            <Loader />
          </Dimmer>
          <Segment>
            <Grid textAlign='left'>
              <Grid.Row>
                <Grid.Column computer='16'>
                  <Tab panes={panes} />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
        </Grid.Column>
      </Grid>
    </Context.Provider>
  )
}
