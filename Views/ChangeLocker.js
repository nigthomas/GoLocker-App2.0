import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, FlatList, TextInput, TouchableHighlight, Alert, SafeAreaView} from 'react-native';
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
import LockerService from '../Services/LockerService'
import NativeStatusBar from '../Elements/NativeStatusBar'

export default class ChangeLocker extends Component {
  static navigationOptions = { header: null, tabBarVisible: false };

  constructor(props) {
   super(props);

   const { params } = this.props.navigation.state;
   const selectedLocker = params.selectedLocker

   this.state = {
     lockers: [],
     selectedLocker: selectedLocker,
     loading: false,
     error: null
   };
  }

  componentDidMount() {
    this.setState({loading: true})
    this.fetch()
  }

  onBackPress() {
    this.props.navigation.goBack()
  }

  fetch() {
    Promise.all([LockerService.getInstance().getLockers()])
    .then(results => {
      this.setState({lockers: results[0], loading: false, error: null})
    })
    .catch(err => {
      this.setState({error: err, loading: false})
    })
  }

  selectLocker(locker) {
    const selectedLocker = this.state.selectedLocker
    if(selectedLocker.isPrimaryLocker()) {
      LockerService.getInstance().setPrimaryLocker(locker.id)
      .then(() => {
        Alert.alert("", "Locker updated",[{text: 'OK', onPress: () => {
          const { navigation } = this.props;
          navigation.popToTop()
        }}],{ cancelable: false })
      })
      .catch(err => {
        console.log(err)
        this.setState({error: err})
      })
    } else {
      LockerService.getInstance().setSecondaryLocker(locker.id)
      .then(() => {
        Alert.alert("", "Locker updated",[{text: 'OK', onPress: () => {
          const { navigation } = this.props;
          navigation.popToTop()
        }}],{ cancelable: false })
      })
      .catch(err => {
        console.log(err)

        this.setState({error: err})
      })
    }
  }

  onChangePosition(locker) {
    Alert.alert(
    '',
    locker.propertyName(),
    [
      {text: 'Set as primary', onPress: () => this.changeToPrimary(locker)},
      {text: 'Set as secondary', onPress: () => this.changeToSecondary(locker)},
      {text: 'Cancel', onPress: () => {}, style: 'cancel'}
    ],
    { cancelable: true }
  )
  }

  changeToSecondary(locker) {
    LockerService.getInstance().setSecondaryLocker(locker.id)
    .then(() => {
      Alert.alert("", "Locker updated",[{text: 'OK', onPress: () => {
        const { navigation } = this.props;
        navigation.popToTop()
      }}],{ cancelable: false })
    })
    .catch(err => {
      console.log(err)

      this.setState({error: err})
    })
  }

  changeToPrimary(locker) {
    LockerService.getInstance().setPrimaryLocker(locker.id)
    .then(() => {
      Alert.alert("", "Locker updated",[{text: 'OK', onPress: () => {
        const { navigation } = this.props;
        navigation.popToTop()
      }}],{ cancelable: false })
    })
    .catch(err => {
      console.log(err)
      this.setState({error: err})
    })
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

    return (
      <TouchableHighlight onPress={() => {this.selectLocker(locker)}} underlayColor={'transparent'} key={locker.id}>
        <View style={{height: 70, flex: 1, paddingLeft:21, paddingTop: 3, paddingRight:21}}>
          <Text style={{paddingTop: 3, color: Colors.dark_gray, fontWeight: 'bold', fontSize: 16}}>{name}</Text>
          <View><Text style={{color: Colors.gray_b5, fontSize: 14}}>{fullAddress}</Text></View>
          <Entypo name="chevron-small-right" size={25} style={{color: Colors.gray_85, position: 'absolute', right: 21, top: 20}}/>
        </View>
      </TouchableHighlight>
    )
  }

  render() {
    if(this.state.loading) {
      return <View style={{flex: 1, backgroundColor: Colors.white}}>
              <LoadingView />
              <FooterTabWithNavigation navigation={this.props.navigation} active={"details"}/>
            </View>
    }

    const errorText = this.state.error ? <Text style={{marginLeft: 21, color: Colors.red, marginTop: 5}}>Something is wrong. Please try again</Text> : null
    return (
      <Root>
        <Container>
        <NativeStatusBar/>
          <Content style={{backgroundColor: Colors.white}}>
            <SafeAreaView style={{marginTop: 20}}>
              <ThreeHeaderView title={"Change Locker"} leftButtonTitle={"Back"} rightButtonTitle={"Set as"} onLeftPress={() => {this.onBackPress()}} onRightPress={() => {this.onChangePosition(this.state.selectedLocker)}}/>
            </SafeAreaView>
            {errorText}
            <FlatList
              style={{flex: 1}}
              data={this.state.lockers}
              keyExtractor={(item, index) => item.id}
              renderItem={({ item }) => {return this.renderLockerItem(item)}}
            />
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
