export default class Address {
  constructor (data) {
    this.address = data.address
    this.address2 = data.address2
    this.city = data.city
    this.stateProvince = data.stateProvince || data.stateOrProvince
    this.postalCode = data.postalCode
    this.countryCode = data.countryCode
    this.creditCard = data.creditCard
    this.countryCode = data.countryCode
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
