import type { User } from '@/payload-types'
import type { Access } from 'payload'

export const checkHasAllRoles = (allOfThese: User['roles'] = [], user: User | null = null): boolean => {
  if (!user) {
    return false
  }

  if (!allOfThese || allOfThese?.length === 0) {
    return false
  }

  return allOfThese.every(it => user.roles?.includes(it))
}
export const admins: Access = ({req: {user}}) => checkHasAllRoles(['admin'], user)
export const adminsAndCreators: Access = ({req: {user}}) => checkHasAllRoles(['creator'], user) || checkHasAllRoles(['admin'], user)