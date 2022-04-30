/* eslint-disable react/display-name */
import DatePicker from 'react-datepicker'
import Select from 'react-select'
import {Controller} from 'react-hook-form'
import {
  Form as BootstrapForm,
  FormGroup,
  Label,
  Input,
  FormText,
  Alert,
} from 'reactstrap'

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
      {error && <Alert color="danger">{error.message}</Alert>}
      <BootstrapForm onSubmit={onSubmit}>{children}</BootstrapForm>
    </>
  )
}

type fieldProps = {
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
    <FormGroup className="mb-3">
      <Label>
        {label}
        {required && '*'}
      </Label>
      {children}
      {helperText && <FormText className="text-muted">{helperText}</FormText>}
    </FormGroup>
  )
}

export const TextField = ({
  required,
  label,
  placeholder,
  helperText,
  type,
  form,
  name,
}: fieldProps) => {
  return (
    <Field label={label} required={required} helperText={helperText}>
      <Controller
        name={name}
        control={form.control}
        rules={{required}}
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
}: fieldProps) => {
  return (
    <Field label={label} required={required} helperText={helperText}>
      <Controller
        name={name}
        control={form.control}
        rules={{required}}
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
  name,
}: fieldProps) => {
  return (
    <Field label={label} required={required} helperText={helperText}>
      <Controller
        name={name}
        control={form.control}
        rules={{required}}
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
}: fieldProps) => {
  return (
    <Field label={label} required={required} helperText={helperText}>
      <Controller
        name={name}
        control={form.control}
        rules={{required}}
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
  name,
  min,
}: fieldProps) => {
  return (
    <Field label={label} required={required} helperText={helperText}>
      <Controller
        name={name}
        control={form.control}
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
                const value = parseInt(event.target.value)
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
}: fieldProps) => {
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
}: fieldProps & {options: {label: string; value: O}[]}) => {
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
