import bcrypt from 'bcrypt'

export const hashPassword = async (password: string) => {
  const passwordHash = await bcrypt.hash(password, 10)
  return passwordHash
}

export const checkPassword = async (password: string, hash: string) => {
  const result = await bcrypt.compare(password, hash)
  return result
}
