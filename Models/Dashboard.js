import Address from './Address'
import Membership from './Membership'
import Locker from './Locker'

export default class Dashboard {
  constructor (data) {
    this.status = data.status
    this.usernameQR = data.usernameQR
    this.type = data.type
    this.username = data.username
    this.accountNumber = data.accountNumber
    this.apartmentNumber = data.apartmentNumber
    this.disability = data.disability
    this.signupDate = data.signupDate
    this.firstName = data.firstname
    this.lastName = data.lastname
    this.mobileVerified = data.mobileVerified
    this.email = data.email
    this.mobilePhone = data.mobilePhone
    this.homePhone = data.homePhone
    this.mailing = new Address(data.mailing)
    this.billing = new Address(data.billing)
    this.membership = new Membership(data.membership)
    this.primaryLockerID = data.primaryLockerID
    this.secondaryLockerID = data.secondaryLockerID
    this.primaryLocker = new Locker(data.primaryLocker, this.primaryLockerID)
    this.secondaryLocker = new Locker(data.secondaryLocker, this.primaryLockerID)
  }

  isVerified() {
    return this.mobileVerified
  }

  hasPrimaryLocker () {
    return this.primaryLockerID && this.primaryLockerID.length > 0
  }

  hasSecondaryLocker() {
    return this.secondaryLockerID && this.secondaryLockerID.length > 0
  }

  toJSON() {
    return {status: this.status,
            type: this.type,
            username: this.username,
            accountNumber: this.accountNumber,
            apartmentNumber: this.apartmentNumber,
            disability: this.disability,
            signupDate: this.signupDate,
            firstname: this.firstName,
            lastname: this.lastName,
            email: this.email,
            mobileVerified: this.mobileVerified,
            mobilePhone: this.mobilePhone,
            homePhone: this.homePhone,
            mailing: this.mailing,
            billing: this.billing,
            membership: this.membership,
            primaryLockerID: this.primaryLockerID,
            secondaryLockerID: this.secondaryLockerID,
            primaryLocker: this.primaryLocker,
            secondaryLocker: this.secondaryLocker}
  }
}
