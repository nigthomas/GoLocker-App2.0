import { ReservationNetworkManager } from '../Common/NetworkManager'
import Reservation from '../Models/Reservation'

export default ReservationService = {
  getReservations: () => {
    return ReservationNetworkManager.get()
    .then(data => {
      return new Promise((resolve, reject) => { resolve(data.map((reservationData) => { return new Reservation(reservationData)}))})
    })
  },
  createReservation: (parcel, accountNumber, type, trackingNumber, lockerId) => {
    return ReservationNetworkManager.create(parcel, accountNumber, type, trackingNumber, lockerId)
  },
  cancelReservation: (reservationId) => {
    return ReservationNetworkManager.cancel(reservationId)
  }
}
