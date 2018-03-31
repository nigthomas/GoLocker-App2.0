import { AuthenticationNetworkManager } from '../Common/NetworkManager'
import Storage from '../Common/Storage'
import Utils from '../Common/Utils'
import Account from '../Models/Account'

const ACCOUNT_KEY = "$account"

//Quick access to current account
var currentAccount = null

export default LoginService = {
  login: (username, password) => {
    if(!username || !password) {
      return new Promise((resolve, reject) => { reject(new Error('Missing username or password'))})
    }

    return AuthenticationNetworkManager.login(username, password)
    .then(data => {
      const account = new Account(data)
      Storage.set(ACCOUNT_KEY, JSON.stringify(account))
      return new Promise((resolve, reject) => { resolve(account)})
    })
  },
  account: () => {
    if (currentAccount) {
      return new Promise((resolve, reject) => { resolve(currentAccount)})
    }

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
    currentAccount = null
    Storage.remove(ACCOUNT_KEY, null)
  },
  isLoggedIn: () => {
    if (currentAccount) {
      return new Promise((resolve, reject) => { resolve(true)})
    }

    return new Promise((resolve, reject) => {
      Storage.get(ACCOUNT_KEY)
      .then(data => {
        const accountData = JSON.parse(data);
        const expirationDate = new Date(accountData.expires_in * 1000)

        if(expirationDate < new Date()) {
          //Clean up old account information
          Storage.remove(ACCOUNT_KEY, null)
          resolve(false)
        }

        currentAccount = new Account(accountData)
        resolve(Utils.ifDefNN(data))
      })
      .catch(err => {
        resolve(false)
      })
    })
  }
}
