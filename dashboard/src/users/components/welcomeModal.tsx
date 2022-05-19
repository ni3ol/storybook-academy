import Image from 'next/image'
import {useEffect, useState} from 'react'
import {Modal} from '../../shared/components/modal'
import {usePromiseLazy} from '../../shared/hooks'
import {User} from '../model'
import Folly from '../../../public/blue-cat.svg'

export const WelcomeModal = ({
  onClose,
  user,
}: {
  onClose: () => any
  user: User
}) => {
  const [image, setImage] = useState()

  const action = usePromiseLazy(async () => {
    const image = await import(`../../../public/${user.profilePicture}.svg`)
    setImage(image)
  }, [])

  useEffect(() => {
    action.execute()
  }, [])
  return (
    <Modal
      onClose={onClose}
      header={`Welcome to Storybook Academy!`}
      body={
        <>
          <div>
            {image && <Image src={image} />}
            <p>Hello, {user.nickname}. Thank you for making a profile.</p>
            <p>
              I also like the color {user.favouriteColor} and have always wanted
              a {user.favouriteAnimal}!
            </p>
          </div>
          <br />
          <p>Your assigned reading buddy is:</p>
          <Image src={Folly} width={300} height={300} />
        </>
      }
    />
  )
}
