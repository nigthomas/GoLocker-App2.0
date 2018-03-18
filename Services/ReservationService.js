import { ReservationNetworkManager } from '../Common/NetworkManager'
import Reservation from '../Models/Reservation'

export default ReservationService = {
  getReservations: () => {
    return ReservationNetworkManager.get()
    .then(data => {
      return new Promise((resolve, reject) => { resolve(data.map((reservationData) => { return new Reservation(reservationData)}))})
    })
  }
}
