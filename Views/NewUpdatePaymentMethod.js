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

export default class NewUpdatePaymentMethod extends Component {
  static navigationOptions = { header: null, tabBarVisible: false };

  constructor(props) {
   super(props);

   this.state = {
     fullName: defaultFullName,
     cardNumber: bullets,
     expiration: defaultExpiration,
     cvv: null,
     zip: null
   };
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

  onExpirationFocus() {
    if (this.state.expiration === defaultExpiration) {
      this.setState({expiration: null})
    }
  }

  onExpirationBlur() {
    if (this.state.expiration === null || this.state.expiration === "") {
      this.setState({expiration: defaultExpiration})
    }
  }

  onFullNameFocus() {
    if (this.state.fullName === defaultFullName) {
      this.setState({fullName: null})
    }
  }

  onFullNameBlur() {
    if (this.state.fullName === null || this.state.fullName === "") {
      this.setState({fullName: defaultFullName})
    }
  }

  render() {
    return (
      <Root>
        <Container>
          <Content style={{backgroundColor: Colors.white}}>
          <View style={{marginTop: 40}}>
            <ThreeHeaderView title={"Payment Info"} leftButtonTitle={"Back"} rightButtonTitle={"Save"} onLeftPress={() => {this.onBackPress()}} onRightPress={() => {this.onSavePress()}}/>
          </View>

          <View style={styles.card}>
            <Text style={{color: Colors.white, flex: 1, fontSize: 35, marginTop: 50, marginLeft: 21, marginRight: 21}}  numberOfLines={1} adjustsFontSizeToFit={true}>{this.state.cardNumber}</Text>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={{flex: 1, marginTop: 15}}>
                <Text style={{color: Colors.white, textAlign: 'left'}}>{this.state.fullName}</Text>
              </View>
              <View style={{flex: 1, marginTop: 15}}>
                <Text style={{color: Colors.white, textAlign: 'right'}}>{this.state.expiration}</Text>
              </View>
            </View>
          </View>

          <View style={{marginLeft: 21, marginRight: 21, marginTop: 30}}>
            <TextInput underlineColorAndroid='transparent' ref="fullNameField" placeholderTextColor={Colors.tapable_blue}  onBlur={() => {this.onFullNameBlur()}} onFocus={() => {this.onFullNameFocus()}} style={{paddingLeft: 21, color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, borderRadius: 4, fontFamily: Theme.primaryFont}} placeholder={"Full Name"} onChangeText={(fullName) => this.setState({fullName})} value={this.state.fullName}/>
            <TextInput underlineColorAndroid='transparent' ref="cardNumberField" placeholderTextColor={Colors.tapable_blue}  onBlur={() => {this.onCreditCardNumberBlur()}} onFocus={() => {this.onCreditCardNumberFocus()}} keyboardType='numeric' maxLength={16} style={{marginTop: 10, paddingLeft: 21, color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, borderRadius: 4, fontFamily: Theme.primaryFont}} placeholder={"Card Number"} onChangeText={(cardNumber) => this.setState({cardNumber})} value={this.state.cardNumber}/>
            <View style={{flex: 1, flexDirection:'row'}}>
              <TextInput underlineColorAndroid='transparent' ref="expirationField" placeholderTextColor={Colors.tapable_blue} onBlur={() => {this.onExpirationBlur()}} onFocus={() => {this.onExpirationFocus()}} keyboardType='numeric' maxLength={6} style={{flex: 1, marginTop: 10, marginRight: 5,paddingLeft: 21, color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, borderRadius: 4, fontFamily: Theme.primaryFont}} placeholder={"MM/YYYY"} onChangeText={(expiration) => this.setState({expiration})} value={this.state.expiration}/>
              <TextInput underlineColorAndroid='transparent' ref="cvvField" placeholderTextColor={Colors.tapable_blue} keyboardType='numeric' style={{flex: 1, marginTop: 10, marginLeft: 5, paddingLeft: 21, color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, borderRadius: 4, fontFamily: Theme.primaryFont}} placeholder={"CVV"} onChangeText={(cvv) => this.setState({cvv})} value={this.state.cvv}/>
              <TextInput underlineColorAndroid='transparent' ref="zipField" placeholderTextColor={Colors.tapable_blue}  keyboardType='numeric' maxLength={5} style={{flex: 1, marginTop: 10, marginLeft: 5, paddingLeft: 21, color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, borderRadius: 4, fontFamily: Theme.primaryFont}} placeholder={"Zip Code"} onChangeText={(zip) => this.setState({zip})} value={this.state.zip}/>
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
const defaultFullName = "FULL NAME"
const defaultExpiration = "MM/YYYY"

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
