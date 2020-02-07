import React, { useContext, useEffect } from 'react'
import { Form as ReactFinalForm, Field } from 'react-final-form'
import { Modal, Form, Button, Dimmer, Loader } from 'semantic-ui-react'
import { useAsync } from 'react-async'

import { InputField } from 'Components/InputFields'

import Context from './../context'
import { submitReciept as submitRecieptAsync } from './../async'

const PaymentModal = ({ isOpen, onClose }) => {
  const formSubmit = useAsync({ deferFn: submitRecieptAsync })
  const { uuid, fetchMemberAsync } = useContext(Context)

  const onSubmit = values => {
    formSubmit.run({
      ...values,
      loan_id: uuid
    })
  }

  useEffect(() => {
    if (formSubmit?.isResolved) {
      fetchMemberAsync.run({ uuid })
      onClose()
    }
  }, [formSubmit?.isResolved])

  return (
    <ReactFinalForm onSubmit={onSubmit}>
      {
        ({ form, handleSubmit }) => {
          const isPending = formSubmit?.isPending
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
                <Dimmer active={isPending} inverted>
                  <Loader />
                </Dimmer>
                <div className='ui form'>
                  <Form.Field>
                    <label>Reciept Number</label>
                    <Field
                      name='or_number'
                      component={InputField}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>Amount Payment</label>
                    <Field
                      name='amount'
                      component={InputField}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>Payment Term</label>
                    <Field
                      name='loan_payment_term'
                      component={InputField}
                    />
                  </Form.Field>
                </div>
              </Modal.Content>
              <Modal.Actions>
                <Button primary type='submit'>
                  Make Payment
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
