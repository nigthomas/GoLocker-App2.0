import Address from './Address'
import Locker from './Locker'
import Parcel from './Parcel'
import Member from './Member'

export default class Reservation {
  constructor (data) {
    this.trackingNumber = data.trackingNumber
    this.id = data.id
    this.status = data.status
    this.pin = data.pin
    this.barcode = data.barcode
    this.delivered = data.delivered
    this.deliveryDate = data.deliveryDate
    this.expirationDate = data.expirationDate
    this.expirationNotices = data.expirationNotices
    this.extensions = data.extensions
    this.withdrawn = data.withdrawn
    this.withdrawnBy = data.withdrawnBy
    this.lockerID = data.lockerID
    this.columnID = data.columnID
    this.boxID = data.boxID
    this.type = data.type
    this.address = new Address(data.address)
    this.parcel = new Parcel(data.parcel)
    this.locker = new Locker(data.locker)
    this.user = new Member(data.user)
  }

  statusString() {
    if(this.delivered) {
      return "Completed"
    }

    if(this.expirationDate && Date.now() > new Date(this.expirationDate)) {
      return "Expired"
    }

    return "Active"
  }


  toJSON() {
    return {}
  }
}
