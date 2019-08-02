import { Field } from 'react-jeff'
import { Input } from './atoms';
import React, { InputHTMLAttributes } from 'react';

interface FormFieldProps<T> extends InputHTMLAttributes<{}> {
  field: Field<T>
}

export const Form = ({ onSubmit, ...props }) => (
  <form
    onSubmit={e => {
      e.preventDefault()
      onSubmit()
    }}
    {...props}
  />
)

export const TextField = ({ field }: FormFieldProps<string>) => {
  const { onChange, ...fieldProps } = field.props

  return (
    <Input
      {...fieldProps}
      onChange={e => onChange(e.currentTarget.value)}
    />
  )
}
