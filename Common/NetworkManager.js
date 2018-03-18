import LoginService from '../Services/LoginService'

const BASE_URL = "https://api.golocker.com"

const URL = {
  login: `${BASE_URL}/v1/authenticate`,
  properties: `${BASE_URL}/v1/properties`,
  dashboard: `${BASE_URL}/v1/account`
}

const STATUS_CODE = {
  OK: 200
}

export const AuthenticationNetworkManager = {
  login: (username, password) => {
    if(!username || !password) {
      return new Promise((resolve, reject) => { reject(new Error('Missing username or password'))})
    }

    return fetch(URL.login, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
          'Content-Type': 'application/json',
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
        Accept: 'application/json',
          'Content-Type': 'application/json',
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
          Accept: 'application/json','Content-Type': 'application/json',
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
