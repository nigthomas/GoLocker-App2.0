import CreditCard from './CreditCard'

export default class Address {
  constructor (data) {
    this.address = data.address
    this.address2 = data.address2
    this.city = data.city
    this.stateProvince = data.stateProvince || data.stateOrProvince
    this.postalCode = data.postalCode
    this.countryCode = data.countryCode
    this.creditCard = new CreditCard(data.creditCard || {})
    this.countryCode = data.countryCode
  }

  fullAddress() {
    var address = this.address || ""

    if(this.city && this.city.length > 0) {
      address = address + this.city + ", "
    }

    if(this.state && this.state.length > 0) {
      address = address + this.state + ", "
    }

    if(this.postalCode && this.postalCode.length > 0) {
      address = address + this.postalCode
    }

    return address
  }

  toJSON() {
    return {address: this.address,
            address2: this.address2,
            city: this.city,
            stateProvince: this.stateProvince,
            postalCode: this.postalCode,
            countryCode: this.countryCode,
            creditCard: this.creditCard,
            countryCode: this.countryCode}
  }
}
