import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, FlatList, TouchableHighlight, Modal, Image, SafeAreaView} from 'react-native';
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
import Swipeout from 'react-native-swipeout'
import MapView, { Marker } from 'react-native-maps';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome'

export default class HomeView extends Component {
  static navigationOptions = { header: null, tabBarVisible: false };

  constructor(props) {
   super(props);

   this.state = {
     data: {},
     loading: false,
     error: null,
     qrCodeShown: false
   };
  }

  componentDidMount() {
    this.setState({loading: true})
    this.fetch()
  }

  onRefresh() {
    this.setState({loading: true})
    this.fetch()
  }

  fetch() {
    Promise.all([DashboardService.getInfo()])
    .then(results => {
      this.setState({data: results[0], loading: false, error: null})
    })
    .catch(err => {
      this.setState({error: err, loading: false})
    })
  }

  renderLockers(locker, secondaryLocker) {
    if(!locker || !locker.property) {
      return (<View></View>)
    }

    const location = (locker.property.location) ? locker.property.location : null
    const secondaryLocation = (secondaryLocker && secondaryLocker.property) ? secondaryLocker.property.location : null

    const name = locker.property.name
    const address = locker.property.address
    const fullAddress = locker.property.fullAddress()
    const coordinate = {latitude: location.latitude, longitude: location.longitude}
    const city = locker.property.city
    const state = locker.property.stateProvince
    const zip = locker.property.postalCode
    const lockerPositionText = locker.isPrimaryLocker() ? "PRIMARY" : "SECONDARY"

    if(!location) {
      return (
        <View>
        </View>
      )
    }

    var markers = [{title: locker.property.name, description: fullAddress, coordinate: coordinate}]

    if(secondaryLocker) {
      const secondaryLocation = (secondaryLocker.property.location) ? secondaryLocker.property.location : null
      markers.push({title: secondaryLocker.property.name, description: secondaryLocker.property.fullAddress(), coordinate: {latitude: secondaryLocation.latitude, longitude: secondaryLocation.longitude}})
    }

    return (
      <View style={{flex: 1}}>
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

  onShowQRCode() {
    this.setState({qrCodeShown: true})
  }

  render() {
    if(this.state.loading) {
      return <View style={{flex: 1, backgroundColor: Colors.white}}>
              <StatusBar
                backgroundColor={Colors.white}
                barStyle="dark-content"
              />
              <LoadingView />
              <FooterTabWithNavigation navigation={this.props.navigation} active={"home"}/>
            </View>
    }

    const dashboardData = this.state.data
    const firstName = Utils.capitalize(dashboardData.firstName || "")
    const lastName = Utils.capitalize(dashboardData.lastName || "")
    const accountNumber = dashboardData.accountNumber || ""

    const primaryLocker = dashboardData && dashboardData.hasPrimaryLocker && dashboardData.hasPrimaryLocker() ? dashboardData.primaryLocker : null
    const secondaryLocker = dashboardData && dashboardData.hasSecondaryLocker && dashboardData.hasSecondaryLocker() ? dashboardData.secondaryLocker : null

    const lockerView = this.renderLockers(primaryLocker, secondaryLocker)

    return (
      <Root>
        <Container>
        <StatusBar
          backgroundColor={Colors.white}
          barStyle="dark-content"
        />
          <Content style={{backgroundColor: Colors.white}}>
            <TouchableHighlight onPress={() => {this.onRefresh()}} underlayColor={'transparent'}>
              <SafeAreaView style={{position: 'absolute', right: 21, top: 40, height: 50, width: 50}}>
                <FontAwesome name="refresh" size={22} style={{alignSelf: 'flex-end', color: Colors.gray_85}}/>
              </SafeAreaView>
            </TouchableHighlight>
            <View style={{marginTop: 50}}>
              <Text style={{marginLeft: 21, marginTop: 20, fontSize: 36, color: Colors.dark_gray, fontWeight: 'bold'}}>Welcome</Text>
              <Text style={{marginLeft: 21, fontSize: 36, color: Colors.dark_gray, fontWeight: 'bold'}}>{firstName} {lastName}</Text>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <Text style={{marginLeft: 21, fontSize: 14, color: Colors.gray_b5, textAlign: 'left', flex: 1}}>Account #{accountNumber}</Text>

                <TouchableHighlight onPress={() => {this.onShowQRCode()}} underlayColor={'transparent'} style={{flex: 1, marginRight: 21, height: 50}}>
                  <FontAwesome name="qrcode" size={30} style={{alignSelf: 'flex-end', color: Colors.gray_85, marginTop: -10}}/>
                </TouchableHighlight>
              </View>

              <Text style={{marginLeft: 21, marginTop: 40, fontSize: 20, color: Colors.gray_85, fontWeight: 'bold'}}>Lockers</Text>
            </View>
            <View style={{marginTop: 20, marginLeft: 21, marginRight: 21}}>
              {lockerView}
            </View>

            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.qrCodeShown}
              onRequestClose={() => {
                alert('Modal has been closed.');
              }}>
              <SafeAreaView style={{marginTop: 20, flex: 1}}>
                <TouchableHighlight
                  onPress={() => {
                    this.setState({qrCodeShown: false});
                  }}>
                  <View style={{position: 'absolute', right: 21}}>
                    <Text style={{color: Colors.gray_b5}}>Close</Text>
                  </View>
                </TouchableHighlight>
                <View style={{flex: 1, marginTop: 100, marginLeft: 21, alignItems: 'center'}}>
                    <Image style={{width: 164, height: 164}} source={{uri: 'https://chart.googleapis.com/chart?cht=qr&chl=enecg.com&chs=180x180&choe=UTF-8&chld=L|2'}}/>
                </View>
              </SafeAreaView>
            </Modal>
          </Content>
          <FooterTabWithNavigation navigation={this.props.navigation} active={"home"}/>
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
