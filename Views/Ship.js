import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, Image, Platform, TouchableHighlight, Modal, ScrollView, TextInput, findNodeHandle, Keyboard, FlatList, SafeAreaView} from 'react-native';
import { Container, Header, Content, Card, CardItem, Left, Thumbnail, Body, Button, Icon, Title, Footer, FooterTab, Right, ActionSheet, Root} from 'native-base';
import FooterTabWithNavigation from './FooterTabWithNavigation'
import ClearButton from '../Elements/ClearButton'
import Colors from '../Common/Colors'
import Address from '../Models/Address'
import Theme from '../Common/Theme'
import DashboardService from '../Services/DashboardService'
import ReservationService from '../Services/ReservationService'
import LoadingView from './Loading'
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons'
import Entypo from 'react-native-vector-icons/dist/Entypo'
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import _ from 'underscore'
import LoginService from '../Services/LoginService'
import Utils from '../Common/Utils'
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons'
import HeaderView from '../Elements/HeaderView'
import LockerService from '../Services/LockerService'
import NativeStatusBar from '../Elements/NativeStatusBar'

export default class Ship extends Component {
  static navigationOptions = { title: '', header: null, tabBarVisible: false};

  constructor(props) {
   super(props);

   this.state = {
     data: {},
     loading: false,
     error: null,
     account: null,
     sendToLocker: null,
     number: null,
     selectedLockerCompartment: null,
     choosePackageError: false,
     enterTrackingNumberError: false,
     buttonText: "Reserve a locker",
     buttonColor: Colors.light_green,
     reserving: false
   };
  }

  componentDidMount() {
    LockerService.getInstance().getListener()
    .on("UPDATED", () => {
      this.fetch()
    })

    this.fetch()
  }

  fetch() {
    this.setState({loading: true})
    Promise.all([DashboardService.getInfo()])
    .then(results => {
      const dashboardInfo = results[0]
      const primaryLocker = dashboardInfo.primaryLocker
      this.setState({data: dashboardInfo, loading: false, sendToLocker: primaryLocker})
    })
    .catch(err => {
      this.setState({error: err, loading: false})
    })
  }

  inputFocused(ref) {
    this._scroll(ref, 10);
  }

  inputBlurred(ref) {
    this._scroll(ref, 0);
  }

  _scroll(ref, offset) {
    setTimeout(() => {
      var scrollResponder = this.refs.scrollView.getScrollResponder();
      scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
                 findNodeHandle(this.refs[ref]),
                 offset,
                 true
             );
      }, 50);
  }

  selectedLocker(locker) {
    this.props.navigation.goBack()
    this.setState({selectedLockerCompartment: null, sendToLocker: locker})
  }

  onSmallParcelPress() {
    this.setState({smallParcelSelected: true, mediumParcelSelected: false, largeParcelSelected: false, extraLargeParcelSelected: false})
  }

  onMediumParcelPress() {
    this.setState({smallParcelSelected: false, mediumParcelSelected: true, largeParcelSelected: false, extraLargeParcelSelected: false})
  }

  onLargeParcelPress() {
    this.setState({smallParcelSelected: false, mediumParcelSelected: false, largeParcelSelected: true, extraLargeParcelSelected: false})
  }

  onExtraLargeParcelPress() {
    this.setState({smallParcelSelected: false, mediumParcelSelected: false, largeParcelSelected: false, extraLargeParcelSelected: true})
  }

  showProcessingState() {
    this.setState({buttonText: "Reserving...", buttonColor: Colors.gray_85, reserving: true})
  }

  showRegularState() {
    this.setState({buttonText: "Reserve a locker", buttonColor: Colors.light_green, reserving: false})
  }

  onChangeLocker() {
    const { navigate }  = this.props.navigation;
    const primaryLocker = this.state.data.primaryLocker
    const secondaryLocker = this.state.data.secondaryLocker
    const lockers = [primaryLocker, secondaryLocker]

    navigate('SelectLockerView', {lockers: lockers, onLockerSelected: this.selectedLocker.bind(this)})
  }

  onCompartmentSelect(compartment) {
    this.setState({selectedLockerCompartment: compartment})
  }

  renderCompartment(compartment) {
    const selectedCompartment = this.state.selectedLockerCompartment || {}
    const button = compartment.code == selectedCompartment.code ? <View style={styles.activeCircle}/> : <View style={styles.circle}/>
    return (
      <View style={{justifyContent: 'center', borderTopColor: Colors.gray_ef, borderTopWidth: 1, marginTop: 20, paddingTop: 15, height: 50, flex: 1}}>
        <TouchableHighlight onPress={() => {this.onCompartmentSelect(compartment)}} underlayColor={'transparent'}>
          <View>
            <Text style={{fontSize: 14, color: Colors.gray_85, marginLeft: 21}}>
              {compartment.name} Parcel
            </Text>
            <Text style={{fontSize: 10, color: Colors.gray_85, marginLeft: 21, marginTop: 3}}>
              No bigger than {compartment.height} H x {compartment.width} W x {compartment.length} L
            </Text>
            {button}
          </View>
        </TouchableHighlight>
      </View>
    )
  }

  onReserveLocker() {
    Keyboard.dismiss()

    const locker = this.state.sendToLocker
    const selectedLockerCompartment = this.state.selectedLockerCompartment
    const choosePackageError =  !selectedLockerCompartment
    const enterTrackingNumberError = this.state.number === null

    if(choosePackageError || enterTrackingNumberError) {
      this.component._root.scrollToPosition(0, 0)
      this.setState({choosePackageError: choosePackageError, enterTrackingNumberError: enterTrackingNumberError})
      return
    }

    const accountNumber = null
    const lockerId = this.state.sendToLocker.id

    if(this.state.reserving) {
      return;
    }

    this.showProcessingState()

    ReservationService.getInstance().createReservation(selectedLockerCompartment, accountNumber, 1, this.state.number, lockerId)
    .then(() => {
      this.setState({choosePackageError: false, enterTrackingNumberError: false, number: null, selectedLockerCompartment: null})
      this.showRegularState()
      return new Promise((resolve, reject) => {
        Keyboard.dismiss();
        setTimeout(() => { resolve(); }, 100);
      });
    })
    .then(() => {
      const { navigate } = this.props.navigation;
      setTimeout(() => {
        navigate('Home', {})
      }, 500)
    })
    .catch(err => {
      this.setState({error: err, loading: false})
      this.showRegularState()
    })
  }

  render() {
    if(this.state.loading) {
        return <View style={{flex: 1, backgroundColor: Colors.white}}>
                <LoadingView />
                <FooterTabWithNavigation navigation={this.props.navigation} active={"ship"}/>
              </View>
    }

    const data = this.state.data || {}
    const firstName = data.firstName
    const lastName = data.lastName
    const locker = this.state.sendToLocker
    const compartmentSizes = locker ? locker.compartmentSizes : []
    const lockerName = (this.state.sendToLocker && this.state.sendToLocker.property) ? this.state.sendToLocker.property.name: ""

    const errorText = this.state.error ? <Text style={{marginLeft: 21, color: Colors.red, marginTop: 5}}>Something is wrong. Please try again</Text> : null
    const homeShippingAddress = data.homeShippingAddress && data.homeShippingAddress.isValid() ? data.homeShippingAddress : Address.headquarters()

    return (
      <Root>
          <Container>
          <NativeStatusBar/>
            <Content style={{backgroundColor: Colors.white}} ref={c => (this.component = c)}>
              <SafeAreaView style={{marginTop: 40}}>
                <Text style={{marginLeft: 21, fontSize: 36, color: Colors.dark_gray, fontWeight: 'bold'}}>Send a package</Text>
              </SafeAreaView>
              {errorText}

              <Text style={{marginLeft: 21, marginTop: 20, fontSize: 16, color: Colors.gray_85, fontWeight: 'bold'}}>Location:</Text>
              <View style={{borderTopColor: Colors.gray_ef, borderTopWidth: 1, borderBottomColor: Colors.gray_ef, borderBottomWidth: 1, marginTop: 15, height: 80}}>
                <TouchableHighlight onPress={this.onLoginPress} underlayColor={'transparent'}>
                  <View>
                  <Text style={{marginLeft: 21, paddingTop:9, fontSize: 14, color: Colors.gray_85}}>{homeShippingAddress.name}</Text>
                  <Text style={{fontSize: 14, color: Colors.gray_85, marginLeft: 21, marginTop: 3}}>
                    {homeShippingAddress.address}
                  </Text>
                  <Text style={{fontSize: 14, color: Colors.gray_85, marginLeft: 21, marginTop: 3}}>
                    {homeShippingAddress.city}, {homeShippingAddress.stateProvince} {homeShippingAddress.postalCode}
                  </Text>
                  </View>
                </TouchableHighlight>
              </View>

              <Text style={{marginLeft: 21, marginTop: 20, fontSize: 16, color: Colors.gray_85, fontWeight: 'bold'}}>Deliver to:</Text>
              <View style={{justifyContent: 'center', borderTopColor: Colors.gray_ef, borderTopWidth: 1, borderBottomColor: Colors.gray_ef, borderBottomWidth: 1, marginTop: 15, height: 50}}>
                <TouchableHighlight onPress={() => {this.onChangeLocker()}} underlayColor={'transparent'}>
                  <Text style={{fontSize: 14, color: Colors.gray_85, marginLeft: 21}}>
                  {lockerName}
                  </Text>
                </TouchableHighlight>
                <Entypo name="chevron-small-right" size={25} style={{color: Colors.gray_85, position: 'absolute', right: 0}}/>
              </View>

              <Text style={{marginLeft: 21, marginTop: 20, fontSize: 16, color: this.state.choosePackageError ? Colors.red : Colors.gray_85, fontWeight: 'bold'}}>Please choose a package size</Text>
              <FlatList data={compartmentSizes} style={{height: 350}} keyExtractor={(item, index) => item.code} renderItem={({ item }) => {return this.renderCompartment(item)}} backgroundColor={'white'}/>

              <Text style={{marginLeft: 21, marginTop: 20, fontSize: Utils.normalize(16), color:  this.state.enterTrackingNumberError ? Colors.red : Colors.gray_85, fontWeight: 'bold'}}>Destination Shipping Info</Text>
              <View style={{marginLeft: 21, marginTop: 15, marginRight: 21}}>
                <TextInput underlineColorAndroid='transparent' ref="trackingNumberField" onFocus={() => {this.inputFocused.bind(this, 'trackingNumberField')}} onBlur={() => {this.inputBlurred.bind(this, 'trackingNumberField')}} placeholderTextColor={Colors.gray_85} style={{color: Colors.dark_gray, backgroundColor: Colors.gray_ef, height: 50, borderRadius: 4, fontFamily: Theme.primaryFont, paddingLeft: 10}} placeholder={"Enter Tracking Number"} onChangeText={(number) => this.setState({number})} value={this.state.number}/>
              </View>

              <TouchableHighlight onPress={() => {this.onReserveLocker()}} underlayColor={'transparent'}>
                <View style={{height: 50, borderRadius: 4, backgroundColor: this.state.buttonColor, marginLeft: 21, marginTop: 25, marginRight: 21}}>
                  <Text style={{textAlign: 'center', color: Colors.white, marginTop: 17}}>{this.state.buttonText}</Text>
                </View>
              </TouchableHighlight>
            </Content>
            <FooterTabWithNavigation navigation={this.props.navigation} active={"ship"}/>
          </Container>
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    ...Platform.select({
      ios: {
        color: Theme.primaryColor
      },
      android: {
        color: Colors.white
      }
    })
  },
  iconSelected: {
    ...Platform.select({
      ios: {
        color: Theme.secondaryColor
      },
      android: {
        color: Theme.secondaryColor
      }
    })
  },
  footer: {
    ...Platform.select({
      android: {
        backgroundColor: Theme.primaryColor,
      }
    })
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 25,
    height: 25,
    borderRadius: 50/2,
    borderWidth: 1,
    position: 'absolute',
    borderColor: Colors.gray_85,
    right: 10,
    top: 5
  },
  activeCircle: {
    width: 25,
    height: 25,
    borderRadius: 50/2,
    backgroundColor: Colors.light_green,
    position: 'absolute',
    right: 10,
    top: 5
  }
});
