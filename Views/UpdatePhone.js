import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, FlatList, TextInput, TouchableHighlight, SafeAreaView} from 'react-native';
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
import Entypo from 'react-native-vector-icons/dist/Entypo'
import ThreeHeaderView from '../Elements/ThreeHeaderView'
import AccountService from '../Services/AccountService'
import PhoneInput from 'react-native-phone-input'
import NativeStatusBar from '../Elements/NativeStatusBar'

export default class UpdatePhone extends Component {
  static navigationOptions = { header: null, tabBarVisible: false };

  constructor(props) {
   super(props);

   const { params } = this.props.navigation.state;
   var phone = params.phone
   var countryCode = 1;

   if(phone.length > 10) {
     countryCode = phone.substr(0, phone.length - 10)
     phone = phone.substr(countryCode.length, phone.length)
   }

   this.state = {
     phone: phone,
     error: null,
     countryCode: String(countryCode)
   };
  }

  onSavePress() {
    const countryCode = this.countryCode.getValue().replace("+", "")
    const number = countryCode + this.state.phone
    AccountService.getInstance().updatePhone(number)
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
    const errorText = this.state.error ? <Text style={{marginLeft: 21, color: Colors.red, marginTop: 10}}>Something is wrong. Please try again</Text> : null
    return (
      <Root>
        <Container>
        <NativeStatusBar/>
          <Content style={{backgroundColor: Colors.white}}>
          <SafeAreaView style={{marginTop: 20}}>
            <ThreeHeaderView title={"Phone"} leftButtonTitle={"Back"} rightButtonTitle={"Save"} onLeftPress={() => {this.onBackPress()}} onRightPress={() => {this.onSavePress()}}/>
          </SafeAreaView>
          <View style={{justifyContent: 'center', borderTopColor: Colors.gray_ef, borderTopWidth: 1, borderBottomColor: Colors.gray_ef, borderBottomWidth: 1, height: 50, flex: 1}}>
            <View style={{flexDirection:'row', flexWrap:'wrap'}}>
              <View style={{flex: 1, marginLeft: 21, marginTop: 15}}>
              <PhoneInput ref={(ref) => { this.countryCode = ref; }} value={this.state.countryCode}/>
              </View>
              <TextInput underlineColorAndroid='transparent' placeholderTextColor={Colors.dark_gray} keyboardType='numeric' style={{flex: 3, paddingLeft: 10, color: Colors.dark_gray, backgroundColor: Colors.white, height: 50, fontFamily: Theme.primaryFont, borderTopColor: Colors.gray_ef, borderTopWidth: 1, borderBottomColor: Colors.gray_ef, borderBottomWidth: 1}} placeholder={"Phone Number"} onChangeText={(phone) => this.setState({phone})} value={this.state.phone}/>
            </View>
          </View>
          {errorText}
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
