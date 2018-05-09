import { LockerNetworkManager } from '../Common/NetworkManager'
import Storage from '../Common/Storage'
import Utils from '../Common/Utils'
import Locker from '../Models/Locker'
import events from 'events'

export default class LockerService {
  static sharedInstance = null;

  constructor(props) {
   this.state = {
     listener: new events.EventEmitter()
   };
  }

  static getInstance() {
     if (this.sharedInstance == null) {
         this.sharedInstance = new LockerService();
     }

     return this.sharedInstance;
   }

   getListener() {
     return this.state.listener
   }

  getLockers() {
    return LockerNetworkManager.get()
    .then(data => {
      return new Promise((resolve, reject) => { resolve(data.map((lockerData) => { return new Locker(lockerData)}))})
    })
  }

  setPrimaryLocker(lockerID) {
    if(!lockerID) {
      return new Promise((resolve, reject) => { reject(new Error('Missing lockerID'))})
    }

    return LockerNetworkManager.setPrimaryLocker(lockerID)
    .then(data => {
      this.state.listener.emit('UPDATED');
      return new Promise((resolve, reject) => { resolve(data)})
    })
  }

  setSecondaryLocker(lockerID) {
    if(!lockerID) {
      return new Promise((resolve, reject) => { reject(new Error('Missing lockerID'))})
    }

    return LockerNetworkManager.setSecondaryLocker(lockerID)
    .then(data => {
      this.state.listener.emit('UPDATED');
      return new Promise((resolve, reject) => { resolve(data)})
    })
  }
}
