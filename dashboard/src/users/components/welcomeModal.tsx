import Image from 'next/image'
import {Modal} from '../../shared/components/modal'
import {User} from '../model'
import Folly from '../../../shared/images/folly.svg'

export const WelcomeModal = ({
  onClose,
  user,
}: {
  onClose: () => any
  user: User
}) => {
  return (
    <Modal
      onClose={onClose}
      header={`Welcome to Storybook Academy, ${user.nickname}`}
      body={
        <>
          <p>Your assigned reading buddy is:</p>
          <Image src={Folly} width={300} height={300} />
        </>
      }
    />
  )
}
