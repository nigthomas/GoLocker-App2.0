import LoginService from '../Services/LoginService'
import axios from 'axios'
import events from 'events'

const BASE_URL = "https://api.golocker.com"

const URL = {
  login: `${BASE_URL}/v1/authenticate`,
  properties: `${BASE_URL}/v1/properties`,
  account: `${BASE_URL}/v1/account`,
  reservation: `${BASE_URL}/v1/account/reservations`,
  createReservation: `${BASE_URL}/v1/packages`,
  register: `${BASE_URL}/v1/register`,
  resetPassword: `${BASE_URL}/v1/resetPassword`,
  action: `${BASE_URL}/v1/properties`,
  lockers: `${BASE_URL}/v1/lockers`,
  newsletter: `${BASE_URL}/v1/newsletter`
}

const STATUS_CODE = {
  OK: 200,
  UNAUTHORIZED: 401,
  NO_CONTENT: 204
}

const HEADERS = {
  Accept: 'application/json','Content-Type': 'application/json'
}

export class NetworkStatusListener {
  static sharedInstance = null;

  constructor(props) {
   this.state = {
     listener: new events.EventEmitter(),
     eventListeners: []
   };
  }

  static getInstance() {
     if (this.sharedInstance == null) {
         this.sharedInstance = new NetworkStatusListener();
     }

     return this.sharedInstance;
   }

   getListener() {
     return this.state.listener
   }

   forceLogout() {
     this.state.listener.emit('FORCE_LOGOUT');
   }
}

export const NewsletterNetworkManager = {
  addEmail: (email) => {
    return fetch(URL.newsletter, {
      method: 'POST',
      headers: {
        Accept: HEADERS.Accept,
        },
        body: JSON.stringify({
         email: email
       })
      })
    .then((response) => {
      if(response.status === STATUS_CODE.OK) {
        return response.json()
      }

      return new Promise((resolve, reject) => { reject(new Error('Error has occurred'))})
    })
  }
}

export const LockerNetworkManager = {
  get: () => {
    return LoginService.getInstance().account()
    .then(account => {
      return fetch(URL.lockers, {
        method: 'GET',
        headers: {
            Accept: HEADERS.Accept,
            authorization: `${account.token_type} ${account.access_token}`,
          }
        })
    })
    .then((response) => {
      if(response.status === STATUS_CODE.OK) {
        return response.json()
      }

      return new Promise((resolve, reject) => { reject(new Error('Error has occurred'))})
    })
  },
  setPrimaryLocker: (lockerID) => {
    return LoginService.getInstance().account()
    .then(account => {
      return fetch(URL.account, {
        method: 'PUT',
        headers: {
          Accept: HEADERS.Accept,
          authorization: `${account.token_type} ${account.access_token}`,
        },
        body: JSON.stringify({primaryLockerID: lockerID})
      })
    })
    .then((response) => {
      if(response.status === STATUS_CODE.OK) {
        return response.json()
      }

      if(response.status === STATUS_CODE.UNAUTHORIZED) {
        NetworkStatusListener.getInstance().forceLogout()
        return new Promise((resolve, reject) => { reject(new Error('Unauthorized'))})
      }

      return new Promise((resolve, reject) => { reject(new Error('Error has occurred'))})
    })
  },
  setSecondaryLocker: (lockerID) => {
    return LoginService.getInstance().account()
    .then(account => {
      return fetch(URL.account, {
        method: 'PUT',
        headers: {
          Accept: HEADERS.Accept,
          authorization: `${account.token_type} ${account.access_token}`,
        },
        body: JSON.stringify({secondaryLockerID: lockerID})
      })
    })
    .then((response) => {
      if(response.status === STATUS_CODE.OK) {
        return response.json()
      }

      if(response.status === STATUS_CODE.UNAUTHORIZED) {
        NetworkStatusListener.getInstance().forceLogout()
        return new Promise((resolve, reject) => { reject(new Error('Unauthorized'))})
      }

      return new Promise((resolve, reject) => { reject(new Error('Error has occurred'))})
    })
  }
}

export const ActionNetworkManager = {
  openDoor: (propertyID) => {
    if(!propertyID) {
      return new Promise((resolve, reject) => { reject(new Error('Missing propertyID'))})
    }

    return LoginService.getInstance().account()
    .then(account => {
      return fetch(`${URL.action}/${propertyID}/action`, {
        method: 'POST',
        headers: {
            Accept: HEADERS.Accept,
            authorization: `${account.token_type} ${account.access_token}`,
          },
          body: JSON.stringify({
           action: "open_door"
         }),
        })
    })
    .then((response) => {
      if(response.status === STATUS_CODE.OK) {
        return response.json()
      }

      return new Promise((resolve, reject) => { reject(new Error('Error has occurred'))})
    })
  }
}

export const AuthenticationNetworkManager = {
  login: (username, password) => {
    if(!username || !password) {
      return new Promise((resolve, reject) => { reject(new Error('Missing username or password'))})
    }

    return fetch(URL.login, {
      method: 'POST',
      headers: {
        Accept: HEADERS.Accept,
        },
        body: JSON.stringify({
         username: username,
         password: password,
       }),
      })
    .then((response) => {
      if(response.status === STATUS_CODE.OK) {
        return response.json()
      }

      return new Promise((resolve, reject) => { reject(new Error('Error has occurred'))})
    })
  },
  registerUser: (firstName, lastName, email, phone, password, lockerIdentifier, disability) => {
    const data = JSON.stringify({
     firstname: firstName,
     lastname: lastName,
     email: email,
     mobilePhone: phone,
     phoneNumber: phone,
     password: password,
     primaryPropertyID: lockerIdentifier,
     disability: disability
    })

    console.log(data)
    return fetch(URL.register, {
      method: 'POST',
      headers: {
        Accept: HEADERS.Accept,
        },
        body: data,
      })
    .then((response) => {
      if(response.status === STATUS_CODE.OK) {
        return response.json()
      }

      return new Promise((resolve, reject) => { reject(new Error('Error has occurred'))})
    })
  },
  verifyUser: (email, code) => {
    return fetch(URL.register, {
      method: 'PUT',
      headers: {
        Accept: HEADERS.Accept,
        },
        body: JSON.stringify({
         email: email,
         verificationCode: code
       }),
      })
    .then((response) => {
      if(response.status === STATUS_CODE.OK) {
        return response.json()
      }

      return new Promise((resolve, reject) => { reject(new Error('Error has occurred'))})
    })
  }
}

export const PropertiesNetworkManager = {
  get: (postalCode) => {
    return fetch(URL.properties, {
      method: 'PUT',
      headers: {
        Accept: HEADERS.Accept,
        },
        body: JSON.stringify({
         postalCode: postalCode
       })
      })
    .then((response) => {
      if(response.status === STATUS_CODE.OK) {
        return response.json()
      }

      return new Promise((resolve, reject) => { reject(new Error('Error has occurred'))})
    })
  },
  getPropertiesFromLocationCode: (code) => {
    return fetch(URL.properties, {
      method: 'PUT',
      headers: {
        Accept: HEADERS.Accept,
        },
        body: JSON.stringify({
         registrationCode: code
       })
      })
    .then((response) => {
      if(response.status === STATUS_CODE.OK) {
        return response.json()
      }

      return new Promise((resolve, reject) => { reject(new Error('Error has occurred'))})
    })
  }
}

export const AccountNetworkManager = {
  setNewPassword: (password, code, email) => {
    return fetch(URL.resetPassword, {
      method: 'PUT',
      headers: {
        Accept: HEADERS.Accept,
        },
        body: JSON.stringify({
         password: password,
         email: email,
         resetCode: code
       })
      })
    .then((response) => {
      if(response.status === STATUS_CODE.OK) {
        return response.json()
      }

      return new Promise((resolve, reject) => { reject(new Error('Error has occurred'))})
    })
  },
  verifyCode: (code, email) => {
    const url = `${URL.resetPassword}?email=${email}&code=${code}`
    return fetch(url, {
      method: 'GET',
      headers: {
        Accept: HEADERS.Accept,
      }
      })
    .then((response) => {
      if(response.status === STATUS_CODE.OK) {
        return response.json()
      }

      return new Promise((resolve, reject) => { reject(new Error('Error has occurred'))})
    })
  },
  resetPassword: (email) => {
    return fetch(URL.resetPassword, {
      method: 'POST',
      headers: {
        Accept: HEADERS.Accept,
        },
        body: JSON.stringify({
         email: email
       })
      })
    .then((response) => {
      if(response.status === STATUS_CODE.OK) {
        return response.json()
      }

      return new Promise((resolve, reject) => { reject(new Error('Error has occurred'))})
    })
  },
  updatePlan: (plan) => {
    return LoginService.getInstance().account()
    .then(account => {
      return fetch(URL.account, {
        method: 'PUT',
        headers: {
          Accept: HEADERS.Accept,
          authorization: `${account.token_type} ${account.access_token}`,
        },
        body: JSON.stringify({plan: plan})
      })
    })
    .then((response) => {
      if(response.status === STATUS_CODE.OK) {
        return response.json()
      }

      if(response.status === STATUS_CODE.UNAUTHORIZED) {
        NetworkStatusListener.getInstance().forceLogout()
        return new Promise((resolve, reject) => { reject(new Error('Unauthorized'))})
      }

      return new Promise((resolve, reject) => { reject(new Error('Error has occurred'))})
    })
  },
  updateCreditCard: (card) => {
    return LoginService.getInstance().account()
    .then(account => {
      return fetch(URL.account, {
        method: 'PUT',
        headers: {
          Accept: HEADERS.Accept,
          authorization: `${account.token_type} ${account.access_token}`,
        },
        body: JSON.stringify({billing: {creditCard: card}, postalCode: card.postalCode})
      })
    })
    .then((response) => {
      if(response.status === STATUS_CODE.OK) {
        return response.json()
      }

      if(response.status === STATUS_CODE.UNAUTHORIZED) {
        NetworkStatusListener.getInstance().forceLogout()
        return new Promise((resolve, reject) => { reject(new Error('Unauthorized'))})
      }

      return new Promise((resolve, reject) => { reject(new Error('Error has occurred'))})
    })
  },
  updateMailingAddress: (address) => {
    return LoginService.getInstance().account()
    .then(account => {
      return fetch(URL.account, {
        method: 'PUT',
        headers: {
          Accept: HEADERS.Accept,
          authorization: `${account.token_type} ${account.access_token}`,
        },
        body: JSON.stringify({mailing: address})
      })
    })
    .then((response) => {
      if(response.status === STATUS_CODE.OK) {
        return response.json()
      }

      if(response.status === STATUS_CODE.UNAUTHORIZED) {
        NetworkStatusListener.getInstance().forceLogout()
        return new Promise((resolve, reject) => { reject(new Error('Unauthorized'))})
      }

      return new Promise((resolve, reject) => { reject(new Error('Error has occurred'))})
    })
  },
  updateBillingAddress: (address) => {
    return LoginService.getInstance().account()
    .then(account => {
      return fetch(URL.account, {
        method: 'PUT',
        headers: {
          Accept: HEADERS.Accept,
          authorization: `${account.token_type} ${account.access_token}`,
        },
        body: JSON.stringify({billing: address})
      })
    })
    .then((response) => {
      if(response.status === STATUS_CODE.OK) {
        return response.json()
      }

      if(response.status === STATUS_CODE.UNAUTHORIZED) {
        NetworkStatusListener.getInstance().forceLogout()
        return new Promise((resolve, reject) => { reject(new Error('Unauthorized'))})
      }

      return new Promise((resolve, reject) => { reject(new Error('Error has occurred'))})
    })
  },
  updatePassword: (password) => {
    return LoginService.getInstance().account()
    .then(account => {
      return fetch(URL.account, {
        method: 'PUT',
        headers: {
          Accept: HEADERS.Accept,
          authorization: `${account.token_type} ${account.access_token}`,
        },
        body: JSON.stringify({newPassword: password})
      })
    })
    .then((response) => {
      if(response.status === STATUS_CODE.OK) {
        return response.json()
      }

      if(response.status === STATUS_CODE.UNAUTHORIZED) {
        NetworkStatusListener.getInstance().forceLogout()
        return new Promise((resolve, reject) => { reject(new Error('Unauthorized'))})
      }

      return new Promise((resolve, reject) => { reject(new Error('Error has occurred'))})
    })
  },
  updateEmail: (email) => {
    return LoginService.getInstance().account()
    .then(account => {
      return fetch(URL.account, {
        method: 'PUT',
        headers: {
          Accept: HEADERS.Accept,
          authorization: `${account.token_type} ${account.access_token}`,
        },
        body: JSON.stringify({email: email})
      })
    })
    .then((response) => {
      if(response.status === STATUS_CODE.OK) {
        return response.json()
      }

      if(response.status === STATUS_CODE.UNAUTHORIZED) {
        NetworkStatusListener.getInstance().forceLogout()
        return new Promise((resolve, reject) => { reject(new Error('Unauthorized'))})
      }

      return new Promise((resolve, reject) => { reject(new Error('Error has occurred'))})
    })
  },
  updatePhone: (phone) => {
    return LoginService.getInstance().account()
    .then(account => {
      return fetch(URL.account, {
        method: 'PUT',
        headers: {
          Accept: HEADERS.Accept,
          authorization: `${account.token_type} ${account.access_token}`,
        },
        body: JSON.stringify({mobilePhone: phone})
      })
    })
    .then((response) => {
      if(response.status === STATUS_CODE.OK) {
        return response.json()
      }

      if(response.status === STATUS_CODE.UNAUTHORIZED) {
        NetworkStatusListener.getInstance().forceLogout()
        return new Promise((resolve, reject) => { reject(new Error('Unauthorized'))})
      }

      return new Promise((resolve, reject) => { reject(new Error('Error has occurred'))})
    })
  }
}

export const DashboardNetworkManager = {
  get: () => {
    return LoginService.getInstance().account()
    .then(account => {
      return fetch(URL.account, {
        method: 'GET',
        headers: {
          Accept: HEADERS.Accept,
          authorization: `${account.token_type} ${account.access_token}`,
          body: {}
        }
      })
    })
    .then((response) => {
      if(response.status === STATUS_CODE.OK) {
        return response.json()
      }

      if(response.status === STATUS_CODE.UNAUTHORIZED) {
        NetworkStatusListener.getInstance().forceLogout()
        return new Promise((resolve, reject) => { reject(new Error('Unauthorized'))})
      }

      return new Promise((resolve, reject) => { reject(new Error('Error has occurred'))})
    })
  }
}

export const ReservationNetworkManager = {
  get: () => {
    return LoginService.getInstance().account()
    .then(account => {
      return fetch(URL.reservation, {
        method: 'GET',
        headers: {
          Accept: HEADERS.Accept,
          authorization: `${account.token_type} ${account.access_token}`,
          body: {}
        }
      })
    })
    .then((response) => {
      if(response.status === STATUS_CODE.OK) {
        return response.json()
      }

      if(response.status === STATUS_CODE.UNAUTHORIZED) {
        NetworkStatusListener.getInstance().forceLogout()
        return new Promise((resolve, reject) => { reject(new Error('Unauthorized'))})
      }

      return new Promise((resolve, reject) => { reject(new Error('Error has occurred'))})
    })
  },
  cancel: (reservationId) => {
    return LoginService.getInstance().account()
    .then(account => {
      return axios({
              method: 'DELETE',
              url: `${URL.reservation}/${reservationId}`,
              headers: {
                Accept: HEADERS.Accept,
                authorization: `${account.token_type} ${account.access_token}`,
                body: {}
              },
              data: {}
            })
    })
    .then((response) => {
      if(response.status === STATUS_CODE.NO_CONTENT) {
        return new Promise((resolve, reject) => { resolve({})})
      }

      if(response.status === STATUS_CODE.UNAUTHORIZED) {
        NetworkStatusListener.getInstance().forceLogout()
        return new Promise((resolve, reject) => { reject(new Error('Unauthorized'))})
      }

      return new Promise((resolve, reject) => { reject(new Error('Error has occurred'))})
    })
  },
  create: (parcel, accountNumber, type, trackingNumber, lockerId) => {
    return LoginService.getInstance().account()
    .then(account => {
      return fetch(URL.createReservation, {
        method: 'POST',
        headers: {
          Accept: HEADERS.Accept,
          authorization: `${account.token_type} ${account.access_token}`,
        },
        body: JSON.stringify({type: type,
                              trackingNumber: trackingNumber,
                              accountNumber: accountNumber,
                              parcel: parcel,
                              lockerID:lockerId}
        )
      })
    })
    .then((response) => {
      if(response.status === STATUS_CODE.OK) {
        return response.json()
      }

      if(response.status === STATUS_CODE.UNAUTHORIZED) {
        NetworkStatusListener.getInstance().forceLogout()
        return new Promise((resolve, reject) => { reject(new Error('Unauthorized'))})
      }

      return new Promise((resolve, reject) => { reject(new Error('Error has occurred'))})
    })
  }
}
