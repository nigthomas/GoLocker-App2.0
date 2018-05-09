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
import Entypo from 'react-native-vector-icons/dist/Entypo'
import ThreeHeaderView from '../Elements/ThreeHeaderView'
import AccountService from '../Services/AccountService'
import PhoneInput from 'react-native-phone-input'
import MapView, { Marker } from 'react-native-maps';
import ActionService from '../Services/ActionService'

export default class LockerDetail extends Component {
  static navigationOptions = { header: null, tabBarVisible: false };

  constructor(props) {
   super(props);

   const { params } = this.props.navigation.state;
   const lockers = params.lockers

   this.state = {
     lockers: lockers
   };
  }

  onBackPress() {
    this.props.navigation.goBack()
  }

  showLockerDetail(locker) {
    const { navigate }  = this.props.navigation;
    navigate('LockerDetailView', {locker: locker})
  }

  renderLockerItem(locker) {
    if(!locker || !locker.property) {
      return null
    }

    const name = locker.property.name
    const address = locker.property.address
    const fullAddress = locker.property.fullAddress(2)
    const location = (locker.property.location) ? locker.property.location : null
    const coordinate = {latitude: location.latitude, longitude: location.longitude}
    const isPrimaryLocker = locker.isPrimaryLocker()

    if(isPrimaryLocker) {
      return (
        <TouchableHighlight onPress={() => {this.showLockerDetail(locker)}} underlayColor={'transparent'} key={locker.id}>
          <View style={{paddingLeft:21, paddingRight:21, paddingTop: 3, height: 70, flex: 1, borderTopColor: Colors.gray_ef, borderTopWidth: 1, borderBottomColor: Colors.gray_ef, borderBottomWidth: 1}}>
            <Text style={{paddingTop: 3, color: Colors.dark_gray, fontWeight: 'bold', fontSize: 16}}>{name}</Text>
            <View><Text style={{color: Colors.gray_b5, fontSize: 14}}>{fullAddress}</Text></View>
            <Entypo name="chevron-small-right" size={25} style={{color: Colors.gray_85, position: 'absolute', right: 21, top: 20}}/>
          </View>
        </TouchableHighlight>
      )
    }

    return (
      <TouchableHighlight onPress={() => {this.showLockerDetail(locker)}} underlayColor={'transparent'} key={locker.id}>
        <View style={{height: 70, flex: 1, paddingLeft:21, paddingTop: 3, paddingRight:21}}>
          <Text style={{paddingTop: 3, color: Colors.dark_gray, fontWeight: 'bold', fontSize: 16}}>{name}</Text>
          <View><Text style={{color: Colors.gray_b5, fontSize: 14}}>{fullAddress}</Text></View>
          <Entypo name="chevron-small-right" size={25} style={{color: Colors.gray_85, position: 'absolute', right: 21, top: 20}}/>
        </View>
      </TouchableHighlight>
    )
  }

  render() {
    const lockers = this.state.lockers
    var lockerViews = []

    for(var i in lockers) {
      lockerViews.push(this.renderLockerItem(lockers[i]))
    }

    return (
      <Root>
        <Container>
          <Content style={{backgroundColor: Colors.white}}>
          <View style={{marginTop: 40}}>
            <ThreeHeaderView title={"My Lockers"} leftButtonTitle={"Back"} rightButtonTitle={""} onLeftPress={() => {this.onBackPress()}}/>
          </View>
          {lockerViews}
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
