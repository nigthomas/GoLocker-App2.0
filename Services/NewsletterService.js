import { NewsletterNetworkManager } from '../Common/NetworkManager'
import Storage from '../Common/Storage'
import Utils from '../Common/Utils'
import Dashboard from '../Models/Dashboard'

export default NewsletterService = {
  addEmail: (email) => {
    if (!email || !Utils.validateEmail(email)) {
      return new Promise((resolve, reject) => { reject(new Error('Missing or bad email'))})
    }

    return NewsletterNetworkManager.addEmail(email)
  }
}
