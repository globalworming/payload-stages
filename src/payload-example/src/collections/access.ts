import type {User} from "@/payload-types";
import type {Access} from "payload";

export const checkHasAllRoles = (allOfThese: User['roles'] = [], user: User | null = null): boolean => {

  if (!user) {
    return false
  }

  if (user.id === 1) {
    return true
  }

  return !!allOfThese?.every((role) => {
    return user?.roles?.some((individualRole) => {
      return individualRole === role
    })
  });
}
export const admins: Access = ({req: {user}}) => checkHasAllRoles(['admin'], user)
export const adminsAndCreators: Access = ({req: {user}}) => checkHasAllRoles(['creator'], user) || checkHasAllRoles(['admin'], user)