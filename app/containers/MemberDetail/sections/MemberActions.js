import React, { useEffect, useState, useContext } from 'react'
import { toast } from 'react-toastify'
import { Grid, Button, Modal, Form, Message, Icon } from 'semantic-ui-react'
import { Form as ReactFinalForm, Field } from 'react-final-form'
import { useAsync } from 'react-async'
import { Link } from 'react-router-dom'

import Context from './../context'
import { addCollateralAsync } from './../async'
import { InputField } from 'Components/InputFields'

const AddCollateral = ({ open, setOpen }) => {
  const { member_id, runMember } = useContext(Context)
  const {
    error,
    data,
    isResolved,
    isPending,
    run
  } = useAsync({ deferFn: addCollateralAsync })

  const onSubmit = values => {
    const { amount } = values
    const forSending = {
      invoice_type: 'shares',
      member_id,
      amount: parseFloat(amount)
    }
    run(forSending)
  }

  useEffect(() => {
    if (data) {
      toast.success('Invoice generated')
      runMember({ uuid: member_id })
      setOpen(prev => !prev)
    }
  }, [isResolved])

  return (
    <ReactFinalForm onSubmit={onSubmit}>
      {
        ({ form, handleSubmit }) => (
          <Modal
            open={open}
            onClose={() => setOpen(prev => !prev)}
            size='mini'
          >
            <Modal.Header>
              Add Collateral
            </Modal.Header>
            <Modal.Content>
              <Form onSubmit={handleSubmit} loading={isPending}>
                <Form.Field>
                  {
                    !error &&
                      <Message>
                        Once submited, it will send an email to confirm your
                        request. Pay the invoice to our teller and it will
                        be reflected on your account.
                      </Message>
                  }
                  {
                    error &&
                      <Message negative>
                        {error}
                      </Message>
                  }
                </Form.Field>
                <Form.Field>
                  <label>How Much Collateral Do You like to Add</label>
                  <Field
                    component={InputField}
                    name='amount'
                    type='number'
                  />
                </Form.Field>
              </Form>
            </Modal.Content>
            <Modal.Actions>
              <Button
                loading={isPending}
                onClick={() => form.submit()}
                primary
              >
                Submit
              </Button>
            </Modal.Actions>
          </Modal>
        )
      }
    </ReactFinalForm>
  )
}

const LoanInfoModal = ({ open, setOpen }) => {
  const { loanErrors } = useContext(Context)
  return (
    <Modal size='mini' open={open} onClose={() => setOpen(v => !v)}>
      <Modal.Header>Why can't you Apply for a loan</Modal.Header>
      <Modal.Content>
        {
          loanErrors?.map((m, i) => (
            <Message negative key={i}>{m}</Message>
          ))
        }
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setOpen(v => !v)}>Close</Button>
      </Modal.Actions>
    </Modal>
  )
}

const MemberActions = () => {
  const { loanErrors, member_id } = useContext(Context)
  const [collateralModal, setCollateralModal] = useState(false)
  const [loanInfoErrorModal, setLoanInfoModal] = useState(false)

  return (
    <Grid.Column>
      <div className='flex'>
        <Button
          positive
          onClick={() => setCollateralModal(prev => !prev)}
        >
          Add Collateral
        </Button>
        <div>
          <Button
            disabled={loanErrors}
            as={Link}
            to={`/loan/create/${member_id}`}
            primary
          >
            Request Loan
          </Button>
          {
            loanErrors &&
              <Icon
                link
                onClick={() => setLoanInfoModal(true)}
                color='red'
                name='exclamation circle'
              />
          }

        </div>
      </div>
      <AddCollateral
        setOpen={setCollateralModal}
        open={collateralModal}
      />
      <LoanInfoModal
        open={loanInfoErrorModal}
        setOpen={setLoanInfoModal}
      />
    </Grid.Column>
  )
}

export default MemberActions
