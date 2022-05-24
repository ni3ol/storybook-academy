import {Controller} from 'react-hook-form'
import Select from 'react-select'
import {useAuth} from '../../auth/hooks'
import {Field, FieldProps} from '../../shared/components/form'
import {usePromise} from '../../shared/hooks'
import {ClassFilters, getClasses} from '../actions/getClasses'

export const ClassSelectField = <O,>({
  required,
  label,
  placeholder,
  helperText,
  form,
  name,
  options,
  defaultValue,
  filters,
  classId,
}: FieldProps & {
  options?: {label: string; value: O}[]
  filters?: ClassFilters
}) => {
  const auth = useAuth()

  const action = usePromise(async () => {
    // if (!filters?.schoolId) return Promise.resolve(undefined)
    if (classId) {
      const classes = await getClasses({
        authToken: auth.auth.authSession!.token,
      })
      return classes.filter((theClass) => theClass.id !== classId)
    }
    return getClasses({authToken: auth.auth.authSession!.token, filters})
  }, [filters])

  const classes = action.result || []

  const finalOptions = (options ||
    classes.map((theClass) => ({
      label: theClass.name,
      value: theClass.id,
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
