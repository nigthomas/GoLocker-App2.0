import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, FlatList, TouchableHighlight, TouchableWithoutFeedback, Modal, Image, SafeAreaView, ScrollView, Dimensions, Platform, Alert, PermissionsAndroid} from 'react-native';
import Theme from '../Common/Theme'
import Address from '../Models/Address'
import FooterTabWithNavigation from './FooterTabWithNavigation'
import { Container, Header, Content, Card, CardItem, Left, Thumbnail, Body, Button, Icon, Title, Footer, FooterTab, Root, Right} from 'native-base';
import LoadingView from './Loading'
import DashboardService from '../Services/DashboardService'
import ReservationService from '../Services/ReservationService'
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons'
import ClearButton from '../Elements/ClearButton'
import HeaderView from '../Elements/HeaderView'
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons'
import Moment from 'moment'
import Utils from '../Common/Utils'
import Swipeout from 'react-native-swipeout'
import MapView, { Marker } from 'react-native-maps';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome'
import ActionService from '../Services/ActionService'

export default class HomeView extends Component {
  static navigationOptions = { header: null, tabBarVisible: false };

  constructor(props) {
   super(props);

   this.state = {
     data: {},
     reservationData: [],
     loading: false,
     error: null,
     qrCodeShown: false,
     hasLocationPermission: false,
     requestedLocation: false,
     selectedLocker: null,
     locationMsg: null,
     showOpenDoorButton: false,
     doorButtonColor: Colors.light_green,
     doorButtonText: "Hold to open door"
   };
  }

  componentDidMount() {
    ReservationService.getInstance().getListener()
    .on("CREATED_RESERVATION", () => {
      this.fetch()
    })

    this.fetch()
  }

  onRefresh() {
    this.fetch()
  }

  fetch() {
    this.setState({loading: true})
    Promise.all([DashboardService.getInfo(), ReservationService.getInstance().getReservations()])
    .then(results => {
      this.setState({data: results[0], reservationData: results[1], loading: false, error: null})
      this.requestPermissionForLocationIfNeeded()
    })
    .catch(err => {
      this.setState({error: err, loading: false, cancelling: false})
    })
  }

  showLockerDetails(locker) {
    const { navigate }  = this.props.navigation;
    navigate('LockerDetailView', {locker: locker})
  }

  cancelReservation(reservation) {
    ReservationService.getInstance().cancelReservation(reservation.id)
    .then(() => {
      this.fetch()
    })
    .catch(err => {
      this.setState({loading: false, error: err})
    })
  }

  onShowQRCode() {
    this.setState({qrCodeShown: true})
  }

  canShowQRCode() {
    return Utils.ifDefNN(this.state.data.usernameQR)
  }

  renderItem(item) {
    const swipeBtns = [{
      text: 'Cancel',
      backgroundColor: Colors.red,
      onPress: () => { this.cancelReservation(item) }
    }];

    const lockerName = (item.locker && item.locker.property) ? item.locker.property.name : ""
    const expiration = (item.expirationDate) ? new Moment(item.expirationDate).format('MM/DD') : ""
    const trackingNumber = item.trackingNumber
    const pin = item.pin
    const direction = (item.barcode && item.barcode.includes("CNTI")) ? "Outgoing" : "Incoming"

    return (
      <Swipeout right={swipeBtns}
        backgroundColor= 'transparent'>
        <View style={{paddingTop:5, paddingBottom: 5, paddingLeft: 21, paddingRight: 21, flexDirection: 'row', alignSelf: 'flex-start', borderBottomWidth: 1, borderBottomColor: Colors.gray_ef}}>
          <View style={{flex: 1}}>
            <Text style={{ color: Colors.gray_85}}>Name: <Text style={{ color: Colors.dark_gray, fontWeight: '600'}}>{lockerName}</Text></Text>
            <Text style={{ color: Colors.gray_85, marginTop: 2}}>Tracking: {trackingNumber}</Text>
            <Text style={{ color: Colors.gray_85, marginTop: 2}}>Pin: {pin}</Text>
            <Text style={{ color: Colors.gray_85, marginTop: 2}}>Created: {expiration}</Text>
            <Text style={{ color: Colors.gray_85, marginTop: 2}}>Direction: {direction}</Text>
          </View>
        </View>
      </Swipeout>
    )
  }

  renderQRCode() {
    const qrCodeData = this.state.data.usernameQR

    if(!qrCodeData) {
      return null
    }

    const base64Icon = 'data:image/png;base64,' + qrCodeData

    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.state.qrCodeShown}
        onRequestClose={() => {
        }}>
        <SafeAreaView style={{marginTop: 30, flex: 1}}>
        <SafeAreaView style={{position: 'absolute', right: 21}}>
          <TouchableHighlight
            onPress={() => {
              this.setState({qrCodeShown: false});
            }}>
              <Text style={{color: Colors.gray_b5}}>Close</Text>
          </TouchableHighlight>
          </SafeAreaView>
          <View style={{flex: 1, marginTop: 100, marginLeft: 21, alignItems: 'center'}}>
              <Image style={{width: 164, height: 164}} source={{uri: base64Icon}}/>
          </View>
        </SafeAreaView>
      </Modal>
    )
  }

  renderQRCodeButton() {
    if(!this.canShowQRCode()) {
      return null
    }

    const dashboardData = this.state.data || {}
    const accountNumber = dashboardData.accountNumber || ""

    return (
      <View style={{flex: 1, flexDirection: 'row'}}>
        <Text style={{marginLeft: 21, fontSize: 14, color: Colors.gray_ef, textAlign: 'left', flex: 1}}>Account #{accountNumber}</Text>
        <TouchableHighlight onPress={() => {this.onShowQRCode()}} underlayColor={'transparent'} style={{flex: 1, marginRight: 21, height: 70}}>
          <FontAwesome name="qrcode" size={30} style={{alignSelf: 'flex-end', color: Colors.white, marginTop: 10}}/>
        </TouchableHighlight>
      </View>
    )
  }

  renderEmptyList() {
    return (
      <View style={{marginTop: 20, marginLeft: 21, marginBottom: 20}}>
        <Text style={{fontSize: 14, color: Colors.gray_85}}>You have no packages</Text>
      </View>
    );
  }

  lockers() {
    const data = this.state.data
    var lockers = []

    if(data.primaryLocker) {
      lockers.push(data.primaryLocker)
    }

    if(data.secondaryLocker) {
      lockers.push(data.secondaryLocker)
    }

    return lockers
  }

  componentWillUnmount() {
    this.clearLocationWatch()
  }

  findClosestLocker(position) {
    const lockers = this.lockers()
    const coords = position.coords
    var closerLocker;
    var closerLockerDistance;

    for(var i in lockers) {
      var locker = lockers[i]
      if (locker && locker.property && locker.property.location && locker.property.location.latitude && locker.property.location.longitude) {
        var latitude = locker.property.location.latitude
        var longitude = locker.property.location.longitude
        var distance = Utils.haversineDistance([latitude, longitude], [coords.latitude, coords.longitude] , true)

        if(!closerLockerDistance || distance < closerLockerDistance) {
          closerLockerDistance = distance
          closerLocker = locker
        }
      }
    }

    if (!closerLocker) {
      this.clearLocationWatch()
      return;
    }

    closerLockerDistance = closerLockerDistance * 5280 //Convert to feet

    if (closerLockerDistance > 1200) { //If you are more than 1200 feet turn off
      this.clearLocationWatch()
      return;
    }

    if (closerLockerDistance <= 500) {
      this.clearLocationWatch()
      this.setState({showOpenDoorButton: true, selectedLocker: closerLocker})
    }
  }

  clearLocationWatch() {
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
    }
  }

  requestLocationPermission(locker) {
    this.clearLocationWatch()

    if (Platform.OS === 'ios') {
      this.watchLocation(locker)
      return;
    }

    try {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': locker.propertyName(),
          'message': "Your location is needed to open the door"
        }
      )
      .then(granted => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.watchLocation(locker)
        } else {
          this.setState({locationMsg: "We need your location to open the door", selectedLocker: locker, showOpenDoorButton: false})
          this.clearLocationWatch()
        }
      })
    } catch (err) {
      this.setState({locationMsg: "We couldn't find your location", selectedLocker: locker, showOpenDoorButton: false})
      this.clearLocationWatch()
    }
  }

  watchLocation(locker) {
    this.watchId = navigator.geolocation.watchPosition((position) => {
      this.findClosestLocker(position)
    },
    (error) => {
      if (error.code == error.PERMISSION_DENIED) {
        this.setState({locationMsg: "We need your location to open the door", selectedLocker: locker, showOpenDoorButton: false})
        this.clearLocationWatch()
        return;
      } else if (error.code == error.POSITION_UNAVAILABLE || error.code == error.code == error.TIMEOUT) {
        this.setState({locationMsg: "We couldn't find your location", selectedLocker: locker, showOpenDoorButton: false})
        this.clearLocationWatch()
        return;
      }

      if(!this.state.requestedLocation) {
        navigator.geolocation.requestAuthorization();
        this.setState({requestedLocation: true})

        //Request location in 5 seconds
        setTimeout(()=> {
          this.watchLocation(locker)
        }, 7500)
        return
      }
    },
    { enableHighAccuracy: true, timeout: 60000, maximumAge: 1000, distanceFilter: 5 },
    );
  }

  requestPermissionForLocationIfNeeded() {
    const lockers = this.lockers()

    for(var i in lockers) {
      let locker = lockers[i];
      if(!locker || !locker.property) {
        continue;
      }

      let property = locker.property
      if (property.hasOpenDoorAction()) {
        this.requestLocationPermission(locker)
        break;
      }
    }
  }

  renderList() {
    const data = this.state.reservationData
    return (<View style={{marginTop: 20, borderTopColor: Colors.gray_ef, borderTopWidth: 1}}>
              <FlatList data={data} keyExtractor={(item, index) => item.trackingNumber} renderItem={({ item }) => {return this.renderItem(item)}} backgroundColor={'white'}/>
            </View>)
  }

  showProcessingState() {
    this.setState({doorButtonText: "Opening door", doorButtonColor: Colors.gray_85})
  }

  showRegularState() {
    this.setState({doorButtonText: "Hold to open door", doorButtonColor: Colors.light_green})
  }

  openDoor() {
    this.showProcessingState()

    const locker = this.state.selectedLocker
    const propertyID = locker.propertyID
    ActionService.openDoor(propertyID)
    .then(data => {
      this.showRegularState()
    })
    .catch(err => {
      Alert.alert(locker.propertyName(), "An error occurred while opening the door. Try again later",[{text: 'OK', onPress: () => {}}],{ cancelable: true })
      this.showRegularState()
    })
  }

  renderOpenDoorButton() {
    return (
      <TouchableWithoutFeedback onLongPress={() => {this.openDoor()}} underlayColor={'transparent'}>
        <View style={{height: 50, borderRadius: 4, backgroundColor: this.state.doorButtonColor, marginLeft: 21, marginTop: 25, marginRight: 21}}>
          <Text style={{textAlign: 'center', color: Colors.white, marginTop: 17}}>{this.state.doorButtonText}</Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  renderLocationViewMessage() {
    return (
      <View style={{marginTop: 20, marginLeft: 21, marginBottom: 20}}>
        <Text style={{fontSize: 14, color: Colors.gray_85}}>{this.state.locationMsg}</Text>
      </View>
    )
  }

  renderDoorOpenActionView() {
    const selectedLocker = this.state.selectedLocker
    const detailView = this.state.showOpenDoorButton ? this.renderOpenDoorButton() : this.renderLocationViewMessage()
    if (!selectedLocker) {
      return null
    }

    return (
      <View>
        <Text style={{marginLeft: 21, fontSize: 16, marginTop:21, color: Colors.gray_85, fontWeight: 'bold'}}>{selectedLocker.propertyName()}</Text>
        {detailView}
      </View>
    )
  }

  renderShippingAddress(homeShippingAddress) {
    if(!homeShippingAddress || !homeShippingAddress.location.isValid()) {
      return null
    }

    const name = homeShippingAddress.name
    const latitude = homeShippingAddress.location.latitude
    const longitude = homeShippingAddress.location.longitude

    return (
      <View style={{flex: 1, marginLeft:21, marginRight: 21, marginTop: 10}}>
        <MapView
          style={{flex: 1, height: 200, borderRadius: 4}}
          initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
          }}
          scrollEnabled={false}
          >
           <Marker
              key={"1"}
             coordinate={{latitude: latitude, longitude: longitude}}
             title={name}
             description={""}
           />
          </MapView>
        </View>
      )
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

    const dashboardData = this.state.data || {}
    const homeShippingAddress = dashboardData.homeShippingAddress || Address.headquarters()
    const firstName = Utils.capitalize(dashboardData.firstName || "")
    const lastName = Utils.capitalize(dashboardData.lastName || "")
    const accountNumber = dashboardData.accountNumber || ""

    const primaryLocker = dashboardData && dashboardData.hasPrimaryLocker && dashboardData.hasPrimaryLocker() ? dashboardData.primaryLocker : null
    const secondaryLocker = dashboardData && dashboardData.hasSecondaryLocker && dashboardData.hasSecondaryLocker() ? dashboardData.secondaryLocker : null

    const qrCodeView = this.renderQRCode()
    const qrCodeButtonView = this.renderQRCodeButton()
    const data = this.state.reservationData || []
    const packagesView = (data.length == 0) ? this.renderEmptyList() : this.renderList()
    const doorOpenActionView = this.renderDoorOpenActionView()
    const homeShippingAddressView =  this.renderShippingAddress(homeShippingAddress)
    const homeShippingAddressName = homeShippingAddress.name

    return (
      <Root>
        <Container>
        <StatusBar
          backgroundColor={Colors.white}
          barStyle="dark-content"
        />
          <Content style={{backgroundColor: Colors.white}}>
            <View style={{backgroundColor: Theme.primaryColor}}>
            <TouchableHighlight onPress={() => {this.onRefresh()}} underlayColor={'transparent'}>
              <SafeAreaView>
                <FontAwesome name="refresh" size={22} style={{alignSelf: 'flex-end', color: Colors.white, marginRight: 21, marginTop: Platform.OS === 'ios' ? 0 : 25}}/>
              </SafeAreaView>
            </TouchableHighlight>
            <View style={{marginTop: 30}}>
              <Text style={{marginLeft: 21, fontSize: 36, color: Colors.white, fontWeight: 'bold'}}>Welcome</Text>
              <Text style={{marginLeft: 21, fontSize: 36, color: Colors.white, fontWeight: 'bold'}}>{firstName} {lastName}</Text>
              {qrCodeButtonView}
            </View>
            {qrCodeView}
            </View>

            <Text style={{marginLeft: 21, fontSize: 16, marginTop:21, color: Colors.gray_85, fontWeight: 'bold'}}>Send packages to:</Text>
            {homeShippingAddressView}

            <View style={{height: 80}}>
                <View>
                <Text style={{marginLeft: 21, paddingTop:9, fontSize: 14, color: Colors.gray_85}}>{homeShippingAddressName}</Text>
                <Text style={{fontSize: 14, color: Colors.gray_85, marginLeft: 21, marginTop: 3}}>
                  {homeShippingAddress.address}
                </Text>
                <Text style={{fontSize: 14, color: Colors.gray_85, marginLeft: 21, marginTop: 3}}>
                  {homeShippingAddress.city}, {homeShippingAddress.stateProvince} {homeShippingAddress.postalCode}
                </Text>
                </View>
            </View>

            {doorOpenActionView}
            <Text style={{marginLeft: 21, fontSize: 16, marginTop:21, color: Colors.gray_85, fontWeight: 'bold'}}>Packages:</Text>
            {packagesView}

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
