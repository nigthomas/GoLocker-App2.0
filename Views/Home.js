import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, FlatList, TouchableHighlight, TouchableWithoutFeedback, Modal, Image, SafeAreaView, ScrollView, Dimensions, Platform, Alert, PermissionsAndroid, Linking, SectionList} from 'react-native';
import Theme from '../Common/Theme'
import Address from '../Models/Address'
import FooterTabWithNavigation from './FooterTabWithNavigation'
import { Container, Header, Content, Card, CardItem, Left, Thumbnail, Body, Button, Icon, Title, Footer, FooterTab, Root, Right} from 'native-base';
import LoadingView from './Loading'
import DashboardService from '../Services/DashboardService'
import ReservationService from '../Services/ReservationService'
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons'
import ClearButton from '../Elements/ClearButton'
import NativeStatusBar from '../Elements/NativeStatusBar'
import HeaderView from '../Elements/HeaderView'
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons'
import Moment from 'moment'
import Utils from '../Common/Utils'
import Swipeout from 'react-native-swipeout'
import MapView, { Marker } from 'react-native-maps';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome'
import ActionService from '../Services/ActionService'
import AdService from '../Services/AdService'
import firebase from 'react-native-firebase'
import _ from 'underscore'
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import DeviceInfo from 'react-native-device-info';

export default class HomeView extends Component {
  static navigationOptions = { header: null, tabBarVisible: false };

  constructor(props) {
   super(props);

   this.state = {
     data: {},
     reservationData: [],
     completedReservations: [],
     completedCollapsed: true,
     loading: false,
     error: null,
     qrCodeShown: false,
     hasLocationPermission: false,
     requestedLocation: false,
     selectedLocker: null,
     locationMsg: null,
     showOpenDoorButton: false,
     doorButtonColor: Colors.light_green,
     doorButtonText: "Tap to open front entrance",
     setupAnalytics: false,
     recordedAdImpression: false
   };
  }

  componentDidMount() {
    ReservationService.getInstance().getListener()
    .on("CREATED_RESERVATION", () => {
      this.fetch()
    })

    this.fetch()

    setInterval(() => {
      this.fetch()
    }, 120000)
  }

  onRefresh() {
    this.fetch()
  }

  setupAnalytics() {
    const data = this.state.data || {}

    firebase.analytics().setCurrentScreen("home")

    if (data.accountNumber) {
      firebase.analytics().setUserId(data.accountNumber)
      firebase.analytics().logEvent("home_shown", {accountNumber: data.accountNumber})
    }
  }

  fetch() {
    this.setState({loading: true, showOpenDoorButton: false, locationMsg: null, selectedLocker: null, doorButtonColor: Colors.light_green, doorButtonText: "Tap to open front entrance", requestedLocation: false})
    Promise.all([DashboardService.getInfo(), ReservationService.getInstance().getReservations()])
    .then(results => {
      const reservations = results[1]
      ;

      this.setState({data: results[0],
                     reservationData: reservations.filter((res) => res.status != 7),
                     completedReservations: reservations.filter((res) => res.status == 7),
                     loading: false,
                     error: null})
      this.showOpenDoorButtonIfNeeded()

      if(!this.state.setupAnalytics) {
        this.setupAnalytics()
        this.setState({setupAnalytics: true})
      }
    })
    .catch(err => {
      this.setState({error: err, loading: false, cancelling: false})
    })

    Promise.all([AdService.getAd()])
    .then(results => {
      this.setState({ad: results[0]})
    })
    .catch(err => {})
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

  renderItem(data) {
    const item = data.item
    const swipeBtns = [{
      text: 'Cancel',
      backgroundColor: Colors.red,
      onPress: () => { this.cancelReservation(item) }
    }];

    var lockerName = (item.locker && item.locker.property) ? item.locker.property.name : ""
    const expiration = (item.expirationDate) ? new Moment(item.expirationDate).format('MM/DD') : ""
    const trackingNumber = item.trackingNumber
    const pin = item.pin
    const status = item.statusString()
    var type = item.typeString()

    if(type) {
      type = (<Text style={{ color: Colors.gray_85, marginTop: 2}}>Type: {type}</Text>)
    }

    if(item.locker) {
      if(item.locker.externalID == "glkr00005") {
        lockerName = lockerName + " (Station 1)"
      } else if(item.locker.externalID == "glkr00014") {
        lockerName = lockerName + " (Station 2)"
      }
    }

    return (
      <Swipeout right={swipeBtns}
        backgroundColor= 'transparent'>
        <View style={{paddingTop:5, paddingBottom: 5, paddingLeft: 21, paddingRight: 21, flexDirection: 'row', alignSelf: 'flex-start'}}>
          <View style={{flex: 1}}>
            <Text style={{ color: Colors.gray_85}}>Name: <Text style={{ color: Colors.dark_gray, fontWeight: '600'}}>{lockerName}</Text></Text>
            <Text style={{ color: Colors.gray_85, marginTop: 2}}>Tracking: {trackingNumber}</Text>
            <Text style={{ color: Colors.gray_85, marginTop: 2}}>Pin: {pin}</Text>
            <Text style={{ color: Colors.gray_85, marginTop: 2}}>Created: {expiration}</Text>
            <Text style={{ color: Colors.gray_85, marginTop: 2}}>Status: {status}</Text>
            {type}
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
        <SafeAreaView style={{position: 'absolute', right: 21, top: 21}}>
          <TouchableHighlight
            onPress={() => {
              this.setState({qrCodeShown: false});
            }}>
              <Text style={{color: Colors.gray_b5}}>Close</Text>
          </TouchableHighlight>
          </SafeAreaView>
          <View style={{flex: 1, marginTop: 100, marginLeft: 21, alignItems: 'center'}}>
              <Image style={{width: 275, height: 275}} source={{uri: base64Icon}}/>
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
    const lockers = _.filter(this.lockers(), (locker) => (locker.property && locker.property.hasOpenDoorAction()))
    const coords = position.coords
    var closerLocker;
    var closerLockerDistance

    for(var i in lockers) {
      var locker = lockers[i]
      if (locker && locker.property && locker.property.location && locker.property.location.latitude && locker.property.location.longitude) {
        var latitude = locker.property.location.latitude
        var longitude = locker.property.location.longitude
        var distance = Utils.haversineDistance([latitude, longitude], [coords.latitude, coords.longitude] , true)

        if(!closerLocker || distance <= closerLockerDistance) {
          closerLockerDistance = distance
          closerLocker = locker
        }
      }
    }

    if (!closerLocker) {
      this.clearLocationWatch()
      this.setState({locationMsg: "You need to be closer to open the front entrance", showOpenDoorButton: false})
      return;
    }

    closerLockerDistance = closerLockerDistance * 5280 //Convert to feet

    if (closerLockerDistance > 1200) { //If you are more than 1200 feet turn off
      this.clearLocationWatch()
      this.setState({locationMsg: "You need to be closer to open the front entrance", selectedLocker: closerLocker, showOpenDoorButton: false})
      return;
    }

    if (closerLockerDistance <= 1000) {
      this.clearLocationWatch()
      this.openDoor()
      return;
    }

    this.setState({doorButtonText: "Please move closer to the front entrance \nor walk around the vicinity"})
  }

  clearLocationWatch() {
    if (Utils.ifDefNN(this.watchId)) {
      navigator.geolocation.clearWatch(this.watchId);
    }
  }

  async requestLocationPermission(locker) {
    this.clearLocationWatch()

    if (Utils.isIOS()) {
      this.watchLocation(locker)
      return;
    }

    if (Platform.Version < 23) {
      this.watchLocation(locker)
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            'title': locker.propertyName(),
            'message': "We need your location to open the front entrance. Please enable location permissions"
          }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.watchLocation(locker)
        }
        else {
          this.setState({locationMsg: "We need your location to open the front entrance. Please enable location permissions", selectedLocker: locker, showOpenDoorButton: false})
          this.clearLocationWatch()
        }
      } catch (err) {
        this.setState({locationMsg: "We couldn't find your location", selectedLocker: locker, showOpenDoorButton: false})
        this.clearLocationWatch()
      }
    }
  }

  watchLocation(locker) {
    const POSITION_UNAVAILABLE = 3;

    const throttledFindClosest = _.throttle((position) => {
      this.findClosestLocker(position)
    }, 5000)

    this.watchId = navigator.geolocation.watchPosition((position) => {
      throttledFindClosest(position);
    },
    (error) => {
      if (error.code == error.PERMISSION_DENIED) {
        this.setState({locationMsg: "We need your location to open the front entrance. Please enable location permissions", selectedLocker: locker, showOpenDoorButton: false})
        this.clearLocationWatch()
        return;
      } else if (error.code == POSITION_UNAVAILABLE || error.code == error.POSITION_UNAVAILABLE || error.code == error.code == error.TIMEOUT) {
        this.setState({locationMsg: "We couldn't find your location", selectedLocker: locker, showOpenDoorButton: false})
        this.clearLocationWatch()
        return;
      }

      if(!this.state.requestedLocation) {
        navigator.geolocation.requestAuthorization();
        this.setState({requestedLocation: true})

        //Request location in 7.5 seconds
        setTimeout(()=> {
          this.watchLocation(locker)
        }, 7500)
        return
      }
    },
    { enableHighAccuracy: true, timeout: 60000, maximumAge: 1000, distanceFilter: 5},
    );
  }

  showOpenDoorButtonIfNeeded() {
    const lockers = this.lockers()

    for(var i in lockers) {
      var locker = lockers[i];
      if(!locker || !locker.property) {
        continue;
      }

      let property = locker.property
      if (property.hasOpenDoorAction()) {
        this.setState({selectedLocker: locker, doorButtonText: "Tap to open front entrance", doorButtonColor: Colors.light_green, showOpenDoorButton: true})
        break;
      }
    }
  }

  toggleCompletedSection() {
    const completedCollapsed = this.state.completedCollapsed

    this.setState({completedCollapsed: !completedCollapsed})
  }

  renderSectionHeader(key) {
    const collapsed = this.state.completedCollapsed
    ;

    if(key == "Completed Packages") {
        const icon_name = collapsed ? "caret-up" : "caret-down"

        return (<TouchableHighlight onPress={() => {this.toggleCompletedSection()}} underlayColor={'transparent'}>
                  <View style={{flex: 1, flexDirection: 'row', marginTop: 21, marginBottom:21,}}>
                    <View style={{flex: 1}}>
                      <Text style={{fontSize: 16, color: Colors.gray_85, fontWeight: 'bold', marginLeft: 21}}>
                        {key}
                      </Text>
                    </View>
                    <View style={{flex: 1}}>
                      <FontAwesome name={icon_name} size={22} style={{alignSelf: 'flex-end', color: Colors.gray_85, marginTop: -5, marginRight: 21}}/>
                    </View>
                  </View>
                </TouchableHighlight>)

    }

    return (<Text style={{fontSize: 16, marginTop:21, marginBottom:21, color: Colors.gray_85, fontWeight: 'bold', marginLeft: 21}}>{key}</Text>)
  }

  renderList() {
    const reservationData = this.state.reservationData
    , completedReservationsData = this.state.completedReservations
    , completedReservations = this.state.completedCollapsed ? [] : this.state.completedReservations
    ;

    var sections = [{data: reservationData, renderItem: (item) => this.renderItem(item), key: "Packages"}];

    if (completedReservationsData.length > 0) {
      sections.push({data: completedReservations, renderItem: (item) => this.renderItem(item), key: "Completed Packages"})
    }

    return (<View style={{marginTop: 20}}>
              <SectionList renderSectionHeader={({section}) => this.renderSectionHeader(section.key)}
              sections={sections} keyExtractor={(item, index) => item.trackingNumber} backgroundColor={'white'}/>
            </View>)
  }

  showProcessingState() {
    this.setState({doorButtonText: "Opening door", doorButtonColor: Colors.gray_85})
  }

  showRegularState() {
    this.setState({doorButtonText: "Tap to open front entrance", doorButtonColor: Colors.light_green})
  }

  openDoor() {
    this.showProcessingState()
    const locker = this.state.selectedLocker
    const propertyID = locker.propertyID
    const data = this.state.data || {}

    if (data.accountNumber) {
      firebase.analytics().logEvent("open_door_pressed", {propertyID: propertyID, accountNumber: data.accountNumber})
    }

    ActionService.openDoor(propertyID)
    .then(data => {
      this.showRegularState()
      this.setState({doorButtonText: "Door opened"})
      ReactNativeHapticFeedback.trigger('notificationSuccess');
      setTimeout(() => {
        this.setState({doorButtonText: "Tap to open front entrance", doorButtonColor: Colors.light_green})
      }, 1500)
    })
    .catch(err => {
      Alert.alert(locker.propertyName(), "An error occurred while opening the door. Try again later",[{text: 'OK', onPress: () => {}}],{ cancelable: true })
      this.showRegularState()
    })
  }

  openDoorButtonTapped() {
    const lockers = this.lockers()

    for(var i in lockers) {
      var locker = lockers[i];
      if(!locker || !locker.property) {
        continue;
      }

      let property = locker.property
      if (property.hasOpenDoorAction()) {
        this.setState({doorButtonText: "Getting your location", doorButtonColor: Colors.gray_85})
        this.requestLocationPermission(locker)
        break;
      }
    }
  }

  renderOpenDoorButton() {
    return (
      <TouchableWithoutFeedback onPress={() => {this.openDoorButtonTapped()}} underlayColor={'transparent'}>
        <View style={{height: 60, borderRadius: 4, backgroundColor: this.state.doorButtonColor, marginLeft: 21, marginRight: 21, marginTop: 10, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{textAlign: 'center', color: Colors.white}}>{this.state.doorButtonText}</Text>
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
    if(!this.state.locationMsg && !this.state.showOpenDoorButton) {
      return null
    }

    const selectedLocker = this.state.selectedLocker
    const detailView = this.state.showOpenDoorButton ? this.renderOpenDoorButton() : this.renderLocationViewMessage()

    return (
      <View style={{marginTop: 21}}>
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

  onAdTap(ad) {
    const dashboardData = this.state.data || {}
    , accountNumber = dashboardData.accountNumber || ""
    ;

    Linking.openURL(ad.content_url)
    .then(() => {
      const ref = firebase.firestore().collection('events')
      return ref.doc().set({type: 'tap',
                            ad: ad,
                            createdAt: new Date(),
                            accountNumber: accountNumber,
                            buildNumber: DeviceInfo.getBuildNumber()})
    })
    .then(() => {

    })
    .catch((err) => console.error('An error occurred', err));
  }

  recordAdImpression() {
    const ad = this.state.ad
    , dashboardData = this.state.data || {}
    , accountNumber = dashboardData.accountNumber || ""
    ;

    if(!ad) {
      return
    }

    const ref = firebase.firestore().collection('events')
    ref.doc().set({type: 'impression',
                   ad: ad,
                   createdAt: new Date(),
                   accountNumber: accountNumber,
                   buildNumber: DeviceInfo.getBuildNumber()})
    .then(() =>{

    })
    .catch(err => {

    })

  }

  renderAdView(ad) {
    return (<View style={{flex: 1}}>
              <Text style={{marginLeft: 21, fontSize: 16, marginTop:21, color: Colors.gray_85, fontWeight: 'bold'}}>Sponsored Content</Text>
              <View style={{flex: 1, alignItems: 'center'}}>
                <TouchableHighlight onPress={() => {this.onAdTap(ad)}} underlayColor={'transparent'}>
                  <Image style={{width: 300, height: 250, marginTop: 21}} source={{uri: ad.image_url}}/>
                </TouchableHighlight>
              </View>
            </View>
            )
  }

  render() {
    if(this.state.loading) {
      return <View style={{flex: 1, backgroundColor: Colors.white}}>
              <NativeStatusBar/>
              <LoadingView />
              <FooterTabWithNavigation navigation={this.props.navigation} active={"home"}/>
            </View>
    }

    const dashboardData = this.state.data || {}
    const homeShippingAddress = dashboardData.homeShippingAddress && dashboardData.homeShippingAddress.isValid() ? dashboardData.homeShippingAddress : Address.headquarters()
    const firstName = Utils.capitalize(dashboardData.firstName || "")
    const lastName = Utils.capitalize(dashboardData.lastName || "")
    const accountNumber = dashboardData.accountNumber || ""
    const title = `${firstName} ${lastName} / ${accountNumber}`

    const primaryLocker = dashboardData && dashboardData.hasPrimaryLocker && dashboardData.hasPrimaryLocker() ? dashboardData.primaryLocker : null
    const secondaryLocker = dashboardData && dashboardData.hasSecondaryLocker && dashboardData.hasSecondaryLocker() ? dashboardData.secondaryLocker : null

    const qrCodeView = this.renderQRCode()
    const qrCodeButtonView = this.renderQRCodeButton()
    const data = this.state.reservationData || []
    const packagesView = (data.length == 0) ? this.renderEmptyList() : this.renderList()
    const ad = this.state.ad
    const adView = ad ? this.renderAdView(ad) : null
    const doorOpenActionView = this.renderDoorOpenActionView()
    const homeShippingAddressView =  this.renderShippingAddress(homeShippingAddress)
    const homeShippingAddressName = homeShippingAddress.name

    isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
      return layoutMeasurement.height + contentOffset.y >= contentSize.height - 1;
    };

    return (
      <Root>
        <Container>
        <NativeStatusBar/>
          <Content style={{backgroundColor: Colors.white}}  onScroll={({ nativeEvent }) => {
            if (isCloseToBottom(nativeEvent) && !this.state.recordedAdImpression) {
              this.setState({recordedAdImpression: true})
              this.recordAdImpression()
            }
          }}>
            <View style={{backgroundColor: Theme.primaryColor}}>
            <TouchableHighlight onPress={() => {this.onRefresh()}} underlayColor={'transparent'}>
              <SafeAreaView>
                <FontAwesome name="refresh" size={22} style={{alignSelf: 'flex-end', color: Colors.white, marginRight: 21, marginTop: Utils.isIOS() ? 0 : 25}}/>
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
            <View style={{height: 80}}>
              <View>
              <Text style={{marginLeft: 21, paddingTop:9, fontSize: 14, color: Colors.gray_85}}>{title}</Text>
              <Text style={{marginLeft: 21, fontSize: 14, color: Colors.gray_85, marginTop: 3}}>{homeShippingAddressName}</Text>

              <Text style={{fontSize: 14, color: Colors.gray_85, marginLeft: 21, marginTop: 3}}>
                {homeShippingAddress.address}
              </Text>
              <Text style={{fontSize: 14, color: Colors.gray_85, marginLeft: 21, marginTop: 3}}>
                {homeShippingAddress.city}, {homeShippingAddress.stateProvince} {homeShippingAddress.postalCode}
              </Text>
              </View>
            </View>
            {doorOpenActionView}
            {packagesView}

            {adView}

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
