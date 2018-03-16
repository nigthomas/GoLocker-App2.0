import { Authentication } from '../Common/NetworkManager'
import Storage from '../Common/Storage'
import { Utils } from '../Common/Utils'
import Account from '../Models/Account'

const ACCOUNT_KEY = "$account"

export default LoginService = {
  login: (username, password) => {
    if(!username || !password) {
      return new Promise((resolve, reject) => { reject(new Error('Missing username or password'))})
    }

    return Authentication.login(username, password)
    .then(data => {
      const account = new Account(data)
      Storage.set(ACCOUNT_KEY, JSON.stringify(account))
      return new Promise((resolve, reject) => { resolve(account)})
    })
  },
  account: () => {
    return new Promise((resolve, reject) => {
      Storage.get(ACCOUNT_KEY)
      .then(data => {
        if(Utils.ifDefNN(data)) {
          return resolve(new Account(JSON.parse(data)))
        }

        return resolve(null);
      })
      .catch(err => {
        resolve(null)
      })
    })
  },
  logOut: () => {
    Storage.remove(ACCOUNT_KEY, null)
  },
  isLoggedIn: () => {
    return new Promise((resolve, reject) => {
      Storage.get(ACCOUNT_KEY)
      .then(data => {
        resolve(Utils.ifDefNN(data))
      })
      .catch(err => {
        resolve(false)
      })
    })
  }
}
