const BASE_URL = "https://api.golocker.com"

const URL = {
  login: `${BASE_URL}/v1/authenticate`
}

const STATUS_CODE = {
  OK: 200
}

export const Authentication = {
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
