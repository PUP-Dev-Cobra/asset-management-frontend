import React, { useState } from 'react'
import {
  Button,
  Form,
  Grid,
  Icon,
  Header,
  Segment,
  Select,
  Table
} from 'semantic-ui-react'
import arrayMutators from 'final-form-arrays'
import { Form as ReactFinalForm, Field } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'
import { useAsync } from 'react-async'
import get from 'lodash/get'

import { required } from 'App/validations'
import { InputField, SelectField } from 'Components/InputFields'

import { option as optionAsync } from './async'

export default props => {
  const [forDeletion, setForDeletion] = useState([])
  const onSubmit = values => {
    const forSending = {
      ...values,
      forDeletion
    }
    console.log(forSending)
  }

  const genderOptionsAsync = useAsync({
    promiseFn: optionAsync,
    option_name: 'gender'
  })
  const sourceOfIncomOptionsAsync = useAsync({
    promiseFn: optionAsync,
    option_name: 'source_of_income'
  })
  const civilStatusOptionsAsync = useAsync({
    promiseFn: optionAsync,
    option_name: 'payment_term'
  })

  const genderOptions = get(genderOptionsAsync, 'data.response') || []
  const civilStatusOptions = get(civilStatusOptionsAsync, 'data.response') || []
  const sourceOfIncomeOptions = get(sourceOfIncomOptionsAsync, 'data.response') || []

  console.log(genderOptions, 'genderOptions')

  return (
    <Grid centered verticalAlign='middle' container padded='vertically'>
      <Grid.Column computer={13}>
        <Segment>
          <Header as='h1'> Membership Form </Header>
          <ReactFinalForm
            onSubmit={onSubmit}
            mutators={{
              ...arrayMutators
            }}
          >
            {
              ({ form: { mutators: { push } }, handleSubmit }) => {
                return (
                  <Form onSubmit={handleSubmit}>
                    <Form.Group widths='equal'>
                      <Form.Field>
                        <label> First Name </label>
                        <Field
                          name='first_name'
                          placeholder='First Name'
                          component={InputField}
                          validate={required}
                        />
                      </Form.Field>
                      <Form.Field>
                        <label>Middle Name </label>
                        <Field
                          name='middle_name'
                          placeholder='Middle Name'
                          component={InputField}
                        />
                      </Form.Field>
                      <Form.Field>
                        <label>Last Name</label>
                        <Field
                          name='last_name'
                          placeholder='Last Name'
                          component={InputField}
                          validate={required}
                        />
                      </Form.Field>
                      <Form.Field>
                        <label>Nickname</label>
                        <Field
                          name='nickname'
                          placeholder='Nickname'
                          component={InputField}
                        />
                      </Form.Field>
                    </Form.Group>
                    <Form.Group widths='equal'>
                      <Form.Field>
                        <label> Date of Birth</label>
                        <Field
                          name='dob'
                          placeholder='Date of Birth'
                          component={InputField}
                          validate={required}
                          type='date'
                        />
                      </Form.Field>
                      <Form.Field>
                        <label>Age</label>
                        <Field
                          name='age'
                          readOnly
                          placeholder='Age'
                          component={InputField}
                          validate={required}
                        />
                      </Form.Field>
                      <Form.Field>
                        <label>Gender</label>
                        <Field
                          name='gender'
                          component={SelectField}
                          validate={required}
                          loading={genderOptionsAsync.isPending}
                          options={
                            genderOptions.map(
                              (value, index) => ({
                                value: value.option_value,
                                text: value.option_value,
                                key: index
                              }))
                          }
                        />
                      </Form.Field>
                      <Form.Field>
                        <label>Religion</label>
                        <Field
                          name='religion'
                          placeholder='Religion'
                          component={InputField}
                          validate={required}
                        />
                      </Form.Field>
                    </Form.Group>
                    <Form.Group widths='equal'>
                      <Form.Field>
                        <label>Civil Status</label>
                        <Field
                          name='civil_status'
                          component={SelectField}
                          validate={required}
                          loading={civilStatusOptionsAsync.isPending}
                          options={civilStatusOptions.map(
                            (value, index) => ({
                              value: value.option_value,
                              text: value.option_value,
                              key: index
                            }))}
                        />
                      </Form.Field>
                      <Form.Field>
                        <label>Spouse's Name</label>
                        <Field
                          name='spouse_name'
                          placeholder='Spouse Name'
                          component={InputField}
                          validate={required}
                        />
                      </Form.Field>
                    </Form.Group>
                    <Form.Group widths='equal'>
                      <Form.Field>
                        <label>Home Address</label>
                        <Field
                          name='address'
                          placeholder='Address'
                          component={InputField}
                          validate={required}
                        />
                      </Form.Field>
                    </Form.Group>
                    <Form.Group widths='equal'>
                      <Form.Field>
                        <label>Occupation/Source of Income</label>
                        <Field
                          name='source_of_income'
                          placeholder='Occupaton / Source of Income'
                          component={InputField}
                          validate={required}
                        />
                      </Form.Field>
                      <Form.Field>
                        <label>TIN/OSCA</label>
                        <Field
                          name='tin_oca'
                          placeholder='TIN/OSCA'
                          component={InputField}
                          validate={required}
                        />
                      </Form.Field>
                      <Form.Field>
                        <label>Monthly Income</label>
                        <Field
                          name='civil_status'
                          component={SelectField}
                          validate={required}
                          loading={sourceOfIncomOptionsAsync.isPending}
                          options={sourceOfIncomeOptions.map(
                            (value, index) => ({
                              value: value.option_value,
                              text: value.option_value,
                              key: index
                            }))}
                        />
                      </Form.Field>
                    </Form.Group>
                    <Form.Field>
                      <Table celled>
                        <Table.Header>
                          <Table.Row>
                            <Table.HeaderCell>Benificiaries</Table.HeaderCell>
                            <Table.HeaderCell>Relationship </Table.HeaderCell>
                            <Table.HeaderCell>Date of Birth</Table.HeaderCell>
                            <Table.HeaderCell />
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          <FieldArray name='beneficiaries'>
                            {
                              ({ fields }) =>
                                fields.map((name, index) => (
                                  <Table.Row key={index}>
                                    <Table.Cell>
                                      <Field
                                        name={`${name}.name`}
                                        placeholder='Beneficiary'
                                        component={InputField}
                                        validate={required}
                                      />
                                    </Table.Cell>
                                    <Table.Cell>
                                      <Field
                                        name={`${name}.relationship`}
                                        placeholder='Beneficiary'
                                        component={InputField}
                                        validate={required}
                                      />
                                    </Table.Cell>
                                    <Table.Cell>
                                      <Field
                                        name={`${name}.dob`}
                                        placeholder='Beneficiary'
                                        component={InputField}
                                        validate={required}
                                        type='date'
                                      />
                                    </Table.Cell>
                                    <Table.Cell textAlign='center'>
                                      <Button
                                        onClick={() => {
                                          if (fields.value[index].id) {
                                            setForDeletion(
                                              prev => [...prev, fields.value[index]]
                                            )
                                          }
                                          fields.remove(index)
                                        }}
                                        type='button'
                                        icon
                                        negative
                                      >
                                        <Icon name='minus' />
                                      </Button>
                                    </Table.Cell>
                                  </Table.Row>
                                ))
                            }
                          </FieldArray>
                        </Table.Body>
                        <Table.Footer fullWidth>
                          <Table.Row>
                            <Table.HeaderCell
                              colSpan='4'
                            >
                              <div
                                style={{ display: 'flex', justifyContent: 'flex-end' }}
                              >
                                <Button
                                  type='button'
                                  secondary
                                  onClick={() => push('beneficiaries', {})}
                                >
                                  <Icon name='plus' />
                                  Add Beneficiaries
                                </Button>
                              </div>
                            </Table.HeaderCell>
                          </Table.Row>
                        </Table.Footer>
                      </Table>
                    </Form.Field>

                    <Form.Group widths='equal'>
                      <Form.Field>
                        <Header as='h1'>Share</Header>
                        <Segment>
                          <Form.Group widths='equal'>
                            <Form.Field>
                              <label>Share</label>
                              <input placeholder='share' input='number' />
                            </Form.Field>
                            <Form.Field>
                              <label>Total Amount Share</label>
                              <input placeholder='share' input='number' />
                            </Form.Field>
                          </Form.Group>
                          <Form.Group widths='equal'>
                            <Form.Field>
                              <label>Term of Payment</label>
                              <Select
                                placeholder='terms of payment'
                                options={[]}
                              />
                            </Form.Field>
                            <Form.Field>
                              <label>Terms</label>
                              <Select
                                placeholder='terms of payment'
                                options={[]}
                              />
                            </Form.Field>
                          </Form.Group>
                        </Segment>
                      </Form.Field>
                    </Form.Group>

                    <Form.Field>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end'
                      }}
                      >
                        <Button type='submit' primary>
                          Submit
                        </Button>
                      </div>
                    </Form.Field>
                  </Form>
                )
              }
            }
          </ReactFinalForm>
        </Segment>
      </Grid.Column>
    </Grid>
  )
}
