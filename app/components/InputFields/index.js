import React, { Fragment } from 'react'
import { Input, Label, Form, Select } from 'semantic-ui-react'

export const InputField = ({ input, meta, ...rest }) => (
  <Fragment>
    <Input {...input} {...rest} error={(meta.error && meta.touched)} />
    {
      meta.error && meta.touched &&
        <Label pointing prompt>
          <div className='leading-snug'>
            {meta.error}
          </div>
        </Label>
    }
  </Fragment>
)

export const SelectField = ({ input, meta, disableError, loading, ...rest }) => {
  return (
    <Fragment>
      <Form.Select
        {...input}
        onChange={(e, { value }) => {
          return input.onChange(value)
        }}
        control={Select}
        value={input.value}
        loading={loading || meta.validating}
        {...rest}
      />
      {
        meta.error && !meta.pristine &&
          <Label pointing prompt>
            {meta.error}
          </Label>
      }
    </Fragment>
  )
}
