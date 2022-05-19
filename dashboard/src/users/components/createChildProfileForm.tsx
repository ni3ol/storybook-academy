import router from 'next/router'
import {useForm} from 'react-hook-form'
import {Button} from 'semantic-ui-react'
import {useAuth} from '../../auth/hooks'
import {
  Form,
  NumberField,
  SelectField,
  TextField,
} from '../../shared/components/form'
import {usePromiseLazy} from '../../shared/hooks'
import {updateUser} from '../actions/updateUser'

import {User} from '../model'

type FormData = {
  age: number
  nickname: string
  favouriteAnimal: string
  favouriteColor: string
}

export const colors = [
  {label: 'Red', value: 'red'},
  {label: 'Blue', value: 'blue'},
  {label: 'Green', value: 'green'},
  {label: 'Orange', value: 'orange'},
  {label: 'Purple', value: 'purple'},
  {label: 'Yellow', value: 'yellow'},
]

export const animals = [
  {label: 'Dog', value: 'dog'},
  {label: 'Cat', value: 'cat'},
  {label: 'Chicken', value: 'chicken'},
  {label: 'Butterfly', value: 'butterfly'},
  {label: 'Bumblebee', value: 'bee'},
  {label: 'Elephant', value: 'elephant'},
  {label: 'Whale', value: 'whale'},
  {label: 'Octopus', value: 'octopus'},
  {label: 'Owl', value: 'owl'},
  {label: 'Lion', value: 'lion'},
  {label: 'Deer', value: 'deer'},
  {label: 'Dolphin', value: 'dolphin'},
  {label: 'Penguin', value: 'penguin'},
  {label: 'Pig', value: 'pig'},
  {label: 'Turtle', value: 'turtle'},
]

export const CreateChildProfileForm = ({user}: {user: User}) => {
  const form = useForm<FormData>()
  const {auth} = useAuth()

  const action = usePromiseLazy(async (data: FormData) => {
    return updateUser({
      id: user.id,
      data: {
        ...data,
        profileCreated: true,
        profilePicture: `${data.favouriteColor}-${data.favouriteAnimal}`,
      },
      authToken: auth.token!,
    })
  }, [])

  const handleSubmit = async (data: FormData) => {
    const {result: updatedUser} = await action.execute(data)
    if (updatedUser) {
      router.push('/child-dashboard?showWelcomeModal=true')
    }
  }

  return (
    <Form onSubmit={form.handleSubmit(handleSubmit)}>
      <NumberField required name="age" label="What is your age?" form={form} />
      <SelectField
        required
        name="favouriteColor"
        label="What is your favourite color?"
        form={form}
        options={colors}
      />
      <SelectField
        required
        name="favouriteAnimal"
        label="What is your favourite animal?"
        form={form}
        options={animals}
      />
      <TextField
        required
        name="nickname"
        label="What is your nickname?"
        form={form}
      />

      <Button primary type="submit" fluid>
        Create my profile
      </Button>
    </Form>
  )
}
