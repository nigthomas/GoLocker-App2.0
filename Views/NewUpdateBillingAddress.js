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
import Address from '../Models/Address'
import AccountService from '../Services/AccountService'

export default class NewUpdateBillingAddress extends Component {
  static navigationOptions = { header: null, tabBarVisible: false };

  constructor(props) {
   super(props);

   const { params } = this.props.navigation.state;
   const address = params.address

   this.state = {
     address: address.address,
     address2: address.address2,
     city: address.city,
     state: address.stateProvince,
     zip: address.postalCode
   };
  }

  onSavePress() {
    const address = this.state.address
    const address2 = this.state.address2
    const city = this.state.city
    const state = this.state.state
    const zip = this.state.zip

    const updatedAddress = new Address({address: address, address2: address2, city: city, stateProvince: state, postalCode:zip})
    AccountService.getInstance().updateBillingAddress(updatedAddress)
    .then(() => {
      this.props.navigation.goBack()
    })
    .catch(err => {
      this.setState({error: err})
    })
  }

  onBackPress() {
    this.props.navigation.goBack()
  }

  render() {
    const errorText = this.state.error ? <Text style={{marginLeft: 21, color: Colors.red, marginTop: 5}}>Something is wrong. Please try again</Text> : null

    return (
      <Root>
        <Container>
          <Content style={{backgroundColor: Colors.white}}>
          <View style={{marginTop: 40}}>
            <ThreeHeaderView title={"Billing Address"} leftButtonTitle={"Back"} rightButtonTitle={"Save"} onLeftPress={() => {this.onBackPress()}} onRightPress={() => {this.onSavePress()}}/>
          </View>
          {errorText}
          <View style={{marginLeft: 21, marginRight: 21, marginTop: 30}}>
            <TextInput underlineColorAndroid='transparent' ref="usernameField" placeholderTextColor={Colors.tapable_blue} style={{paddingLeft: 21, color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, borderRadius: 4, fontFamily: Theme.primaryFont}} placeholder={"Address line one"} onChangeText={(address) => this.setState({address})} value={this.state.address}/>
            <TextInput underlineColorAndroid='transparent' ref="usernameField" placeholderTextColor={Colors.tapable_blue} style={{marginTop: 10, paddingLeft: 21, color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, borderRadius: 4, fontFamily: Theme.primaryFont}} placeholder={"Address line two"} onChangeText={(address2) => this.setState({address2})} value={this.state.address2}/>
            <TextInput underlineColorAndroid='transparent' ref="usernameField" placeholderTextColor={Colors.tapable_blue} style={{marginTop: 10, paddingLeft: 21, color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, borderRadius: 4, fontFamily: Theme.primaryFont}} placeholder={"City"} onChangeText={(city) => this.setState({city})} value={this.state.city}/>
            <View style={{flex: 1, flexDirection:'row'}}>
              <TextInput underlineColorAndroid='transparent' ref="usernameField" placeholderTextColor={Colors.tapable_blue} style={{flex: 1, marginTop: 10, marginRight: 5,paddingLeft: 21, color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, borderRadius: 4, fontFamily: Theme.primaryFont}} placeholder={"State"} onChangeText={(state) => this.setState({state})} value={this.state.state}/>
              <TextInput underlineColorAndroid='transparent' ref="usernameField" placeholderTextColor={Colors.tapable_blue} style={{flex: 1, marginTop: 10, marginLeft: 5, paddingLeft: 21, color: Colors.tapable_blue, backgroundColor: Colors.gray_ef, height: 50, borderRadius: 4, fontFamily: Theme.primaryFont}} placeholder={"Zip Code"} onChangeText={(zip) => this.setState({zip})} value={this.state.zip}/>
            </View>
          </View>

          </Content>
          <FooterTabWithNavigation navigation={this.props.navigation} active={"details"}/>
        </Container>
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.primaryColor
  },
});
