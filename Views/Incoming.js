import React, { Component } from 'react';
import Theme from '../Common/Theme'
import FooterTabWithNavigation from './FooterTabWithNavigation'
import { Container, Header, Content, Card, CardItem, Left, Thumbnail, Body, Button, Icon, Title, Footer, FooterTab, Root, Right} from 'native-base';
import { StyleSheet, Text, View, StatusBar, FlatList, TouchableHighlight, SafeAreaView} from 'react-native';
import LoadingView from './Loading'
import DashboardService from '../Services/DashboardService'
import ReservationService from '../Services/ReservationService'
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons'
import ClearButton from '../Elements/ClearButton'
import HeaderView from '../Elements/HeaderView'
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons'
import Moment from 'moment'
import Utils from '../Common/Utils'
import Swipeout from 'react-native-swipeout';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome'

export default class IncomingView extends Component {
  static navigationOptions = { title: 'Packages', header: null, tabBarVisible: false };

  constructor(props) {
   super(props);

   this.state = {
     dashboardData: {},
     reservationData: [],
     loading: false,
     error: null
   };
  }

  componentDidMount() {
    this.setState({loading: true})
    this.fetch()

    const { params } = this.props.navigation.state;
    ReservationService.getInstance().getListener()
    .on("CREATED_RESERVATION", () => {
      this.setState({loading: true})
      this.fetch()
    })
  }

  onRefresh() {
    this.setState({loading: true})
    this.fetch()
  }

  fetch() {
    Promise.all([DashboardService.getInfo(),
                 ReservationService.getInstance().getReservations()])
    .then(results => {
      this.setState({dashboardData: results[0], reservationData: results[1], loading: false, error: null})
    })
    .catch(err => {
      this.setState({error: err, loading: false})
    })
  }

  cancelReservation(reservation) {
    ReservationService.getInstance().cancelReservation(reservation.id)
    .then(() => {
        return ReservationService.getInstance().getReservations()
    })
    .then(results => {
      this.setState({reservationData: results, loading: false, error: null})
    })
    .catch(err => {
      this.setState({reservationData: results, loading: false, error: err})
    })
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

  renderEmptyList(firstName, lastName) {
    const errorText = this.state.error ? <Text style={{marginLeft: 21, color: Colors.red, marginTop: 5}}>Something is wrong. Please try again</Text> : null

    return (
      <Root>
        <Container>
          <Content style={{backgroundColor: Colors.white, flex: 1}}>
            <TouchableHighlight onPress={() => {this.onRefresh()}} underlayColor={'transparent'}>
              <SafeAreaView style={{height: 30, width: 50, marginTop: 40, marginRight: 21, alignSelf: 'flex-end'}}>
                <FontAwesome name="refresh" size={22} style={{color: Colors.gray_85,  alignSelf: 'flex-end'}}/>
              </SafeAreaView>
            </TouchableHighlight>
            <View>
              <Text style={{marginLeft: 21, fontSize: Utils.normalize(36), color: Colors.dark_gray, fontWeight: 'bold'}}>Tracking</Text>
            </View>
            <View style={{marginTop: 20, marginLeft: 21}}>
              <Text style={{fontSize: Utils.normalize(16), color: Colors.gray_85, fontWeight: 'bold'}}>You have no packages</Text>
            </View>
            {errorText}
          </Content>
          <FooterTabWithNavigation navigation={this.props.navigation} active={"incoming"}/>
        </Container>
      </Root>
    );
  }

  render() {
    if(this.state.loading) {
      return <View style={{flex: 1, backgroundColor: Colors.white}}>
              <LoadingView />
              <FooterTabWithNavigation navigation={this.props.navigation} active={"incoming"}/>
            </View>
    }

    const firstName = this.state.dashboardData.firstName
    const lastName = this.state.dashboardData.lastName
    const data = this.state.reservationData

    if(data.length === 0) {
      return this.renderEmptyList(firstName, lastName)
    }

    const errorText = this.state.error ? <Text style={{marginLeft: 21, color: Colors.red, marginTop: 5}}>Something is wrong. Please try again</Text> : null

    return (
      <Root>
        <Container>
          <Content style={{backgroundColor: Colors.white, flex: 1}}>
          <TouchableHighlight onPress={() => {this.onRefresh()}} underlayColor={'transparent'}>
            <View style={{position: 'absolute', right: 21, top: 40, height: 50, width: 50}}>
              <FontAwesome name="refresh" size={22} style={{alignSelf: 'flex-end'}}/>
            </View>
          </TouchableHighlight>
          <View style={{marginTop: 70, flex: 1}}>
            <Text style={{marginLeft: 21, fontSize: Utils.normalize(36), color: Colors.dark_gray, fontWeight: 'bold'}}>Tracking</Text>
          </View>
          {errorText}
            <View style={{marginTop: 20, borderTopColor: Colors.gray_ef, borderTopWidth: 1}}>
              <FlatList data={data} keyExtractor={(item, index) => item.trackingNumber} renderItem={({ item }) => {return this.renderItem(item)}} backgroundColor={'white'}/>
            </View>
          </Content>
          <FooterTabWithNavigation navigation={this.props.navigation} active={"incoming"}/>
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
