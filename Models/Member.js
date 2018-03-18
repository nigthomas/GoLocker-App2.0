export default class Member {
  constructor (data) {
    this.id = data.id
    this.created = data.created
    this.updated = data.updated
    this.status = data.status
    this.accountNumber = data.accountNumber
    this.firstName = data.firstname
    this.lastName = data.lastname
    this.email = data.email
    this.mobilePhone = data.mobilePhone
    this.homePhone = data.homePhone
    this.company = data.company
    this.username = data.username
    this.primaryLockerID = data.primaryLockerID
    this.secondaryLockerID = data.secondaryLockerID
  }

  toJSON() {
    return {id: this.id,
            created: this.created,
            updated: this.updated,
            status: this.status,
            accountNumber: this.accountNumber,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            mobilePhone: this.mobilePhone,
            homePhone: this.homePhone,
            company: this.company,
            username: this.username,
            primaryLockerID: this.primaryLockerID,
            secondaryLockerID: this.secondaryLockerID}
  }
} 
