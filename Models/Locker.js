import Property from './Property'
import CompartmentSize from './CompartmentSize'

export default class Locker {
  constructor (data, primaryLockerID) {
    this.id = data.id
    this.created = data.created
    this.updated = data.updated
    this.status = data.status
    this.propertyID = data.propertyID
    this.vendor = data.vendor
    this.externalID = data.externalID
    this.type = data.type
    this.isPrimary = this.id === primaryLockerID
    this.property = new Property(data.property)
    this.compartmentSizes = this.buildCompartments(data.compartmentSizes)
  }

  buildCompartments (data) {
    if(!data) {
      return []
    }

    return Object.keys(data).map((key) => new CompartmentSize(data[key]))
  }

  toJSON() {
    return {id: this.id,
            created: this.created,
            updated: this.updated,
            status: this.status,
            propertyID: this.propertyID,
            vendor: this.vendor,
            externalID: this.externalID,
            type: this.type,
            property: this.property
          }
  }
}
