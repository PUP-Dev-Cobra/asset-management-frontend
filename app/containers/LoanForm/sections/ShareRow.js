import React, { useContext } from 'react'
import { Form, Statistic, Segment } from 'semantic-ui-react'

import Context from './../context'

const ShareRow = props => {
  const {
    memberShareValue,
    coMaker1ShareValue,
    coMaker2ShareValue
  } = useContext(Context)
  return (
    <Form.Group widths='equal'>
      <Form.Field>
        <Segment>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <Statistic
              size='tiny'
              label='Available Collateral'
              value={memberShareValue.toLocaleString()}
            />
          </div>
        </Segment>
      </Form.Field>
      <Form.Field>
        <Segment>
          <Statistic
            size='tiny'
            label='Available Collateral'
            value={coMaker1ShareValue.toLocaleString()}
          />
        </Segment>
      </Form.Field>
      <Form.Field>
        <Segment>
          <Statistic
            size='tiny'
            label='Co Maker 2 Shares In Cash'
            value={coMaker2ShareValue.toLocaleString()}
          />
        </Segment>
      </Form.Field>
    </Form.Group>
  )
}

export default ShareRow
