import React from 'react'
import { Form as ReactFinalForm, Field } from 'react-final-form'
import { Modal, Form, Button } from 'semantic-ui-react'

import { InputField } from 'Components/InputFields'

const PaymentModal = ({ isOpen, onClose }) => {
  const onSubmit = values => {

  }

  return (
    <ReactFinalForm onSubmit={onSubmit}>
      {
        ({ form, handleSubmit }) => {
          return (
            <Modal
              open={isOpen}
              onClose={onClose}
              size='small'
              as='form'
              onSubmit={handleSubmit}
            >
              <Modal.Header>
                Loan Payment
              </Modal.Header>
              <Modal.Content>
                <div className='ui form'>
                  <Form.Field>
                    <label>Reciept Number</label>
                    <Field
                      name='reciept_number'
                      component={InputField}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>Amount Payment</label>
                    <Field
                      name='check_voucher'
                      component={InputField}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>Payment Term</label>
                    <Field
                      name='payment_term'
                      component={InputField}
                    />
                  </Form.Field>
                </div>
              </Modal.Content>
              <Modal.Actions>
                <Button negative type='submit'>
                  Void Payment
                </Button>
                <Button primary type='submit'>
                  Issue Cheque
                </Button>
              </Modal.Actions>
            </Modal>
          )
        }
      }
    </ReactFinalForm>
  )
}

export default PaymentModal
