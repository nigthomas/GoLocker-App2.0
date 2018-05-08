import { ActionNetworkManager } from '../Common/NetworkManager'
import Storage from '../Common/Storage'
import Utils from '../Common/Utils'
import Dashboard from '../Models/Dashboard'

export default ActionService = {
  openDoor: (propertyID) => {
    return ActionNetworkManager.openDoor(propertyID)
  }
}
