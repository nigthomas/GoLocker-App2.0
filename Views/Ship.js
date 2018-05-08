import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, Image, Platform, TouchableHighlight, Modal, ScrollView, TextInput, findNodeHandle, Keyboard} from 'react-native';
import { Container, Header, Content, Card, CardItem, Left, Thumbnail, Body, Button, Icon, Title, Footer, FooterTab, Right, ActionSheet, Root} from 'native-base';
import FooterTabWithNavigation from './FooterTabWithNavigation'
import ClearButton from '../Elements/ClearButton'
import Colors from '../Common/Colors'
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
     smallParcelSelected: false,
     mediumParcelSelected: false,
     largeParcelSelected: false,
     choosePackageError: false,
     enterTrackingNumberError: false
   };
  }

  componentDidMount() {
    this.setState({loading: true})
    this.fetch()
  }

  fetch() {
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
    this.setState({sendToLocker: locker})
  }

  onSmallParcelPress() {
    this.setState({smallParcelSelected: true, mediumParcelSelected: false, largeParcelSelected: false})
  }

  onMediumParcelPress() {
    this.setState({smallParcelSelected: false, mediumParcelSelected: true, largeParcelSelected: false})
  }

  onLargeParcelPress() {
    this.setState({smallParcelSelected: false, mediumParcelSelected: false, largeParcelSelected: true})
  }

  onChangeLocker() {
    const { navigate }  = this.props.navigation;
    const primaryLocker = this.state.data.primaryLocker
    const secondaryLocker = this.state.data.secondaryLocker
    const lockers = [primaryLocker, secondaryLocker]

    navigate('SelectLockerView', {lockers: lockers, onLockerSelected: this.selectedLocker.bind(this)})
  }

  onReserveLocker() {
    Keyboard.dismiss()

    this.refs.trackingNumberField.blur();

    const smallParcelSelected = this.state.smallParcelSelected
    const mediumParcelSelected = this.state.mediumParcelSelected
    const largeParcelSelected = this.state.largeParcelSelected
    const locker = this.state.sendToLocker
    const choosePackageError =  !(smallParcelSelected || mediumParcelSelected || largeParcelSelected)
    const enterTrackingNumberError = this.state.number === null

    if(choosePackageError || enterTrackingNumberError) {
      this.component._root.scrollToPosition(0, 0)
      this.setState({choosePackageError: choosePackageError, enterTrackingNumberError: enterTrackingNumberError})
      return
    }

    const accountNumber = null
    const lockerId = this.state.sendToLocker.id

    var parcelSizeCode = null

    if(smallParcelSelected) {
      parcelSizeCode = "S"
    }
    else if (mediumParcelSelected) {
      parcelSizeCode = "M"
    }
    else if (largeParcelSelected) {
      parcelSizeCode = "L"
    }

    if(!parcelSizeCode) {
      return;
    }

    const compartment = _.find(locker.compartmentSizes, (compartment) => {
      return compartment.code === parcelSizeCode
    })

    if(!compartment) {
      return
    }

    ReservationService.getInstance().createReservation(compartment, accountNumber, 1, this.state.number, lockerId)
    .then(() => {
      this.setState({choosePackageError: false, enterTrackingNumberError: false, number: null, smallParcelSelected: false, mediumParcelSelected:false, largeParcelSelected:false})
      const { navigate } = this.props.navigation;
      setTimeout(() => {
        navigate('Incoming', {refresh: true})
      }, 500)
    })
    .catch(err => {
      this.setState({error: err, loading: false})
    })
  }

  render() {
    if(this.state.loading) {
        return <View style={{flex: 1, backgroundColor: Colors.white}}>
                <LoadingView />
                <FooterTabWithNavigation navigation={this.props.navigation} active={"ship"}/>
              </View>
    }

    const firstName = this.state.data.firstName
    const lastName = this.state.data.lastName
    const lockerName = (this.state.sendToLocker && this.state.sendToLocker.property) ? this.state.sendToLocker.property.name: ""

    const smallParcelButton = this.state.smallParcelSelected ? <View style={styles.activeCircle}/> : <View style={styles.circle}/>
    const mediumParcelButton = this.state.mediumParcelSelected ? <View style={styles.activeCircle}/> : <View style={styles.circle}/>
    const largeParcelButton = this.state.largeParcelSelected ? <View style={styles.activeCircle}/> : <View style={styles.circle}/>

    const errorText = this.state.error ? <Text style={{marginLeft: 21, color: Colors.red, marginTop: 5}}>Something is wrong. Please try again</Text> : null

    return (
      <Root>
          <Container>
            <Content style={{backgroundColor: Colors.white}} ref={c => (this.component = c)}>
              <View style={{marginTop: 70}}>
                <Text style={{marginLeft: 21, fontSize: 36, color: Colors.dark_gray, fontWeight: 'bold'}}>Send a package</Text>
              </View>
              {errorText}

              <Text style={{marginLeft: 21, marginTop: 20, fontSize: 16, color: Colors.gray_85, fontWeight: 'bold'}}>Location:</Text>
              <View style={{borderTopColor: Colors.gray_ef, borderTopWidth: 1, borderBottomColor: Colors.gray_ef, borderBottomWidth: 1, marginTop: 15, height: 80}}>
                <TouchableHighlight onPress={this.onLoginPress} underlayColor={'transparent'}>
                  <View>
                  <Text style={{marginLeft: 21, paddingTop:9, fontSize: 14, color: Colors.gray_85}}>GoLocker HQ</Text>
                  <Text style={{fontSize: 14, color: Colors.gray_85, marginLeft: 21, marginTop: 3}}>
                    209A Morgan Avenue - Ste F
                  </Text>
                  <Text style={{fontSize: 14, color: Colors.gray_85, marginLeft: 21, marginTop: 3}}>
                    Brooklyn, NY 11237
                  </Text>
                  </View>
                </TouchableHighlight>
              </View>

              <Text style={{marginLeft: 21, marginTop: 20, fontSize: 16, color: Colors.gray_85, fontWeight: 'bold'}}>Deliver to:</Text>
              <View style={{justifyContent: 'center', borderTopColor: Colors.gray_ef, borderTopWidth: 1, borderBottomColor: Colors.gray_ef, borderBottomWidth: 1, marginTop: 15, height: 50, flex: 1}}>
                <TouchableHighlight onPress={() => {this.onChangeLocker()}} underlayColor={'transparent'}>
                  <Text style={{fontSize: 14, color: Colors.gray_85, marginLeft: 21}}>
                  {lockerName}
                  </Text>
                </TouchableHighlight>
                <Entypo name="chevron-small-right" size={25} style={{color: Colors.gray_85, position: 'absolute', right: 0}}/>
              </View>

              <Text style={{marginLeft: 21, marginTop: 20, fontSize: 16, color: this.state.choosePackageError ? Colors.red : Colors.gray_85, fontWeight: 'bold'}}>Please choose a package size</Text>

              <View style={{justifyContent: 'center', borderTopColor: Colors.gray_ef, borderTopWidth: 1, borderBottomColor: Colors.gray_ef, borderBottomWidth: 1, marginTop: 15, height: 50, flex: 1}}>
                <TouchableHighlight onPress={() => {this.onSmallParcelPress()}} underlayColor={'transparent'}>
                  <View>
                    <Text style={{fontSize: 14, color: Colors.gray_85, marginLeft: 21}}>
                      Small Parcel
                    </Text>
                    <Text style={{fontSize: 10, color: Colors.gray_85, marginLeft: 21, marginTop: 3}}>
                      No bigger than 4 H x 15 W x 24 L
                    </Text>
                    {smallParcelButton}
                  </View>
                </TouchableHighlight>
              </View>

              <View style={{justifyContent: 'center', borderBottomColor: Colors.gray_ef, borderBottomWidth: 1, height: 50, flex: 1}}>
                <TouchableHighlight onPress={() => {this.onMediumParcelPress()}} underlayColor={'transparent'}>
                  <View>
                    <Text style={{fontSize: Utils.normalize(14), color: Colors.gray_85, marginLeft: 21}}>
                      Medium Parcel
                    </Text>
                    <Text style={{fontSize: Utils.normalize(10), color: Colors.gray_85, marginLeft: 21, marginTop: 3}}>
                      No bigger than 8 H x 15 W x 24 L
                    </Text>
                    {mediumParcelButton}
                  </View>
                </TouchableHighlight>
              </View>

              <View style={{justifyContent: 'center', borderBottomColor: Colors.gray_ef, borderBottomWidth: 1, height: 50, flex: 1}}>
                <TouchableHighlight onPress={() => {this.onLargeParcelPress()}} underlayColor={'transparent'}>
                  <View>
                    <Text style={{fontSize: Utils.normalize(14), color: Colors.gray_85, marginLeft: 21}}>
                      Large Parcel
                    </Text>
                    <Text style={{fontSize: Utils.normalize(10), color: Colors.gray_85, marginLeft: 21, marginTop: 3}}>
                      No bigger than 17 H x 15 W x 25 L
                    </Text>
                    {largeParcelButton}
                  </View>
                </TouchableHighlight>
              </View>

              <Text style={{marginLeft: 21, marginTop: 20, fontSize: Utils.normalize(16), color:  this.state.enterTrackingNumberError ? Colors.red : Colors.gray_85, fontWeight: 'bold'}}>Destination Shipping Info</Text>
              <View style={{marginLeft: 21, marginTop: 15, marginRight: 21}}>
                <TextInput underlineColorAndroid='transparent' ref="trackingNumberField" onFocus={() => {this.inputFocused.bind(this, 'trackingNumberField')}} onBlur={() => {this.inputBlurred.bind(this, 'trackingNumberField')}} placeholderTextColor={Colors.gray_85} style={{color: Colors.dark_gray, backgroundColor: Colors.gray_ef, height: 50, borderRadius: 4, fontFamily: Theme.primaryFont, paddingLeft: 10}} placeholder={"Enter Tracking Number"} onChangeText={(number) => this.setState({number})} value={this.state.number}/>
              </View>

              <TouchableHighlight onPress={() => {this.onReserveLocker()}} underlayColor={'transparent'}>
                <View style={{height: 50, borderRadius: 4, backgroundColor: Colors.light_green, marginLeft: 21, marginTop: 25, marginRight: 21}}>
                  <Text style={{textAlign: 'center', color: Colors.white, marginTop: 17}}>Reserve a locker</Text>
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
    top: 3
  },
  activeCircle: {
    width: 25,
    height: 25,
    borderRadius: 50/2,
    backgroundColor: Colors.light_green,
    position: 'absolute',
    right: 10,
    top: 3
  }
});
