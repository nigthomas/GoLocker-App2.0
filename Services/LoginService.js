import { Authentication } from '../Common/NetworkManager'
import { Storage } from '../Common/Storage'

const ACCOUNT_KEY = "$account"

export default class LoginService = {
  login: (username, password) => {
    if(!username || !password) {
      return new Promise((resolve, reject) => { reject(new Error('Missing username or password'))})
    }

    Authentication.login(username, password)
    .then(data => {
      Storage.set(ACCOUNT_KEY, data)
      return new Promise((resolve, reject) => { resolve(data)})
    })
  },
  isLoggedIn: () => {
    return false
  }
}
