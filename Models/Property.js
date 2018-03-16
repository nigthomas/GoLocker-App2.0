export default class Property {
  constructor (data) {
    this.status = data.status
    this.name = data.name
    this.address = data.address
    this.address2 = data.address2
    this.city = data.city
    this.stateProvince = data.stateProvince
    this.postalCode = data.postalCode
    this.countryCode = data.countryCode
    this.location = data.location
    this.showPlan = data.showPlan
    this.settings = data.settings
  }

  toJSON() {
    return {status: this.status,
            name: this.name,
            address: this.address,
            address2: this.address2,
            city: this.city,
            stateProvince: this.stateProvince,
            postalCode: this.postalCode,
            countryCode: this.countryCode,
            location: this.location,
            showPlan: this.showPlan,
            settings: this.settings}
  }
}
