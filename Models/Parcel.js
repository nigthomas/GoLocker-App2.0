export default class Parcel {
  constructor (data) {
    this.length = data.length
    this.width = data.width
    this.height = data.height
    this.weight = data.weight
    this.name = data.name
    this.code = data.code
  }

  toJSON() {
    return {length: this.length,
            width: this.width,
            height: this.height,
            weight: this.weight,
            name: this.name,
            code: this.code}
  }
}
