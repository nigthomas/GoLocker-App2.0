import { AuthenticationNetworkManager } from '../Common/NetworkManager'
import Storage from '../Common/Storage'
import Utils from '../Common/Utils'
import Account from '../Models/Account'
import events from 'events'
const ONBOARDING_KEY = "onboarding_shown"

export default class OnboardingService {
  static sharedInstance = null;

  constructor(props) {
   this.state = {
     listener: new events.EventEmitter()
   };
  }

  static getInstance() {
     if (this.sharedInstance == null) {
         this.sharedInstance = new OnboardingService();
     }

     return this.sharedInstance;
   }

   getListener() {
     return this.state.listener
   }

   shouldShowOnboarding() {
     return Storage.get(ONBOARDING_KEY)
     .then(data => {
       return new Promise((resolve, reject) => { resolve(data == null) })
     })
     .catch(err => {
       return new Promise((resolve, reject) => { resolve(true) })
     })
   }

   markShown() {
     Storage.set(ONBOARDING_KEY, JSON.stringify({shown: true})) 
   }

   clearShown() {
     Storage.remove(ONBOARDING_KEY)
   }
}
