/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/display-name */
import DatePicker from 'react-datepicker'
import Select from 'react-select'
import {Form as SemanticForm, Input, Message} from 'semantic-ui-react'
import {Controller} from 'react-hook-form'
import 'react-datepicker/dist/react-datepicker.css'

export const Form = ({
  children,
  onSubmit,
  error,
}: {
  children: any
  onSubmit: (e: any) => any
  error?: Error | any
}) => {
  return (
    <>
      {error && (
        <Message error>
          {error.message} {JSON.stringify(error)}{' '}
        </Message>
      )}
      <SemanticForm onSubmit={onSubmit}>{children}</SemanticForm>
    </>
  )
}

type FieldProps = {
  required?: boolean
  label: string
  placeholder?: string
  helperText?: string
  type?: 'text' | 'password' | 'email' | 'number'
  form: any
  name: string
  [key: string]: any
}

const Field = ({
  children,
  label,
  required,
  helperText,
}: {
  children: any
  required?: boolean
  label: string
  helperText?: string
}) => {
  return (
    <SemanticForm.Field>
      <label>
        {label}
        {required ? ' *' : ''}
      </label>
      {children}
      {helperText && <span>{helperText}</span>}
    </SemanticForm.Field>
  )
}

export const TextField = ({
  required,
  label,
  placeholder,
  helperText,
  form,
  name,
  defaultValue,
}: FieldProps) => {
  return (
    <Field label={label} required={required} helperText={helperText}>
      <Controller
        name={name}
        control={form.control}
        rules={{required}}
        defaultValue={defaultValue}
        render={({field}) => {
          return (
            <Input
              required={required}
              type="text"
              placeholder={placeholder}
              {...field}
            />
          )
        }}
      />
    </Field>
  )
}

export const EmailField = ({
  required,
  label,
  placeholder,
  helperText,
  form,
  name,
  defaultValue,
}: FieldProps) => {
  return (
    <Field label={label} required={required} helperText={helperText}>
      <Controller
        name={name}
        control={form.control}
        rules={{required}}
        defaultValue={defaultValue}
        render={({field}) => {
          return (
            <Input
              required={required}
              type="email"
              placeholder={placeholder}
              {...field}
            />
          )
        }}
      />
    </Field>
  )
}

export const PasswordField = ({
  required,
  label,
  placeholder,
  helperText,
  form,
  defaultValue,
  name,
}: FieldProps) => {
  return (
    <Field label={label} required={required} helperText={helperText}>
      <Controller
        name={name}
        control={form.control}
        rules={{required}}
        defaultValue={defaultValue}
        render={({field}) => {
          return (
            <Input
              required={required}
              type="password"
              placeholder={placeholder}
              {...field}
            />
          )
        }}
      />
    </Field>
  )
}

export const CurrencyField = ({
  required,
  label,
  placeholder,
  helperText,
  form,
  name,
  min,
  defaultValue,
}: FieldProps) => {
  return (
    <Field label={label} required={required} helperText={helperText}>
      <Controller
        name={name}
        control={form.control}
        rules={{required}}
        defaultValue={defaultValue}
        render={({field}) => {
          return (
            <Input
              required={required}
              type="number"
              placeholder={placeholder}
              {...field}
              value={field.value ? field.value / 100 : undefined}
              min={min}
              onChange={(event) => {
                const val = event.target.value
                const value = val ? parseFloat(event.target.value) : null
                field.onChange(value ? value * 100 : null)
              }}
            />
          )
        }}
      />
    </Field>
  )
}

export const NumberField = ({
  required,
  label,
  placeholder,
  helperText,
  form,
  defaultValue,
  name,
  min,
}: FieldProps) => {
  return (
    <Field label={label} required={required} helperText={helperText}>
      <Controller
        name={name}
        control={form.control}
        defaultValue={defaultValue}
        rules={{required}}
        render={({field}) => {
          return (
            <Input
              required={required}
              type="number"
              min={min}
              placeholder={placeholder}
              {...field}
              onChange={(event) => {
                const value = parseInt(event.target.value, 10)
                field.onChange(value)
              }}
            />
          )
        }}
      />
    </Field>
  )
}
export const DatetimeField = ({
  required,
  label,
  helperText,
  form,
  name,
  maxDate,
}: FieldProps) => {
  return (
    <Field label={label} required={required} helperText={helperText}>
      <Controller
        name={name}
        control={form.control}
        rules={{required}}
        render={({field}) => {
          return (
            <DatePicker
              required={required}
              showTimeSelect
              selected={field.value}
              onChange={field.onChange}
              dateFormat="yyyy-MM-dd HH:mm:ss"
              maxDate={maxDate}
            />
          )
        }}
      />
    </Field>
  )
}

export const SelectField = <O,>({
  required,
  label,
  placeholder,
  helperText,
  form,
  name,
  options,
}: FieldProps & {options: {label: string; value: O}[]}) => {
  return (
    <Field label={label} required={required} helperText={helperText}>
      <Controller
        name={name}
        control={form.control}
        rules={{required}}
        render={({field}) => {
          return (
            <Select
              options={options}
              placeholder={placeholder}
              getOptionLabel={(o) => o.label}
              {...field}
              value={options.find((o) => o.value === field.value)}
              onChange={(v) => {
                field.onChange(v?.value)
              }}
            />
          )
        }}
      />
    </Field>
  )
}
