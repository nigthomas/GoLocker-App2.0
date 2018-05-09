import { ReservationNetworkManager } from '../Common/NetworkManager'
import Reservation from '../Models/Reservation'
import events from 'events'

export default class ReservationService {
  static sharedInstance = null;

  constructor(props) {
   this.state = {
     listener: new events.EventEmitter()
   };
  }

  static getInstance() {
     if (this.sharedInstance == null) {
         this.sharedInstance = new ReservationService();
     }

     return this.sharedInstance;
   }

   getListener() {
     return this.state.listener
   }

  getReservations() {
    return ReservationNetworkManager.get()
    .then(data => {
      return new Promise((resolve, reject) => { resolve(data.map((reservationData) => { return new Reservation(reservationData)}))})
    })
  }

  testEmit() {
    this.state.listener.emit('CREATED_RESERVATION');
  }

  createReservation(parcel, accountNumber, type, trackingNumber, lockerId)  {
    return ReservationNetworkManager.create(parcel, accountNumber, type, trackingNumber, lockerId)
    .then(data => {
      setTimeout(() => {
        this.state.listener.emit('CREATED_RESERVATION');
      }, 500)
      return new Promise((resolve, reject) => { resolve(data) })
    })
  }

  cancelReservation(reservationId) {
    return ReservationNetworkManager.cancel(reservationId)
  }
}
