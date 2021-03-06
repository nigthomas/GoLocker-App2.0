import { PropertiesNetworkManager } from '../Common/NetworkManager'
import Property from '../Models/Property'

export default PropertyService = {
  getProperties: (postalCode) => {
    if(!postalCode) {
      return new Promise((resolve, reject) => { reject(new Error('Missing postal code'))})
    }

    return PropertiesNetworkManager.get(postalCode)
    .then(data => {
      return new Promise((resolve, reject) => { resolve(data.map((propertyData) => { return new Property(propertyData)}))})
    })
  },
  getPropertiesFromLocationCode: (code) => {
    if(!code) {
      return new Promise((resolve, reject) => { reject(new Error('Missing location code'))})
    }

    return PropertiesNetworkManager.getPropertiesFromLocationCode(code)
    .then(data => {
      return new Promise((resolve, reject) => { resolve(data.map((propertyData) => { return new Property(propertyData)}))})
    })
  }
}
