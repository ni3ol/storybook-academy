import {Controller} from 'react-hook-form'
import Select from 'react-select'
import {useAuth} from '../../auth/hooks'
import {Field, FieldProps} from '../../shared/components/form'
import {usePromise} from '../../shared/hooks'
import {getUsers, UserFilters} from '../actions/getUsers'

export const UserSelectField = <O,>({
  required,
  label,
  placeholder,
  helperText,
  form,
  name,
  options,
  defaultValue,
  filters,
}: FieldProps & {
  options?: {label: string; value: O}[]
  filters?: UserFilters
}) => {
  const auth = useAuth()

  const usersAction = usePromise(() => {
    return getUsers({
      authToken: auth.auth.authSession!.token,
      filters,
    })
  }, [])

  const users = usersAction.result || []

  const finalOptions = (options ||
    users.map((user) => ({
      label: `${user.firstName} ${user.lastName}`,
      value: user.id,
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
              value={
                field.value
                  ? finalOptions.find((o) => o.value === field.value)
                  : finalOptions.find((option) => option.value === defaultValue)
              }
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
