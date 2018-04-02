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

export default class HomeView extends Component {
  static navigationOptions = { header: null, tabBarVisible: false };

  constructor(props) {
   super(props);

   this.state = {
     data: {},
     loading: false,
     error: null
   };
  }

  componentDidMount() {
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

  renderLocker(locker) {
    if(!locker) {
      return (<View></View>)
    }

    const location = (locker && locker.property) ? locker.property.location : null

    return 
  }

  render() {
    if(this.state.loading) {
      return <View style={{flex: 1}}>
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

    const primaryLockerView = this.renderLocker(primaryLocker)
    const secondaryLockerView = this.renderLocker(secondaryLocker)

    return (
      <Root>
        <Container>
          <Content style={{backgroundColor: Colors.white}}>
            <View style={{marginTop: 50}}>
              <Text style={{marginLeft: 21, marginTop: 20, fontSize: 36, color: Colors.dark_gray, fontWeight: 'bold'}}>Welcome</Text>
              <Text style={{marginLeft: 21, fontSize: 36, color: Colors.dark_gray, fontWeight: 'bold'}}>{firstName} {lastName}</Text>
              <Text style={{marginLeft: 21, fontSize: 14, color: Colors.gray_b5}}>Account #{accountNumber}</Text>
              <Text style={{marginLeft: 21, marginTop: 40, fontSize: 20, color: Colors.gray_85, fontWeight: 'bold'}}>Location</Text>
            </View>

            <View style={{marginLeft: 21, marginRight: 21}}>
              {primaryLockerView}
            </View>
            <View style={{marginTop: 20, marginLeft: 21, marginRight: 21}}>
              {secondaryLockerView}
            </View>
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
