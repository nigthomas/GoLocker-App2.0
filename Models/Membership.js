export default class Membership {
  constructor (data) {
    this.externalID = data.externalID
    this.paymentSource = data.paymentSource
    this.status = data.status
    this.periodStart = data.periodStart
    this.periodEnd = data.periodEnd
    this.retryAttempts = data.retryAttempts
    this.nextRetry = data.nextRetry
    this.plan = data.plan
    this.prepaidShipments = data.prepaidShipments
    this.overageFee = data.overageFee
    this.renewalData = data.renewalData
    this.balance = data.balance
  }

  toJSON() {
    return {externalID: this.externalID,
            paymentSource: this.paymentSource,
            status: this.status,
            periodStart: this.periodStart,
            periodEnd: this.periodEnd,
            retryAttempts: this.retryAttempts,
            nextRetry: this.nextRetry,
            plan: this.plan,
            prepaidShipments: this.prepaidShipments,
            overageFee: this.overageFee,
            renewalData: this.renewalData,
            balance: this.balance}
  }
}
