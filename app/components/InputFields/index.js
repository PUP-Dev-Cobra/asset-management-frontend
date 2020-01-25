import React, { Fragment } from 'react'
import { Input, Label, Form, Select } from 'semantic-ui-react'

export const InputField = ({ input, meta, ...rest }) => (
  <Fragment>
    <Input {...input} {...rest} error={(meta.error && meta.touched)} />
    {
      meta.error && meta.touched &&
        <Label pointing prompt>
          {meta.error}
        </Label>
    }
  </Fragment>
)

export const SelectField = ({ input, meta, ...rest }) => (
  <Fragment>
    <Form.Select
      {...input}
      onChange={
        (e, { value }) => input.onChange(value)
      }
      control={Select}
      placeholder='Gender'
      value={input.value}
      {...rest}
    />
    {
      meta.error && meta.touched &&
        <Label pointing prompt>
          {meta.error}
        </Label>
    }
  </Fragment>
)
