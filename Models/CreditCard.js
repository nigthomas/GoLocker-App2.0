export default class CreditCard {
  constructor (data) {
    this.number = data.number
    this.month = data.month
    this.year = data.year
    this.cvc = data.cvc
    this.postalCode = data.postalCode
  }

  toJSON() {
    return {number: this.number,
            month: this.month,
            year: this.year,
            cvc: this.cvc,
            postalCode: this.postalCode}
  }
}
