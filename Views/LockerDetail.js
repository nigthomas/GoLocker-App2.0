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
   const locker = params.locker

   const name = locker.propertyName()

   this.state = {
     locker: locker,
     lockerName: name
   };
  }

  onBackPress() {
    this.props.navigation.goBack()
  }

  openDoor() {
    const locker = this.state.locker
    const propertyID = locker.propertyID
    ActionService.openDoor(propertyID)
    .then(data => {
      this.setState({error: null})
    })
    .catch(err => {
      this.setState({error: err})
    })
  }

  renderOpenDoorActionButton() {
    return (
      <TouchableHighlight onPress={() => {this.openDoor()}} underlayColor={'transparent'}>
        <View style={{flex: 1, borderRadius: 5, height: 50, backgroundColor: Colors.white}}>
          <Text style={{textAlign: 'center', color: Theme.primaryColor, fontSize: 20, lineHeight: 50}}>Open Door</Text>
        </View>
      </TouchableHighlight>
    )
  }

  onChangeLocker() {
    const { navigate }  = this.props.navigation;
    const locker = this.state.locker

    navigate('ChangeLocker', {selectedLocker: locker})
  }

  renderLockerItem(locker) {
    if(!locker || !locker.property) {
      return null
    }

    const name = locker.property.name
    const address = locker.property.address
    const fullAddress = locker.property.fullAddress()
    const location = (locker.property.location) ? locker.property.location : null
    const coordinate = {latitude: location.latitude, longitude: location.longitude}
    const city = locker.property.city
    const state = locker.property.stateProvince
    const zip = locker.property.postalCode

    return (
        <View style={{flex: 1, marginTop: 10}}>
          <Text style={{color: Colors.gray_b5, fontSize: 14, marginTop: 10}}>{fullAddress}</Text>
        </View>
    )
  }

  renderLocker(locker) {
    if(!locker || !locker.property) {
      return (<View></View>)
    }

    const location = (locker.property.location) ? locker.property.location : null

    const name = locker.property.name
    const address = locker.property.address
    const fullAddress = locker.property.fullAddress()
    const coordinate = {latitude: location.latitude, longitude: location.longitude}
    const city = locker.property.city
    const state = locker.property.stateProvince
    const zip = locker.property.postalCode
    const lockerPositionText = locker.isPrimaryLocker() ? "PRIMARY" : "SECONDARY"

    var markers = [{title: locker.property.name, description: fullAddress, coordinate: coordinate}]

    return (
      <View style={{flex: 1, shadowOpacity: 0.1, shadowColor: Colors.black, shadowRadius: 2, shadowOffset: {width: 2, height: 2}}}>
        <View style={{flex: 1}}>
          <MapView
            style={{flex: 1, height: 200, borderRadius: 4}}
            initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0522,
            longitudeDelta: 0.0521,
            }}
            >
            {markers.map(marker => (
             <Marker
                key={marker.description}
               coordinate={marker.coordinate}
               title={marker.title}
               description={marker.description}
             />
            ))}
            </MapView>
          </View>
      </View>
      )
  }

  render() {
    const locker = this.state.locker
    const errorText = this.state.error ? <Text style={{color: Colors.red, marginBottom: 10}}>Error occurred while opening door</Text> : null
    const mapView = this.renderLocker(locker)
    const lockerView = this.renderLockerItem(locker)
    const headerText = locker.isPrimaryLocker() ? "Primary Location" : "Secondary Location"
    //Check logic first
    // const actionButton = this.renderOpenDoorActionButton()
    return (
      <Root>
        <Container>
          <Content style={{backgroundColor: Colors.white}}>
          <View style={{marginTop: 40}}>
            <ThreeHeaderView title={this.state.lockerName} leftButtonTitle={"Back"} rightButtonTitle={"Change"} onLeftPress={() => {this.onBackPress()}} onRightPress={() => {this.onChangeLocker()}}/>
          </View>
          <View style={{flex: 1, marginLeft: 21, marginRight: 21}}>
            {errorText}
            <Text style={{fontSize: 16, color: Colors.black, fontWeight: 'bold', marginBottom: 10}}>{headerText}</Text>
            {mapView}
            {lockerView}
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
