export default Storage = {
  get: (key) => {
    return AsyncStorage.getItem(key)
  },
  set: (key, value) => {
    AsyncStorage.setItem(key, value)
  }
}
