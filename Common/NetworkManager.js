import LoginService from '../Services/LoginService'
import axios from 'axios'

const BASE_URL = "https://api.golocker.com"

const URL = {
  login: `${BASE_URL}/v1/authenticate`,
  properties: `${BASE_URL}/v1/properties`,
  dashboard: `${BASE_URL}/v1/account`,
  reservation: `${BASE_URL}/v1/account/reservations`,
  createReservation: `${BASE_URL}/v1/packages`
}

const STATUS_CODE = {
  OK: 200,
  NO_CONTENT: 204
}

const HEADERS = {
  Accept: 'application/json','Content-Type': 'application/json'
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
  }
}

export const PropertiesNetworkManager = {
  get: (postalCode) => {
    if(!postalCode) {
      return new Promise((resolve, reject) => { reject(new Error('Missing zip code'))})
    }

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
  }
}

export const DashboardNetworkManager = {
  get: () => {
    return LoginService.account()
    .then(account => {
      return fetch(URL.dashboard, {
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

      return new Promise((resolve, reject) => { reject(new Error('Error has occurred'))})
    })
  }
}

export const ReservationNetworkManager = {
  get: () => {
    return LoginService.account()
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


      return new Promise((resolve, reject) => { reject(new Error('Error has occurred'))})
    })
  },
  cancel: (reservationId) => {
    return LoginService.account()
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

      return new Promise((resolve, reject) => { reject(new Error('Error has occurred'))})
    })
  },
  create: (parcel, accountNumber, type, trackingNumber, lockerId) => {
    return LoginService.account()
    .then(account => {
      return fetch(URL.createReservation, {
        method: 'POST',
        headers: {
          Accept: HEADERS.Accept,
          authorization: `${account.token_type} ${account.access_token}`,
          body: {type: type, trackingNumber: trackingNumber, accountNumber: accountNumber, parcel: parcel, lockerID:lockerId}
        }
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
