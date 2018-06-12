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

   updatePlan(plan) {
     if(!plan) {
       return new Promise((resolve, reject) => { reject(new Error('Missing plan'))})
     }

     return AccountNetworkManager.updatePlan(plan)
     .then(data => {
       this.state.listener.emit('UPDATED');
       return new Promise((resolve, reject) => { resolve()})
     })
   }

   updateCreditCard(card) {
     if(!card) {
       return new Promise((resolve, reject) => { reject(new Error('Missing card'))})
     }

     return AccountNetworkManager.updateCreditCard(card)
     .then(data => {
       this.state.listener.emit('UPDATED');
       return new Promise((resolve, reject) => { resolve()})
     })
   }

   applyPromoCode(code) {
     if(!code) {
       return new Promise((resolve, reject) => { reject(new Error('Missing code'))})
     }

     return AccountNetworkManager.applyPromoCode(code)
   }

   updateBillingAddress(address) {
     if(!address) {
       return new Promise((resolve, reject) => { reject(new Error('Missing address'))})
     }

     return AccountNetworkManager.updateBillingAddress(address)
     .then(data => {
       this.state.listener.emit('UPDATED');
       return new Promise((resolve, reject) => { resolve()})
     })
   }

   updateMailingAddress(address) {
     if(!address) {
       return new Promise((resolve, reject) => { reject(new Error('Missing address'))})
     }

     return AccountNetworkManager.updateMailingAddress(address)
     .then(data => {
       this.state.listener.emit('UPDATED');
       return new Promise((resolve, reject) => { resolve()})
     })
   }

   updatePassword(password) {
     if(!password) {
       return new Promise((resolve, reject) => { reject(new Error('Missing password'))})
     }

     return AccountNetworkManager.updatePassword(password)
     .then(data => {
       return new Promise((resolve, reject) => { resolve()})
     })
   }

   resetPassword(email) {
     if(!email) {
       return new Promise((resolve, reject) => { reject(new Error('Missing email'))})
     }

     return AccountNetworkManager.resetPassword(email)
     .then(data => {
       return new Promise((resolve, reject) => { resolve()})
     })
   }

   verifyCode(code, email) {
     if(!code || !email) {
       return new Promise((resolve, reject) => { reject(new Error('Missing code or email'))})
     }

     return AccountNetworkManager.verifyCode(code, email)
     .then(data => {
       return new Promise((resolve, reject) => { resolve()})
     })
   }

   setNewPassword(password, email, code) {
     if(!code || !email || !password) {
       return new Promise((resolve, reject) => { reject(new Error('Missing code or email or password'))})
     }

     return AccountNetworkManager.setNewPassword(password, code, email)
     .then(data => {
       return new Promise((resolve, reject) => { resolve()})
     })
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
       return new Promise((resolve, reject) => { reject(new Error('Missing phone number'))})
     }

     return AccountNetworkManager.updatePhone(phone)
     .then(data => {
       this.state.listener.emit('UPDATED');
       return new Promise((resolve, reject) => { resolve()})
     })
   }
}
