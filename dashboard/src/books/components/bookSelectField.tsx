import {Controller} from 'react-hook-form'
import Select from 'react-select'
import {useAuth} from '../../auth/hooks'
import {Field, FieldProps} from '../../shared/components/form'
import {usePromise} from '../../shared/hooks'
import {getBooks} from '../actions/getBooks'

export const BookSelectField = <O,>({
  required,
  label,
  placeholder,
  helperText,
  form,
  name,
  options,
}: FieldProps & {options?: {label: string; value: O}[]}) => {
  const auth = useAuth()

  const action = usePromise(() => {
    return getBooks({authToken: auth.auth.authSession!.token})
  }, [])

  const books = action.result || []

  const finalOptions = (options ||
    books.map((school) => ({
      label: school.title,
      value: school.id,
    }))) as any[]

  return (
    <Field label={label} required={required} helperText={helperText}>
      <Controller
        name={name}
        control={form.control}
        rules={{required}}
        render={({field}) => {
          return (
            <Select
              options={finalOptions}
              placeholder={placeholder}
              getOptionLabel={(o) => o.label}
              {...field}
              value={finalOptions.find((o) => o.value === field.value)}
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
