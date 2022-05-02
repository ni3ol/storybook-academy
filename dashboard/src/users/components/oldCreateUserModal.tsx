import {Button, Dropdown, Form, Header, Modal} from 'semantic-ui-react'
import {useForm} from 'react-hook-form'

type Data = {
  firstName: string
  lastName: string
}

export const CreateUserModal = ({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: any
}) => {
  // const action = usePromiseLazy((data: Data) => {
  //   // return signIn({ emailAddress: data.emailAddress, password: data.password });
  //   console.log("dada", data);
  //   return;
  // }, []);

  // const handleSubmit = async (data: Data) => {
  //   const { result } = await action.execute(data);
  //   if (result) {
  //     console.log("ssss", result);
  //   }
  // };
  const form = useForm<Partial<Data>, Data>()
  return (
    <Modal
      style={{height: 'auto', margin: 'auto', position: 'relative'}}
      closeIcon
      dimmer="blurring"
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
    >
      <Header icon="user" content="Create student" />
      <Modal.Content>
        <Form
          // onSubmit={form.handleSubmit((data) => handleSubmit(data as Data))}
          onSubmit={form.handleSubmit((data) => console.log('data', data))}
        >
          <Form.Field>
            <label>Child ID</label>
            <input disabled placeholder="Auto-generated ID" />
          </Form.Field>
          <Form.Field>
            <label>First Name</label>
            <input placeholder="First Name" />
          </Form.Field>
          <Form.Field>
            <label>Last Name</label>
            <input placeholder="Last Name" />
          </Form.Field>
          <Form.Field>
            <label>Year of birth</label>
            <input placeholder="Year of birth" />
          </Form.Field>
          <Form.Field>
            <label>Reading level</label>
            <Dropdown
              placeholder="Reading level"
              fluid
              selection
              options={[
                {
                  key: 1,
                  text: 'Level 1',
                  value: 1,
                },
                {
                  key: 2,
                  text: 'Level 2',
                  value: 2,
                },
                {
                  key: 3,
                  text: 'Level 3',
                  value: 3,
                },
                {
                  key: 4,
                  text: 'Level 4',
                  value: 4,
                },
                {
                  key: 5,
                  text: 'Level 5',
                  value: 5,
                },
              ]}
            />
          </Form.Field>
          <Form.Field>
            <label>School</label>
            <Dropdown
              placeholder="School"
              fluid
              selection
              options={[
                {
                  key: 'school-1',
                  text: 'Jamaica Primary School',
                  value: 'school-1',
                },
                {
                  key: 'school-2',
                  text: 'Canada Primary School',
                  value: 'school-2',
                },
              ]}
            />
          </Form.Field>
          <Form.Field>
            <label>Educator</label>
            <Dropdown
              placeholder="Educator"
              fluid
              selection
              options={[
                {
                  key: 'nicol-vojacek',
                  text: 'Nicol Vojacek',
                  value: 'nicol-vojacek',
                },
                {
                  key: 'michele-lemonius',
                  text: 'Michele Lemonius',
                  value: 'michele-lemonius',
                },
              ]}
            />
          </Form.Field>
          <Button type="submit">Submit</Button>
        </Form>
      </Modal.Content>
    </Modal>
  )
}
