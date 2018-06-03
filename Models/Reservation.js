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

  typeString() {
    switch(this.type) {
      case 1:
        return "Receiving"
      case 2:
        return "Sending"
    }

    return null
  }

  statusString() {
    if(!this.status) {
      return null
    }

    var s = this.status;

    s = parseInt(s, 10)

    switch(s) {
      case 1:
        return "Active"
      case 2:
        return "Inactive"
      case 3:
        return "Deleted"
      case 4:
        return "Banned"
      case 5:
        return "Received"
      case 6:
        return (this.delivered) ? "Waiting" : "Out for delivery"
      case 7:
        return "Completed"
      case 8:
        return "Suspended"
      case 9:
        return "Expired"
    }

    return null
  }


  toJSON() {
    return {}
  }
}
