import { AdNetworkManager } from '../Common/NetworkManager'
import Storage from '../Common/Storage'
import Utils from '../Common/Utils'
import Dashboard from '../Models/Dashboard'
import uniqueRandomArray from 'unique-random-array'

export default AdService = {
  getAd: () => {
    return AdNetworkManager.getAds()
    .then(data => {
      const ads = uniqueRandomArray(data.show_ads ? data.ads : [])
      return new Promise((resolve, reject) => { resolve(ads())})
    })
  }
}
