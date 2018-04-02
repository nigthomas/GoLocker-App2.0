export default class Location {
  constructor (data) {
    this.latitude = 0.0
    this.longitude = 0.0

    if(Array.isArray(data) && data.length == 2) {
      this.latitude = data[0]
      this.longitude = data[1]
    }
  }

  toJSON() {
    return {latitude: this.latitude,
            longitude: this.longitude}
  }
}
