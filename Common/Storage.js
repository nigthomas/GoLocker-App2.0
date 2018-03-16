import { AsyncStorage } from 'react-native'

export default Storage = {
  get: (key) => {
    return AsyncStorage.getItem(key)
  },
  set: (key, value) => {
    AsyncStorage.setItem(key, value)
  },
  remove: (key) => {
    AsyncStorage.removeItem(key)
  }
}
