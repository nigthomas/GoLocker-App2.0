export default class CompartmentSize {
  constructor (data) {
    this.length = data.length
    this.width = data.width
    this.height = data.height
    this.name = data.name
    this.code = data.code
  }

  toJSON() {
    return {length: this.length,
            width: this.width,
            height: this.height,
            name: this.name,
            code: this.code}
  }
}
