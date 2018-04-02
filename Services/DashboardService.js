import { DashboardNetworkManager } from '../Common/NetworkManager'
import Storage from '../Common/Storage'
import Utils from '../Common/Utils'
import Dashboard from '../Models/Dashboard'

export default DashboardService = {
  getInfo: () => {
    return DashboardNetworkManager.get()
    .then(data => {
      const dashboard = new Dashboard(data)
      return new Promise((resolve, reject) => { resolve(dashboard)})
    })
  }
}
 
