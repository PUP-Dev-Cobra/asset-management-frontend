import React, { useContext, useEffect, useState, Fragment } from 'react'
import { Form as ReactFinalForm, Field, FormSpy } from 'react-final-form'
import { Modal, Form, Button, Dimmer, Loader, Message } from 'semantic-ui-react'
import { useAsync } from 'react-async'

import { InputField } from 'Components/InputFields'

import {
  createDisbursment as createDisbursmentAsync,
  updateDisbursment as updateDisbursmentAsync,
  fetchDisbursment as fetchDisbursmentAsync,
  fetchEncashment as fetchEncashmentAsync
} from './../async'
import Context from './../context'

const DisbursmentModal = ({ isOpen, onClose }) => {
  const [initialValues, setInitialValues] = useState({})
  const [encashmentValues, setEncashmentValues] = useState({})
  const [status, setStatus] = useState({})

  const onSubmit = values => {
    const newValues = {
      ...values,
      status,
      uuid: initialValues.uuid ? initialValues.uuid : uuid
    }
    formAsync.run(newValues)
  }

  const disbursmentQuery = useAsync({ deferFn: fetchDisbursmentAsync })
  const encashmentQuery = useAsync({ deferFn: fetchEncashmentAsync })
  let formAsync = {}
  if (initialValues.uuid) {
    formAsync = useAsync({ deferFn: updateDisbursmentAsync })
  } else {
    formAsync = useAsync({ deferFn: createDisbursmentAsync })
  }

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
        ({ handleSubmit }) => {
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
              size='small'
              as='form'
              onSubmit={handleSubmit}
            >
              <Modal.Header>
                Issue Check Voucher
              </Modal.Header>
              <Modal.Content>
                <Dimmer
                  active={formAsync.isPending || disbursmentQuery.isPending}
                  inverted
                >
                  <Loader />
                </Dimmer>
                <div className='ui form'>
                  <FormSpy subscription={{ values: true }}>
                    {
                      form => (
                        <Fragment>
                          {
                            encashmentValues?.uuid &&
                              <Form.Field>
                                <Message
                                  info={form?.values?.status === 'issued'}
                                >
                                  Cheque is already encashed
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
                      readOnly={initialValues?.uuid}
                      component={InputField}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>Check Number</label>
                    <Field
                      name='check_number'
                      readOnly={initialValues?.uuid}
                      component={InputField}
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
                          {
                            form?.values?.status &&
                            !encashmentValues.uuid &&
                              <Form.Field>
                                <Message
                                  negative={form?.values?.status === 'void'}
                                  info={form?.values?.status === 'issued'}
                                >
                              Cheque is {form?.values?.status}
                                </Message>
                              </Form.Field>
                          }
                        </Fragment>
                      )
                    }
                  </FormSpy>
                </div>
              </Modal.Content>
              {
                !encashmentValues.uuid &&
                  <Modal.Actions>
                    {
                      initialValues?.uuid &&
                        <Button
                          disabled={formAsync.isPending || disbursmentQuery.isPending}
                          negative
                          type='submit'
                          onClick={() => setStatus('void')}
                        >
                          Void Cheque
                        </Button>
                    }
                    {
                      !initialValues?.uuid &&
                        <Button
                          disabled={formAsync.isPending || disbursmentQuery.isPending}
                          primary
                          type='submit'
                          onClick={() => setStatus('issued')}
                        >
                          Issue Cheque
                        </Button>
                    }
                  </Modal.Actions>
              }
            </Modal>
          )
        }
      }
    </ReactFinalForm>
  )
}

export default DisbursmentModal
