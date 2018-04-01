import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, FlatList} from 'react-native';
import Theme from '../Common/Theme'
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
import Swipeout from 'react-native-swipeout';

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
  }

  fetch() {
    Promise.all([DashboardService.getInfo(),
                 ReservationService.getReservations()])
    .then(results => {
      this.setState({dashboardData: results[0], reservationData: results[1], loading: false, error: null})
    })
    .catch(err => {
      this.setState({error: err, loading: false})
    })
  }

  cancelReservation(reservation) {
    ReservationService.cancelReservation(reservation.id)
    .then(() => {
        return ReservationService.getReservations()
    })
    .then(results => {
      this.setState({reservationData: results, loading: false, error: null})
    })
    .catch(err => {
      console.error(err)
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

    return (
      <Swipeout right={swipeBtns}
        backgroundColor= 'transparent'>
        <View style={{height: 93, paddingTop:5, paddingBottom: 5, paddingLeft: 21, paddingRight: 21, flexDirection: 'row', alignSelf: 'flex-start', borderBottomWidth: 1, borderBottomColor: Colors.gray_ef}}>
          <View style={{flex: 1}}>
            <Text style={{ color: Colors.gray_85}}>Name</Text>
            <Text style={{ color: Colors.dark_gray, fontWeight: '600', marginTop: 2}}>{lockerName}</Text>
            <Text style={{ color: Colors.gray_85, marginTop: 20}}>{expiration}</Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={{ color: Colors.gray_85}}>Tracking #</Text>
            <Text style={{ color: Colors.gray_85,  marginTop: 2}}>{trackingNumber}</Text>
            <Text style={{ color: Colors.gray_85, marginTop: 20}}>Pin {pin}</Text>
          </View>
        </View>
      </Swipeout>
    )
  }

  renderEmptyList(firstName, lastName) {
    return (
      <Root>
        <Container>
          <Content style={{backgroundColor: Colors.white}}>
            <View style={{marginTop: 30}}>
              <HeaderView title={`${Utils.capitalize(firstName)} ${Utils.capitalize(lastName)}`} details={"Show QR code"}/>
            </View>
            <View>
              <Text style={{marginLeft: 21, marginTop: 20, fontSize: Utils.normalize(36), color: Colors.dark_gray, fontWeight: 'bold'}}>Incoming</Text>
              <Text style={{marginLeft: 21, fontSize: Utils.normalize(36), color: Colors.dark_gray, fontWeight: 'bold'}}>Packages</Text>
            </View>
            <View style={{marginTop: 20}}>
              <Text style={{marginLeft: 21, marginTop: 20, fontSize: Utils.normalize(16), color: Colors.gray_85, fontWeight: 'bold'}}>You have no incoming packages</Text>
            </View>
          </Content>
          <FooterTabWithNavigation navigation={this.props.navigation} active={"incoming"}/>
        </Container>
      </Root>
    );
  }

  render() {
    if(this.state.loading) {
      return <View style={{flex: 1}}>
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

    return (
      <Root>
        <Container>
          <Content style={{backgroundColor: Colors.white}}>
            <View style={{marginTop: 30}}>
              <HeaderView title={`${Utils.capitalize(firstName)} ${Utils.capitalize(lastName)}`} details={"Show QR code"}/>
            </View>
            <View>
              <Text style={{marginLeft: 21, marginTop: 20, fontSize: Utils.normalize(36), color: Colors.dark_gray, fontWeight: 'bold'}}>Incoming</Text>
              <Text style={{marginLeft: 21, fontSize: Utils.normalize(36), color: Colors.dark_gray, fontWeight: 'bold'}}>Packages</Text>
            </View>
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
