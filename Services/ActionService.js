import { ActionNetworkManager } from '../Common/NetworkManager'
import Storage from '../Common/Storage'
import Utils from '../Common/Utils'
import Dashboard from '../Models/Dashboard'

export default ActionService = {
  openDoor: (propertyID) => {
    if(!propertyID) {
      return new Promise((resolve, reject) => { reject(new Error('Missing propertyID'))})
    }

    return ActionNetworkManager.openDoor(propertyID)
  }
}
