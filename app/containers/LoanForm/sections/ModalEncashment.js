import React, { useState, useContext, useEffect, Fragment } from 'react'
import { Form as ReactFinalForm, Field, FormSpy } from 'react-final-form'
import {
  Button,
  Form,
  Header,
  Message,
  Modal,
  Dimmer,
  Loader,
  Segment
} from 'semantic-ui-react'
import { useAsync } from 'react-async'

import { InputField } from 'Components/InputFields'

import {
  crateEncashment as createEncashmenttAsync,
  fetchDisbursment as fetchDisbursmentAsync,
  fetchEncashment as fetchEncashmentAsync
} from './../async'
import Context from './../context'

const EncashmenttModal = ({ isOpen, onClose }) => {
  const [initialValues, setInitialValues] = useState({})
  const [encashmentValues, setEncashmentValues] = useState({})
  const [status, setStatus] = useState('')

  const onSubmit = values => {
    const newValues = {
      disbursment_id: values.uuid,
      status
    }
    formAsync.run(newValues)
  }

  const disbursmentQuery = useAsync({ deferFn: fetchDisbursmentAsync })
  const encashmentQuery = useAsync({ deferFn: fetchEncashmentAsync })
  const formAsync = useAsync({ deferFn: createEncashmenttAsync })

  const { uuid } = useContext(Context)

  useEffect(() => {
    if (formAsync.isResolved) {
      onClose()
    }
  }, [formAsync.isResolved])

  useEffect(() => {
    if (disbursmentQuery?.isResolved) {
      setInitialValues(disbursmentQuery?.data?.response)
      encashmentQuery
        .run({ uuid: disbursmentQuery?.data?.response?.uuid })
    }
  }, [disbursmentQuery?.isResolved])

  useEffect(() => {
    if (encashmentQuery?.isResolved) {
      setEncashmentValues(encashmentQuery?.data?.response)
    }
  }, [encashmentQuery?.isResolved])
  return (
    <ReactFinalForm onSubmit={onSubmit} initialValues={initialValues}>
      {
        ({ form, handleSubmit }) => {
          return (
            <Modal
              onMount={() => {
                disbursmentQuery.run({ uuid })
              }}
              onUnmount={() => {
                setInitialValues({})
              }}
              open={isOpen}
              onClose={onClose}
              size='mini'
              as='form'
              onSubmit={handleSubmit}
            >
              <Modal.Header>
                Encash Check Voucher
              </Modal.Header>
              <Dimmer
                active={formAsync.isPending || disbursmentQuery.isPending}
                inverted
              >
                <Loader />
              </Dimmer>
              {
                Object.entries(initialValues).length === 0 &&
                  <Segment placeholder>
                    <Header icon>
                      No Check Disbursment Found For the Loan
                    </Header>
                  </Segment>
              }
              {
                Object.entries(initialValues).length > 0 &&
                  <Fragment>
                    <Modal.Content>
                      <div className='ui form'>
                        <FormSpy subscription={{ values: true }}>
                          {
                            form => (
                              <Fragment>
                                {
                                  encashmentValues?.uuid &&
                                    <Form.Field>
                                      <Message
                                        info
                                      >
                                        Cheque is Encashed
                                      </Message>
                                    </Form.Field>
                                }
                              </Fragment>
                            )
                          }
                        </FormSpy>
                        <Form.Field>
                          <label>Check Voucher</label>
                          <Field
                            name='check_voucher'
                            component={InputField}
                            readOnly
                          />
                        </Form.Field>
                        <Form.Field>
                          <label>Check Number</label>
                          <Field
                            name='check_number'
                            component={InputField}
                            readOnly
                          />
                        </Form.Field>
                        <FormSpy subscription={{ values: true }}>
                          {
                            form => (
                              <Fragment>
                                <Form.Field>
                                  <label>Issued At</label>
                                  <input
                                    type='date'
                                    readOnly
                                    value={form?.values?.created_at}
                                  />
                                </Form.Field>
                              </Fragment>
                            )
                          }
                        </FormSpy>
                      </div>
                    </Modal.Content>
                    <Modal.Actions>
                      <Button
                        positive
                        disabled={
                          encashmentValues.uuid ||
                          formAsync.isPending ||
                          disbursmentQuery.isPending
                        }
                        type='submit'
                        onClick={() => setStatus('encashed')}
                      >
                        Cheque Encash
                      </Button>
                    </Modal.Actions>
                  </Fragment>
              }
            </Modal>
          )
        }
      }
    </ReactFinalForm>
  )
}

export default EncashmenttModal
