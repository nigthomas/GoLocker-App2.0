import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, FlatList, TextInput, TouchableHighlight} from 'react-native';
import Theme from '../Common/Theme'
import FooterTabWithNavigation from './FooterTabWithNavigation'
import { Container, Header, Content, Card, CardItem, Left, Thumbnail, Body, Button, Icon, Title, Footer, FooterTab, Root, Right} from 'native-base';
import LoadingView from './Loading'
import DashboardService from '../Services/DashboardService'
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons'
import ClearButton from '../Elements/ClearButton'
import HeaderView from '../Elements/HeaderView'
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons'
import Moment from 'moment'
import Utils from '../Common/Utils'
import Swipeout from 'react-native-swipeout';
import ThreeHeaderView from '../Elements/ThreeHeaderView'
import ErrorView from './ErrorView'
import AccountService from '../Services/AccountService'
import CreditCard from '../Models/CreditCard'

export default class NewUpdatePaymentMethod extends Component {
  static navigationOptions = { header: null, tabBarVisible: false };

  constructor(props) {
   super(props);

   const { params } = this.props.navigation.state;
   const card = params.creditCard || {}
   const zip = params.address && params.address.postalCode ? params.address.postalCode : null

   const expirationYear = card.year
   const expirationMonth = card.month

   this.state = {
     cardNumber: card.number || bullets,
     expirationMonth: expirationMonth || defaultExpirationMonth,
     expirationYear: expirationYear || defaultExpirationYear,
     cvv: null,
     zip: zip,
     error: null,
     missingCheckMessage: null
   };
  }

  onSavePress() {
    const cardNumber = this.state.cardNumber
    const expirationMonth = this.state.expirationMonth
    const expirationYear = this.state.expirationYear
    const cvv = this.state.cvv
    const zip = this.state.zip

    if(!cardNumber || cardNumber.length < 15) {
      this.setState({missingCheckMessage: "Please enter a valid credit card", error: null, cardNumber: null, expirationMonth: null, expirationYear: null, cvv: null, zip: null})
      return
    }

    if(!expirationMonth) {
      this.setState({missingCheckMessage: "Please enter a valid expiration month", error: null, cardNumber: null, expirationMonth: null, expirationYear: null, cvv: null, zip: null})
      return
    }

    if(!expirationYear || expirationYear.length != 4) {
      this.setState({missingCheckMessage: "Please enter a valid expiration year", error: null, cardNumber: null, expirationMonth: null, expirationYear: null, cvv: null, zip: null})
      return
    }

    if(!cvv) {
      this.setState({missingCheckMessage: "Please enter a valid cvv", error: null, cardNumber: null, expirationMonth: null, expirationYear: null, cvv: null, zip: null})
      return
    }

    if(!zip) {
      this.setState({missingCheckMessage: "Please enter a valid postal code", error: null, cardNumber: null, expirationMonth: null, expirationYear: null, cvv: null, zip: null})
      return
    }

    const creditCard = new CreditCard({number: cardNumber, month: expirationMonth, year: expirationYear, cvc: cvv, postalCode: zip})

    AccountService.getInstance().updateCreditCard(creditCard)
    .then(() => {
      this.setState({missingCheckMessage: null, cardNumber: null, expirationMonth: null, expirationYear: null, cvv: null, zip: null})
      this.props.navigation.goBack()
    })
    .catch(err => {
      this.setState({error: err})
    })
  }

  onBackPress() {
    this.props.navigation.goBack()
  }

  onCreditCardNumberFocus() {
    if (this.state.cardNumber === bullets) {
      this.setState({cardNumber: null})
    }
  }

  onCreditCardNumberBlur() {
    if (this.state.cardNumber === null || this.state.cardNumber === "") {
      this.setState({cardNumber: bullets})
    }
  }

  onExpirationMonthFocus() {
    if (this.state.expirationMonth === defaultExpirationMonth) {
      this.setState({expirationMonth: null})
    }
  }

  onExpirationMonthBlur() {
    if (this.state.expirationMonth === null || this.state.expirationMonth === "") {
      this.setState({expirationMonth: defaultExpirationMonth})
    }
  }

  onExpirationYearFocus() {
    if (this.state.expirationYear === defaultExpirationYear) {
      this.setState({expirationYear: null})
    }
  }

  onExpirationYearBlur() {
    if (this.state.expirationYear === null || this.state.expirationYear === "") {
      this.setState({expirationYear: defaultExpirationYear})
    }
  }

  render() {
    var missingCheckMessage = this.state.missingCheckMessage

    if(!missingCheckMessage && this.state.error) {
      missingCheckMessage = "An error has occurred. Try again"
    }

    var errorText = missingCheckMessage ? <Text style={{marginLeft: 21, color: Colors.red, marginBottom: 10}}>{missingCheckMessage}</Text> : null

    const expirationYear = this.state.expirationYear || ""
    const expirationMonth = this.state.expirationMonth || ""
    const expiration = `${expirationMonth}/${expirationYear}`

    return (
      <Root>
        <Container>
          <Content style={{backgroundColor: Colors.white}}>
          <View style={{marginTop: 40}}>
            <ThreeHeaderView title={"Payment Info"} leftButtonTitle={"Back"} rightButtonTitle={"Save"} onLeftPress={() => {this.onBackPress()}} onRightPress={() => {this.onSavePress()}}/>
          </View>
          {errorText}
          <View style={styles.card}>
            <Text style={{color: Colors.white, flex: 1, fontSize: 35, marginTop: 50, marginLeft: 21, marginRight: 21}}  numberOfLines={1} adjustsFontSizeToFit={true}>{this.state.cardNumber}</Text>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={{flex: 1, marginTop: 15}}>
                <Text style={{color: Colors.white, textAlign: 'right'}}>{expiration}</Text>
              </View>
            </View>
          </View>

          <View style={{marginLeft: 21, marginRight: 21, marginTop: 30}}>
            <TextInput underlineColorAndroid='transparent' ref="cardNumberField" placeholderTextColor={Colors.tapable_blue}  onBlur={() => {this.onCreditCardNumberBlur()}} onFocus={() => {this.onCreditCardNumberFocus()}} keyboardType='numeric' maxLength={16} style={{marginTop: 10, paddingLeft: 21, color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, borderRadius: 4, fontFamily: Theme.primaryFont}} placeholder={"Card Number"} onChangeText={(cardNumber) => this.setState({cardNumber})} value={this.state.cardNumber}/>
            <View style={{flex: 1, flexDirection:'row'}}>
              <TextInput underlineColorAndroid='transparent' ref="expirationMonthField" placeholderTextColor={Colors.tapable_blue} onBlur={() => {this.onExpirationMonthBlur()}} onFocus={() => {this.onExpirationMonthFocus()}} keyboardType='numeric' maxLength={2} style={{flex: 1, marginTop: 10, marginRight: 5,paddingLeft: 21, color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, borderRadius: 4, fontFamily: Theme.primaryFont}} placeholder={"MM"} onChangeText={(expirationMonth) => this.setState({expirationMonth})} value={this.state.expirationMonth}/>
              <TextInput underlineColorAndroid='transparent' ref="expirationYearField" placeholderTextColor={Colors.tapable_blue} onBlur={() => {this.onExpirationYearBlur()}} onFocus={() => {this.onExpirationYearFocus()}} keyboardType='numeric' maxLength={4} style={{flex: 1, marginTop: 10, marginRight: 5,paddingLeft: 21, color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, borderRadius: 4, fontFamily: Theme.primaryFont}} placeholder={"YYYY"} onChangeText={(expirationYear) => this.setState({expirationYear})} value={this.state.expirationYear}/>
              <TextInput underlineColorAndroid='transparent' ref="cvvField" placeholderTextColor={Colors.tapable_blue} keyboardType='numeric' maxLength={4} style={{flex: 1, marginTop: 10, marginLeft: 5, paddingLeft: 21, color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, borderRadius: 4, fontFamily: Theme.primaryFont}} placeholder={"CVV"} onChangeText={(cvv) => this.setState({cvv})} value={this.state.cvv}/>
              <TextInput underlineColorAndroid='transparent' ref="zipField" placeholderTextColor={Colors.tapable_blue}  keyboardType='numeric' maxLength={5} style={{flex: 1, marginTop: 10, marginLeft: 5, paddingLeft: 21, color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, borderRadius: 4, fontFamily: Theme.primaryFont}} placeholder={"ZIP"} onChangeText={(zip) => this.setState({zip})} value={this.state.zip}/>
            </View>
          </View>

          </Content>
          <FooterTabWithNavigation navigation={this.props.navigation} active={"details"}/>
        </Container>
      </Root>
    );
  }
}

const bullets = "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022"
const defaultExpirationMonth = "MM"
const defaultExpirationYear = "YYYY"

const styles = StyleSheet.create({
  card: {
    padding: 20,
    height: 179,
    backgroundColor: Colors.gray_d8,
    marginLeft: 21,
    marginRight: 21,
    borderWidth: 1,
    borderColor: Colors.dark_gray,
    borderRadius: 4
  }
});
