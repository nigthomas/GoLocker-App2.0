import { AuthenticationNetworkManager, AccountNetworkManager} from '../Common/NetworkManager'
import Storage from '../Common/Storage'
import Utils from '../Common/Utils'
import Account from '../Models/Account'
import events from 'events'

export default class AccountService {
  static sharedInstance = null;

  constructor(props) {
   this.state = {
     currentAccount: null,
     listener: new events.EventEmitter()
   };
  }

  static getInstance() {
     if (this.sharedInstance == null) {
         this.sharedInstance = new AccountService();
     }

     return this.sharedInstance;
   }

   getListener() {
     return this.state.listener
   }

   updateEmail(email) {
     if(!email) {
       return new Promise((resolve, reject) => { reject(new Error('Missing email'))})
     }

     return AccountNetworkManager.updateEmail(email)
     .then(data => {
       this.state.listener.emit('UPDATED');
       return new Promise((resolve, reject) => { resolve()})
     })
   }

   updatePhone(phone) {
     if(!phone) {
       return new Promise((resolve, reject) => { reject(new Error('Missing email'))})
     }

     return AccountNetworkManager.updatePhone(phone)
     .then(data => {
       this.state.listener.emit('UPDATED');
       return new Promise((resolve, reject) => { resolve()})
     })
   }
}
