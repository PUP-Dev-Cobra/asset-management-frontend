import React, { useContext, useState, useEffect } from 'react'
import { Button, Table, Modal, Form, Label, Message } from 'semantic-ui-react'
import { Form as ReactFinalForm, Field, FormSpy } from 'react-final-form'
import { toast } from 'react-toastify'
import { useAsync } from 'react-async'
import dayjs from 'dayjs'

import { required } from 'App/validations'
import { userInfo } from 'Helpers/utils'
import { InputField } from 'Components/InputFields'

import { payInvoiceAsync, voidInvoiceAsync } from './../async'
import Context from './../context'

const InvoiceModal = ({ open, setOpen, invoice }) => {
  const { member_id, runMember } = useContext(Context)
  const formSubmit = useAsync({ deferFn: payInvoiceAsync })
  const onSubmit = values => {
    const { or_number } = values
    const {
      amount,
      id,
      loan_id,
      member_id,
      invoice_type,
      uuid
    } = invoice
    const submit = {
      invoice_id: id,
      invoice_type,
      loan_id,
      amount,
      member_id,
      or_number,
      uuid
    }
    formSubmit.run(submit)
  }

  const { amount, invoice_type, created_at } = invoice

  useEffect(() => {
    if (formSubmit.isResolved) {
      toast.success('Invoice Paid')
      setOpen(prevState => !prevState)
      runMember({ uuid: member_id })
    }
  }, [formSubmit.isResolved])

  return (
    <Modal
      open={open}
      size='tiny'
      onClose={() => setOpen(prevState => !prevState)}
    >
      <ReactFinalForm
        onSubmit={onSubmit}
        initialValues={{
          amount,
          reciept_type: invoice_type,
          created_at: dayjs(created_at).format('LLLL')
        }}
      >
        {
          ({ form, handleSubmit }) => (
            <>
              <Modal.Header>
                <div className='flex justify-between items-center'>
                  <span>Pay Invoice</span>
                  <div>
                    <Label positive={invoice?.status}>
                      {invoice?.status}
                    </Label>
                  </div>
                </div>
              </Modal.Header>
              <Modal.Content>
                <Form
                  onSubmit={handleSubmit}
                  size='small'
                  loading={formSubmit.isPending}
                >
                  <Form.Field>
                    <label>OR Number</label>
                    <Field
                      name='or_number'
                      component={InputField}
                      validate={required}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>Amount</label>
                    <Field
                      name='amount'
                      readOnly
                      component={InputField}
                    />
                  </Form.Field>
                  <Form.Group widths='equal'>
                    <Form.Field>
                      <label>Type</label>
                      <Field
                        name='reciept_type'
                        component={InputField}
                        readOnly
                      />
                    </Form.Field>
                    <Form.Field>
                      <label>Created At</label>
                      <Field
                        name='created_at'
                        component={InputField}
                      />
                    </Form.Field>
                  </Form.Group>
                </Form>
              </Modal.Content>
              <FormSpy
                subscription={{
                  invalid: true,
                  pristine: true
                }}
              >
                {
                  ({ invalid, pristine }) => (
                    <Modal.Actions>
                      {
                        invoice.status === 'pending' &&
                          <Button
                            loading={formSubmit.isPending}
                            disabled={(invalid || pristine)}
                            onClick={() => form.submit()}
                            primary
                          >
                            Pay Invoice
                          </Button>
                      }
                    </Modal.Actions>
                  )
                }
              </FormSpy>

            </>
          )
        }
      </ReactFinalForm>
    </Modal>
  )
}

const VoidInvoice = ({
  open,
  setOpen,
  invoice: { uuid, invoice_type, amount }
}) => {
  const { member_id, runMember } = useContext(Context)
  const {
    isPending,
    isResolved,
    data,
    error,
    run
  } = useAsync({ deferFn: voidInvoiceAsync })

  const onSubmit = value => {
    const forSending = {
      uuid,
      invoice_type,
      amount,
      member_id
    }
    run(forSending)
  }

  useEffect(() => {
    if (data) {
      toast.info('Invoice void')
      runMember({ uuid: member_id })
      setOpen(v => !v)
    }
  }, [isResolved])

  return (
    <Modal open={open} onClose={() => setOpen(v => !v)} size='mini'>
      <ReactFinalForm
        onSubmit={onSubmit}
      >
        {
          ({ form, handleSubmit }) => (
            <>
              <Modal.Header>
                Void Invoice
              </Modal.Header>
              <Modal.Content>
                <Form onSubmit={handleSubmit}>
                  <Form.Field>
                    {
                      !error &&
                        <Message info>
                          Voiding this invalidates the invoice. This action
                          is irreversible. Create another invoice if you
                          decide to change your mind.
                        </Message>
                    }
                    {
                      error &&
                        <Message negative>
                          {error}
                        </Message>
                    }
                  </Form.Field>
                </Form>
              </Modal.Content>
              <Modal.Actions>
                <Button
                  loading={isPending}
                  onClick={() => form.submit()}
                  primary
                >
                  Void Invoice
                </Button>
              </Modal.Actions>
            </>
          )
        }
      </ReactFinalForm>
    </Modal>
  )
}

const Invoices = () => {
  const { invoices } = useContext(Context)
  const { user_type } = userInfo()

  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(null)
  const [voidOpen, voidSetOpen] = useState(false)
  const [invoice, setInvoice] = useState({})

  return (
    <>
      <Table
        celled
        compact
        selectable
      >
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Amount</Table.HeaderCell>
            <Table.HeaderCell>Created At</Table.HeaderCell>
            <Table.HeaderCell>Updated At</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {
          invoices?.map(r => (
            <Table.Row key={r.uuid} active={r.uuid === index}>
              <Table.Cell>{r.invoice_type}</Table.Cell>
              <Table.Cell>{r.amount?.toLocaleString()}</Table.Cell>
              <Table.Cell>{dayjs(r.created_at).format('LLLL')}</Table.Cell>
              <Table.Cell>
                {
                  r.updated_at &&
                    dayjs(r.updated_at).format('LLLL')
                }
                {
                  !r.updated_at &&
                    '--'
                }
              </Table.Cell>
              <Table.Cell
                negative={(r.status === 'pending')}
                positive={(r.status === 'paid')}
              >
                {r.status}
              </Table.Cell>
              <Table.Cell>
                {
                  r.status === 'pending' && user_type === 'teller' &&
                    <Button
                      onClick={() => {
                        setInvoice(r)
                        setIndex(r.uuid)
                        setOpen(prevState => !prevState)
                      }}
                    >
                      Pay
                    </Button>
                }
                {
                  user_type === 'member' && r.status === 'pending' &&
                    <Button
                      negative
                      onClick={() => {
                        setInvoice(r)
                        setIndex(r.uuid)
                        voidSetOpen(prevState => !prevState)
                      }}
                    >
                      Void
                    </Button>
                }
              </Table.Cell>
            </Table.Row>
          ))
          }
        </Table.Body>
      </Table>
      <InvoiceModal
        open={open}
        setOpen={setOpen}
        invoice={invoice}
      />
      <VoidInvoice
        open={voidOpen}
        setOpen={voidSetOpen}
        invoice={invoice}
      />
    </>
  )
}

export default Invoices
