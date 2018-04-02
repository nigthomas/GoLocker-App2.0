import { AuthenticationNetworkManager } from '../Common/NetworkManager'
import Storage from '../Common/Storage'
import Utils from '../Common/Utils'
import Account from '../Models/Account'
import events from 'events'
const ACCOUNT_KEY = "$account"

//Quick access to current account

export default class LoginService {
  static sharedInstance = null;

  constructor(props) {
   this.state = {
     currentAccount: null,
     listener: new events.EventEmitter()
   };
  }

  static getInstance() {
     if (this.sharedInstance == null) {
         this.sharedInstance = new LoginService();
     }

     return this.sharedInstance;
   }

   getListener() {
     return this.state.listener
   }

  login(username, password) {
    if(!username || !password) {
      return new Promise((resolve, reject) => { reject(new Error('Missing username or password'))})
    }

    return AuthenticationNetworkManager.login(username, password)
    .then(data => {
      const account = new Account(data)
      Storage.set(ACCOUNT_KEY, JSON.stringify(account))
      return new Promise((resolve, reject) => { resolve(account)})
    })
  }

  account()  {
    if (this.state.currentAccount) {
      return new Promise((resolve, reject) => { resolve(this.state.currentAccount)})
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
  }

  logOut() {
    Storage.remove(ACCOUNT_KEY, null)
    this.state.listener.emit('LOGGED_OUT');
  }

  isLoggedIn() {
    if (this.state.currentAccount) {
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
          return resolve(false)
        }

        resolve(Utils.ifDefNN(data))
        this.setState({currentAccount: new Account(accountData)})
      })
      .catch(err => {
        resolve(false)
      })
    })
  }
}
