export default class Account {
  constructor (data) {
    this.access_token = data.access_token
    this.token_type = data.token_type
    this.expires_in = data.expires_in
    this.scope = data.scope
  }

  toJSON() {
    return {access_token: this.access_token,
            token_type: this.token_type,
            expires_in: this.expires_in,
            scope: this.scope}
  }
}
