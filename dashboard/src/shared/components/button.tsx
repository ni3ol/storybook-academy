import {Button as SUIButton, ButtonProps} from 'semantic-ui-react'

export const Button = (props: ButtonProps) => {
  return (
    <SUIButton
      style={{backgroundColor: '#4d7298', color: 'white'}}
      {...props}
    />
  )
}
