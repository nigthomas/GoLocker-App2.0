import Location from './Location'

export default class Property {
  constructor (data) {
    this.id = data.id
    this.status = data.status
    this.name = data.name
    this.address = data.address
    this.address2 = data.address2
    this.city = data.city
    this.stateProvince = data.stateProvince
    this.postalCode = data.postalCode
    this.countryCode = data.countryCode
    this.location = new Location(data.location)
    this.showPlan = data.showPlan
    this.settings = data.settings
  }

  fullAddress() {
    var address = this.address || ""

    if(this.city && this.city.length > 0) {
      address = address + ", " + this.city + ", "
    }

    if(this.stateProvince && this.stateProvince.length > 0) {
      address = address + this.stateProvince + ", "
    }

    if(this.postalCode && this.postalCode.length > 0) {
      address = address + this.postalCode
    }

    return address
  }

  isActive () {
    return this.status == 1
  }

  toJSON() {
    return {status: this.status,
            id: this.id,
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
